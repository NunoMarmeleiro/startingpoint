namespace StartingPoint.Trip.Application.Repositories;

public interface ITripRepository
{
    Task AddAsync(Domain.Trip trip);
    Task<Domain.Trip?> GetByIdAndOwnerIdAsync(Guid id, Guid ownerId);
    Task UpdateAsync(Domain.Trip trip);
    Task<IEnumerable<Domain.Trip>> GetAllByOwnerIdAsync(Guid ownerId);
    Task DeleteAsync(Domain.Trip trip);
}