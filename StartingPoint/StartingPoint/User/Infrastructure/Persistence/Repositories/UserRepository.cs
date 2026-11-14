using Microsoft.EntityFrameworkCore;
using StartingPoint.User.Application.Repositories;

namespace StartingPoint.User.Infrastructure.Persistence.Repositories;

public class UserRepository(
    UserDbContext dbContext) : IUserRepository
{
    public async Task AddAsync(Domain.User user)
    {
        await dbContext.Users.AddAsync(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Domain.User?> GetByIdAsync(Guid id)
    {
        return await dbContext.Users
            .SingleOrDefaultAsync(trip => trip.Id == id);
    }
}
