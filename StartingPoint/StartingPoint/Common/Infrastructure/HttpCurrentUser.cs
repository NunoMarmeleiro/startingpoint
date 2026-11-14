using OpenIddict.Abstractions;
using StartingPoint.Authentication.Application.Exceptions;
using StartingPoint.Common.Application.Abstractions;

namespace StartingPoint.Common.Infrastructure;

internal sealed class HttpCurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    public Guid Id =>
        Guid.TryParse(
            accessor.HttpContext?.User.FindFirst(OpenIddictConstants.Claims.Subject)?.Value,
            out var id)
            ? id
            : throw new UserNotLoggedInException();
}