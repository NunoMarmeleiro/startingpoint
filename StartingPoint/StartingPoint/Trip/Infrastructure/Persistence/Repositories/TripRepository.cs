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

    public async Task<Domain.Trip?> GetByIdAsync(Guid id)
    {
        return await dbContext.Trips
            .Include(trip => trip.PointsOfInterest)
            .SingleOrDefaultAsync(trip => trip.Id == id);
    }

    public async Task UpdateAsync(Domain.Trip trip)
    {
        dbContext.Trips.Update(trip);
        await dbContext.SaveChangesAsync();
    }
}