using System.ComponentModel.DataAnnotations;

namespace StartingPoint.Trip.Application.DTOs;

public sealed record UpdateTripRequestDTO(
    [Required]
    string Name,

    [Required]
    string Destination,

    [Required]
    DateOnly? StartDate,

    [Required]
    DateOnly? EndDate);