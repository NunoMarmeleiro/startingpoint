using StartingPoint.Trip.Domain;

namespace StartingPoint.Trip.Application.DTOs;

public sealed record PointOfInterestResponseDTO(
    Guid Id,
    string Name,
    string? Description,
    POICategory Category,
    string? Address,
    string? Notes);