using Microsoft.EntityFrameworkCore;

namespace StartingPoint.Trip.Infrastructure.Persistence;

public class TripDbContext(DbContextOptions<TripDbContext> options)
    : DbContext(options)
{
    public DbSet<Domain.Trip> Trips => Set<Domain.Trip>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(TripDbContext).Assembly);
    }
}