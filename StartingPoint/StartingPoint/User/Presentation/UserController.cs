using Microsoft.AspNetCore.Mvc;
using StartingPoint.User.Application.DTOs;
using StartingPoint.User.Application.Services;
namespace StartingPoint.User.Presentation;

[ApiController]
[Route("api/users")]
public class UserController(
    UserService userService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<UserResponseDTO>> Register(
        RegisterUserRequestDTO request)
    {
        var response = await userService.RegisterUserAsync(request);
        return CreatedAtAction(
            nameof(GetUserById),
            new { id = response.Id },
            response);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserResponseDTO>> GetUserById(Guid id)
    {
        var result = await userService.GetById(id);
        return Ok(result);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserRequestDTO request)
    {
        var succeeded = await userService.LoginAsync(request);

        if (!succeeded)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(new
        {
            message = "Login successful."
        });
    }
}