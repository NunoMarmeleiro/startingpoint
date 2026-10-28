using Microsoft.AspNetCore.Identity;
using StartingPoint.Authentication.Application.Exceptions;
using StartingPoint.Authorization.Application;
using StartingPoint.Common.Exceptions;
using StartingPoint.User.Application.DTOs;
using StartingPoint.User.Infrastructure.Authentication;
using StartingPoint.User.Presentation;

namespace StartingPoint.Authentication.Application.Services;

public class IdentityUserAuthenticationService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IUserService domainUserService)
    
{
    
    public async Task RegisterUserAsync(
        RegisterUserRequestDTO request)
    {
        
        var email = request.Email.Trim();
        var username = request.Username.Trim();
        var userId = Guid.NewGuid();
        var applicationUser = new ApplicationUser
        {
            Id = userId,
            UserName = username,
            Email = email
        };
        
        var result = await userManager.CreateAsync(
            applicationUser,
            request.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors
                .Select(error => $"{error.Description}")
                .ToList();

            throw new UserRegistrationException(
                string.Join("; ", errors),
                StatusCodes.Status400BadRequest);
        }

        var roleResult = await userManager.AddToRoleAsync(
            applicationUser,
            ApplicationUserRoles.User);

        if (!roleResult.Succeeded)
        {
            var errors = roleResult.Errors
                .Select(error => error.Description)
                .ToList();

            var rollbackResult = await userManager.DeleteAsync(applicationUser);

            if (!rollbackResult.Succeeded)
            {
                throw new UserRegistrationException(
                    "Role assignment failed, and the Identity account could not " +
                    "be rolled back. Manual reconciliation is required.",
                    StatusCodes.Status500InternalServerError);
            }

            throw new UserRegistrationException(
                string.Join("; ", errors),
                StatusCodes.Status500InternalServerError);
        }
        
        
        try
        {
            await domainUserService.CreateUserAsync(userId,username, email);
        }
        catch
        {
            var rollbackResult = await userManager.DeleteAsync(applicationUser);
            if (!rollbackResult.Succeeded)
            {
                throw new UserRegistrationException(
                    "Domain user persistence failed, and the Identity account " +
                    "could not be rolled back. Manual reconciliation is required.",
                    StatusCodes.Status500InternalServerError);
            }
            throw;
        }
        
        
    }
    public async Task LoginAsync(LoginUserRequestDTO request)
    {
        var email = request.Email.Trim();
        var password = request.Password;
        var user = await signInManager.UserManager
            .FindByEmailAsync(email);

        if (user is null) throw new UserLoginException();
        
        var result = await signInManager.PasswordSignInAsync(
            user.UserName!,
            password,
            isPersistent: false,
            lockoutOnFailure: true);
        
        if (!result.Succeeded) throw new UserLoginException();
    }
    

    public async Task LogoutAsync()
    {
        await signInManager.SignOutAsync();
    }
}