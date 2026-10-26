
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using StartingPoint.User.Application.Authorization;
using Microsoft.AspNetCore;

namespace StartingPoint.Authentication.Presentation;

[ApiController]
public class AuthorizationController(
    IUserAuthorizationService userAuthorizationService) : Controller
{
    [HttpGet("~/connect/authorize")]
    [HttpPost("~/connect/authorize")]
    public async Task<IActionResult> Authorize()
    {
        var request = HttpContext.GetOpenIddictServerRequest()
            ?? throw new InvalidOperationException(
                "The OpenID Connect request cannot be retrieved.");

        var authentication = await HttpContext.AuthenticateAsync(
            IdentityConstants.ApplicationScheme);

        if (!authentication.Succeeded || authentication.Principal is null)
        {
            return Unauthorized(new
            {
                error = "login_required",
                error_description = "You must log in before authorizing."
            });
        }

        var principal = await userAuthorizationService.CreatePrincipalAsync(
            authentication.Principal);

        if (principal is null)
        {
            return Unauthorized();
        }

        principal.SetScopes(request.GetScopes());

        principal.SetDestinations(claim => claim.Type switch
        {
            OpenIddictConstants.Claims.Subject =>
            [
                OpenIddictConstants.Destinations.AccessToken,
                OpenIddictConstants.Destinations.IdentityToken
            ],

            OpenIddictConstants.Claims.Name or
            OpenIddictConstants.Claims.Email or
            OpenIddictConstants.Claims.Role =>
            [
                OpenIddictConstants.Destinations.AccessToken,
                OpenIddictConstants.Destinations.IdentityToken
            ],

            _ => []
        });

        return SignIn(
            principal,
            OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
    }
    
    
    [HttpPost("~/connect/token")]
    public async Task<IActionResult> Exchange()
    {
        var request = HttpContext.GetOpenIddictServerRequest()
                      ?? throw new InvalidOperationException(
                          "The OpenID Connect request cannot be retrieved.");

        if (!request.IsAuthorizationCodeGrantType())
        {
            throw new InvalidOperationException(
                "The specified grant type is not supported.");
        }

        var authentication = await HttpContext.AuthenticateAsync(
            OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);

        var principal = authentication.Principal;

        if (!authentication.Succeeded || principal is null)
        {
            return Forbid(
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }

        return SignIn(
            principal,
            OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
    }

}
