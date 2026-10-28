using Microsoft.EntityFrameworkCore;

namespace StartingPoint.User.Infrastructure.Persistence;

public class UserDbContext(DbContextOptions<UserDbContext> options) : DbContext(options)
{
    public DbSet<Domain.User> Users => Set<Domain.User>();
}