namespace StartingPoint.Trip.Application.DTOs;

public sealed record TripResponseDTO(
    Guid Id,
    string Name,
    string Destination,
    DateOnly StartDate,
    DateOnly EndDate);