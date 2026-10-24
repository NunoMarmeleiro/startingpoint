using StartingPoint.User.Domain;

namespace StartingPoint.User.Application.Repositories;

public interface IUserRepository
{
    Task AddAsync(Domain.User user);
    Task<Domain.User?> GetByIdAsync(Guid id);
}