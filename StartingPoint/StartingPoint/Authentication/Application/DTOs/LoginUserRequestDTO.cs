using System.ComponentModel.DataAnnotations;

namespace StartingPoint.Authentication.Application.DTOs;

public class LoginUserRequestDTO
{
    [Required]
    public string EmailOrUsername { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}