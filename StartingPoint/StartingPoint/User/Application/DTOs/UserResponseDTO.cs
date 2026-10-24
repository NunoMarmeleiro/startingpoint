namespace StartingPoint.User.Application.DTOs;

public record UserResponseDTO(
    Guid Id,
    string Email,
    string Username,
    DateTimeOffset CreatedAt
    );