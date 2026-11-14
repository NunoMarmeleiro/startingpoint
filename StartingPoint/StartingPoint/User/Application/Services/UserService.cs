using Microsoft.AspNetCore.Identity;
using StartingPoint.Authentication.Application.Services;
using StartingPoint.Common.Exceptions;
using StartingPoint.User.Application.DTOs;
using StartingPoint.User.Application.Repositories;
using StartingPoint.User.Infrastructure.Authentication;
using StartingPoint.User.Presentation;

namespace StartingPoint.User.Application.Services;

public class UserService(
    IUserRepository userRepository
    ) : IUserService
{
    
    public async Task<UserResponseDTO> GetById(Guid id)
    {
        var user = await userRepository.GetByIdAsync(id);
        
        return user is null 
            ? throw new EntityNotFoundException(nameof(Domain.User), id) 
            : new UserResponseDTO(user.Id, user.Email,user.Username, user.CreatedAt);
    }

    public async Task CreateUserAsync(
        Guid id,
        string username,
        string email)
    {
        var domainUser = Domain.User.Create(id, email, username);
        await userRepository.AddAsync(domainUser);
    }
}