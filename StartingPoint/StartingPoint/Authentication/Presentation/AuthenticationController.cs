using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Validation.AspNetCore;
using StartingPoint.Authentication.Application.DTOs;
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
    [AllowAnonymous]
    public async Task<IActionResult> Register(
        RegisterUserRequestDTO request)
    {
        await identityUserAuthenticationService.RegisterUserAsync(request);
        return Created();
    }
    
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginUserRequestDTO request)
    {
        await identityUserAuthenticationService.LoginAsync(request);
        return Ok();
    }
    
    [Authorize(Policy = "User")]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await identityUserAuthenticationService.GetCurrentUserAsync();
        return Ok(user);
    }
}