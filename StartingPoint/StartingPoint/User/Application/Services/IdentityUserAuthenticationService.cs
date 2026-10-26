using Microsoft.AspNetCore.Identity;
using StartingPoint.User.Infrastructure.Authentication;

namespace StartingPoint.User.Application.Services;

public class IdentityUserAuthenticationService(
    SignInManager<ApplicationUser> signInManager)
    
{
    public async Task<bool> LoginAsync(
        string email,
        string password)
    {
        var user = await signInManager.UserManager
            .FindByEmailAsync(email.Trim());

        if (user is null)
        {
            return false;
        }

        var result = await signInManager.PasswordSignInAsync(
            user.UserName!,
            password,
            isPersistent: false,
            lockoutOnFailure: true);

        return result.Succeeded;
    }

    public async Task LogoutAsync()
    {
        await signInManager.SignOutAsync();
    }
}