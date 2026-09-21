using System.ComponentModel.DataAnnotations;
using StartingPoint.Trip.Domain;

namespace StartingPoint.Trip.Application.DTOs;

public sealed record UpdatePointOfInterestRequestDTO
(
    [Required]
    string Name,
    [Required]
    POICategory Category,
    string? Description,
    string? Address,
    string? Notes);