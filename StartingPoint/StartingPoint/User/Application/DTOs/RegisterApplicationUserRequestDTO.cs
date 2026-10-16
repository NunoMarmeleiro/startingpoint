namespace StartingPoint.User.Application.DTOs;

public sealed record RegisterApplicationUserRequestDTO
(
    string Email,
    string Password
);