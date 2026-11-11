using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using OpenIddict.Abstractions;
using StartingPoint.User.Infrastructure.Authentication;

namespace StartingPoint.Authorization.Application.Services;

public class IdentityUserAuthorizationService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IOpenIddictAuthorizationManager authorizationManager,
    IOpenIddictTokenManager tokenManager)
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
            principal.AddClaim(
                OpenIddictConstants.Claims.Role,
                role);
        }

        return principal;
    }

    public async Task RevokeAllSessionsAsync(ClaimsPrincipal cookiePrincipal)
    {
        var subject = userManager.GetUserId(cookiePrincipal);
        if (string.IsNullOrEmpty(subject)) return;

        await foreach (var authorization in authorizationManager.FindBySubjectAsync(subject))
        {
            var id = await authorizationManager.GetIdAsync(authorization);
            if (id is not null)
                await tokenManager.RevokeByAuthorizationIdAsync(id);

            await authorizationManager.TryRevokeAsync(authorization);
        }
    }
}