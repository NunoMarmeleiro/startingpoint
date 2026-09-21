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
    
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TripResponseDTO>> UpdateTrip(
        Guid id,
        UpdateTripRequestDTO request)
    {
        var trip = await _tripService.UpdateTrip(id, request);
        return Ok(trip);
    }
    
    [HttpPost("{tripId:guid}/points-of-interest")]
    public async Task<IActionResult> AddPointOfInterest(
        Guid tripId,
        AddPointOfInterestRequestDTO request)
    {
        await _tripService.AddPointOfInterest(
            tripId,
            request.Name,
            request.Category,
            request.Description,
            request.Address,
            request.Notes);

        return NoContent();
    }
    
    [HttpPut("{tripId:guid}/points-of-interest/{pointOfInterestId:guid}")]
    public async Task<IActionResult> UpdatePointOfInterest(
        Guid tripId,
        Guid pointOfInterestId,
        UpdatePointOfInterestRequestDTO request)
    {
        await _tripService.UpdatePointOfInterest(
            tripId,
            pointOfInterestId,
            request.Name,
            request.Category,
            request.Description,
            request.Address,
            request.Notes);

        return NoContent();
    }
}