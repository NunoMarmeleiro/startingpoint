using Microsoft.AspNetCore.Identity;
using StartingPoint.User.Application.DTOs;
using StartingPoint.User.Infrastructure.Authentication;

namespace StartingPoint.User.Application.Services;

public class ApplicationUserService(
    UserManager<ApplicationUser> userManager)
{
    public async Task<IdentityResult> RegisterApplicationUserAsync(
        RegisterApplicationUserRequestDTO request)
    {
        var email = request.Email.Trim();

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email
        };

        return await userManager.CreateAsync(user, request.Password);
    }
}