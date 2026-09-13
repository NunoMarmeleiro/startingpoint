using Microsoft.AspNetCore.Mvc;
using StartingPoint.Trip.Application.DTOs;
using StartingPoint.Trip.Application.Services;
using StartingPoint.Trip.Domain;

namespace StartingPoint.Trip.Presentation;

[ApiController]
[Route("api/trips")]
public class TripController : ControllerBase
{
    private readonly TripService _tripService;
    public TripController(TripService tripService)
    {
        _tripService =  tripService;
    }
    
    [HttpPost]
    public async Task<ActionResult<TripResponseDTO>> CreateTrip(
        CreateTripRequestDTO request)
    {
        var response = await _tripService.CreateTrip(request);
        return CreatedAtAction(
            nameof(GetTripById),
            new { id = response.Id },
            response);
    }
    
    [HttpGet("{id:guid}")]

    public async Task<ActionResult<TripResponseDTO>> GetTripById(Guid id)
    {
        var response = await _tripService.GetTripById(id);
        return Ok(response);
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripResponseDTO>>> GetAll()
    {
        var trips = await _tripService.GetAllTrips();

        return Ok(trips);
    }
}