namespace StartingPoint.User.Application.DTOs;

public record CurrentUserResponseDTO(
    Guid Id,
    string Email,
    string Username
);