using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using OpenIddict.Abstractions;
using StartingPoint.User.Infrastructure.Authentication;

namespace StartingPoint.Authorization.Application.Services;

public class IdentityUserAuthorizationService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager)
{
    public async Task<ClaimsPrincipal?> CreatePrincipalAsync(
        ClaimsPrincipal authenticatedUser)
    {
        var user = await userManager.GetUserAsync(authenticatedUser);

        if (user is null)
        {
            return null;
        }

        var principal = await signInManager.CreateUserPrincipalAsync(user);

        principal.SetClaim(
            OpenIddictConstants.Claims.Subject,
            await userManager.GetUserIdAsync(user));

        var roles = await userManager.GetRolesAsync(user);

        foreach (var role in roles)
        {
            principal.SetClaim(
                OpenIddictConstants.Claims.Role,
                role);
        }

        return principal;
    }
}