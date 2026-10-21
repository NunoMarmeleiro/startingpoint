using Microsoft.EntityFrameworkCore;
using StartingPoint.User.Application.Repositories;

namespace StartingPoint.User.Infrastructure.Persistence.Repositories;

public class UserRepository(
    ApplicationIdentityDbContext dbContext) : IUserRepository
{
    public async Task AddAsync(Domain.User user)
    {
        await dbContext.DomainUsers.AddAsync(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Domain.User?> GetByIdAsync(Guid id)
    {
        return await dbContext.DomainUsers
            .SingleOrDefaultAsync(trip => trip.Id == id);
    }
}
