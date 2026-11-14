using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Validation.AspNetCore;
using StartingPoint.Trip.Application.DTOs;
using StartingPoint.Trip.Application.Services;

namespace StartingPoint.Trip.Presentation;

[ApiController]
[Route("api/trips")]
public class TripController(TripService tripService) : ControllerBase
{
    [HttpPost]
    [Authorize(Policy = "User")]
    public async Task<ActionResult<TripResponseDTO>> CreateTrip(
        CreateTripRequestDTO request)
    {
        var response = await tripService.CreateTrip(request);
        return CreatedAtAction(
            nameof(GetTripById),
            new { id = response.Id },
            response);
    }
    
    [HttpGet("{id:guid}")]
    [Authorize(Policy = "User")]
    public async Task<ActionResult<TripResponseDTO>> GetTripById(Guid id)
    {
        var response = await tripService.GetTripById(id);
        return Ok(response);
    }
    
    [Authorize(Policy = "User")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TripResponseDTO>>> GetAll()
    {
        var trips = await tripService.GetAllTrips();
        return Ok(trips);
    }
    
    [HttpPut("{id:guid}")]
    [Authorize(Policy = "User")]
    public async Task<ActionResult<TripResponseDTO>> UpdateTrip(
        Guid id,
        UpdateTripRequestDTO request)
    {
        var trip = await tripService.UpdateTrip(id, request);
        return Ok(trip);
    }
    
    [HttpPost("{tripId:guid}/points-of-interest")]
    [Authorize(Policy = "User")]
    public async Task<IActionResult> AddPointOfInterest(
        Guid tripId,
        AddPointOfInterestRequestDTO request)
    {
        await tripService.AddPointOfInterest(
            tripId,
            request.Name,
            request.Category,
            request.Description,
            request.Address,
            request.Notes);

        return StatusCode(StatusCodes.Status201Created);
    }
    
    [HttpPut("{tripId:guid}/points-of-interest/{pointOfInterestId:guid}")]
    [Authorize(Policy = "User")]
    public async Task<IActionResult> UpdatePointOfInterest(
        Guid tripId,
        Guid pointOfInterestId,
        UpdatePointOfInterestRequestDTO request)
    {
        await tripService.UpdatePointOfInterest(
            tripId,
            pointOfInterestId,
            request.Name,
            request.Category,
            request.Description,
            request.Address,
            request.Notes);

        return NoContent();
    }
    
    [HttpDelete("{tripId:guid}/points-of-interest/{pointOfInterestId:guid}")]
    [Authorize(Policy = "User")]
    public async Task<IActionResult> DeletePointOfInterest(
        Guid tripId,
        Guid pointOfInterestId)
    {
        await tripService.DeletePointOfInterest(
            tripId,
            pointOfInterestId);

        return NoContent();
    }
    
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "User")]
    public async Task<IActionResult> DeleteTrip(Guid id)
    {
        await tripService.DeleteTrip(id);

        return NoContent();
    }
}