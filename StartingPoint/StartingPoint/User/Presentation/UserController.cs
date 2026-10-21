using Microsoft.AspNetCore.Mvc;
using StartingPoint.User.Application.DTOs;
using StartingPoint.User.Application.Services;
namespace StartingPoint.User.Presentation;

[ApiController]
[Route("api/users")]
public class UserController(
    ApplicationUserService applicationUserService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterApplicationUserRequestDTO request)
    {
        var result = await applicationUserService.RegisterApplicationUserAsync(request);

        if (result.Succeeded) return StatusCode(StatusCodes.Status201Created);
        var errors = result.Errors.Select(error => new
        {
            error.Code,
            error.Description
        });
        return BadRequest(new { errors });

    }
}