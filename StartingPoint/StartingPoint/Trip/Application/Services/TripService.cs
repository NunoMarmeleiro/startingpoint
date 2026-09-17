using StartingPoint.Common.Exceptions;
using StartingPoint.Trip.Application.DTOs;
using StartingPoint.Trip.Application.Repositories;
using StartingPoint.Trip.Domain;

namespace StartingPoint.Trip.Application.Services;

public class TripService
{
    private readonly ITripRepository _repository;
    public TripService(ITripRepository repository)
    {
        _repository = repository;
    }
    
    public async Task<TripResponseDTO> CreateTrip(
        CreateTripRequestDTO request)
    {
        var dateRange = DateRange.Create(
            request.StartDate,
            request.EndDate);

        var trip = Domain.Trip.Create(
            request.Name,
            request.Destination,
            dateRange);

        await _repository.AddAsync(trip);

        return new TripResponseDTO(
            trip.Id,
            trip.Name,
            trip.Destination,
            trip.DateRange.Start,
            trip.DateRange.End);
    }

    public async Task<TripResponseDTO> GetTripById(Guid id)
    {
        var trip = await _repository.GetByIdAsync(id);
        if (trip is null)
        {
            throw new EntityNotFoundException(nameof(Trip), id);
        }
        return new TripResponseDTO(
            trip.Id,
            trip.Name,
            trip.Destination,
            trip.DateRange.Start,
            trip.DateRange.End);
    }
    
    public async Task AddPointOfInterest(
        Guid tripId,
        string name,
        POICategory category,
        string? description = null,
        string? address = null,
        string? notes = null)
    {
        var trip = await _repository.GetByIdAsync(tripId);

        if (trip is null)
        {
            throw new InvalidOperationException("Trip was not found.");
        }

        var pointOfInterest = PointOfInterest.Create(
            name,
            category,
            description,
            address,
            notes);

        trip.AddPointOfInterest(pointOfInterest);

        await _repository.UpdateAsync(trip);
    }
    
    public async Task<IEnumerable<TripResponseDTO>> GetAllTrips()
    {
        var trips = await _repository.GetAllAsync();

        return trips.Select(trip => new TripResponseDTO
        (
            trip.Id,
            trip.Name,
            trip.Destination,
            trip.DateRange.Start,
            trip.DateRange.End
        ));
    }
    
    public async Task<TripResponseDTO> UpdateTrip(
        Guid id,
        UpdateTripRequestDTO request)
    {
        var trip = await _repository.GetByIdAsync(id);

        if (trip is null)
        {
            throw new EntityNotFoundException(nameof(Trip), id);
        }

        var dateRange = DateRange.Create(
            request.StartDate!.Value,
            request.EndDate!.Value);

        trip.Update(
            request.Name,
            request.Destination,
            dateRange);

        await _repository.UpdateAsync(trip);

        return new TripResponseDTO(
            trip.Id,
            trip.Name,
            trip.Destination,
            trip.DateRange.Start,
            trip.DateRange.End);
    }
}