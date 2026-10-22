using System.ComponentModel.DataAnnotations;

namespace StartingPoint.User.Application.DTOs;

public sealed record RegisterUserRequestDTO
(
    [Required]
    string Email,
    [Required]
    string Username,
    [Required]
    string Password
    
);