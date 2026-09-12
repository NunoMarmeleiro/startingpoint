namespace StartingPoint.Trip.Application.DTOs;

public sealed record CreateTripRequestDTO(
    string Name,
    string Destination,
    DateOnly StartDate,
    DateOnly EndDate);