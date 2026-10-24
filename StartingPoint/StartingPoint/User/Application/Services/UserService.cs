using Microsoft.AspNetCore.Identity;
using StartingPoint.Common.Exceptions;
using StartingPoint.User.Application.Authorization;
using StartingPoint.User.Application.DTOs;
using StartingPoint.User.Application.Exceptions;
using StartingPoint.User.Application.Repositories;
using StartingPoint.User.Infrastructure.Authentication;

namespace StartingPoint.User.Application.Services;

public class UserService(
    UserManager<ApplicationUser> userManager,
    IUserRepository userRepository)
{
    public async Task<UserResponseDTO> RegisterUserAsync(
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
            UserRoles.User);

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
        
        
        var domainUser = Domain.User.Create(userId,email,username);
        try
        {
            await userRepository.AddAsync(domainUser);
            return new UserResponseDTO(
                domainUser.Id,
                domainUser.Email,
                domainUser.Username,
                domainUser.CreatedAt
                );
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

    public async Task<UserResponseDTO> GetById(Guid id)
    {
        var user = await userRepository.GetByIdAsync(id);
        
        return user is null 
            ? throw new EntityNotFoundException(nameof(Domain.User), id) 
            : new UserResponseDTO(user.Id, user.Email,user.Username, user.CreatedAt);
    }
}