using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StartingPoint.Authentication.Application.Services;
using StartingPoint.User.Application.DTOs;
using StartingPoint.User.Application.Services;

namespace StartingPoint.Authentication.Presentation;

[ApiController]
[Route("api/auth")]
public class AuthenticationController(
    IdentityUserAuthenticationService identityUserAuthenticationService
    ) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterUserRequestDTO request)
    {
        await identityUserAuthenticationService.RegisterUserAsync(request);
        return Created();
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginUserRequestDTO request)
    {
        await identityUserAuthenticationService.LoginAsync(request);
        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await identityUserAuthenticationService.LogoutAsync();
        return Ok();
    }
    
    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(User.Identity?.IsAuthenticated);
    }
}