using System.ComponentModel.DataAnnotations;

namespace StartingPoint.Authentication.Application.DTOs;

public class LoginUserRequestDTO
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}