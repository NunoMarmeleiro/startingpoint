using Microsoft.EntityFrameworkCore;
using StartingPoint.Trip.Application.Repositories;

namespace StartingPoint.Trip.Infrastructure.Persistence.Repositories;

public class TripRepository(TripDbContext dbContext) : ITripRepository
{
    public async Task AddAsync(Domain.Trip trip)
    {
        await dbContext.Trips.AddAsync(trip);
        await dbContext.SaveChangesAsync();
    }

    public async Task<Domain.Trip?> GetByIdAndOwnerIdAsync(Guid id, Guid ownerId)
    {
        return await dbContext.Trips
            .Include(trip => trip.PointsOfInterest)
            .AsSplitQuery()
            .SingleOrDefaultAsync(
                trip => trip.Id == id && trip.OwnerId == ownerId);
    }

    public async Task UpdateAsync(Domain.Trip trip)
    {
        await dbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<Domain.Trip>> GetAllByOwnerIdAsync(Guid ownerId)
    {
        return await dbContext.Trips
            .AsNoTracking()
            .Include(trip => trip.PointsOfInterest)
            .AsSplitQuery()
            .Where(trip => trip.OwnerId == ownerId)
            .ToListAsync();
    }

    public async Task DeleteAsync(Domain.Trip trip)
    {
        dbContext.Trips.Remove(trip);
        await dbContext.SaveChangesAsync();
    }
}