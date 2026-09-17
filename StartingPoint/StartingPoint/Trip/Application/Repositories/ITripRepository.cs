namespace StartingPoint.Trip.Application.Repositories;

public interface ITripRepository
{
    Task AddAsync(Domain.Trip trip);
    Task<Domain.Trip?> GetByIdAsync(Guid id);
    Task UpdateAsync(Domain.Trip trip);
    Task<IEnumerable<Domain.Trip>> GetAllAsync();
}