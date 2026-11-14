using StartingPoint.User.Application.DTOs;

namespace StartingPoint.User.Presentation;

public interface IUserService
{
    public Task<UserResponseDTO> GetById(Guid id);
    public Task CreateUserAsync(Guid id, string username, string email);


}