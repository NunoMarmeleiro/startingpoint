using Microsoft.AspNetCore.Mvc;
using StartingPoint.User.Application.DTOs;
namespace StartingPoint.User.Presentation;

[ApiController]
[Route("api/users")]
public class UserController(
    IUserService userService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserResponseDTO>> GetUserById(Guid id)
    {
        var result = await userService.GetById(id);
        return Ok(result);
    }
}