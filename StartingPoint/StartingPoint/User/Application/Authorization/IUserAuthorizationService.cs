using System.Security.Claims;

namespace StartingPoint.User.Application.Authorization;

public interface IUserAuthorizationService
{
    Task<ClaimsPrincipal?> CreatePrincipalAsync(
        ClaimsPrincipal authenticatedUser);
}