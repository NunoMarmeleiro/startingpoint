using OpenIddict.Abstractions;

namespace StartingPoint.Authorization.Infrastructure;

public static class OpenIddictClientSeeder
{
    public static async Task SeedAsync(
        IServiceProvider services,
        IConfiguration configuration)
    {
        var clientId = configuration["OpenIddict:Frontend:ClientId"]
                       ?? throw new InvalidOperationException(
                           "OpenIddict frontend ClientId is not configured.");

        var redirectUri = configuration["OpenIddict:Frontend:RedirectUri"]
                          ?? throw new InvalidOperationException(
                              "OpenIddict frontend RedirectUri is not configured.");

        var manager = services.GetRequiredService<IOpenIddictApplicationManager>();

        if (await manager.FindByClientIdAsync(clientId) is not null)
        {
            return;
        }

        var descriptor = new OpenIddictApplicationDescriptor
        {
            ClientId = clientId,
            DisplayName = "StartingPoint React Frontend",
            ClientType = OpenIddictConstants.ClientTypes.Public,
            ConsentType = OpenIddictConstants.ConsentTypes.Implicit
        };

        descriptor.RedirectUris.Add(new Uri(redirectUri));

        descriptor.Permissions.UnionWith(
        [
            OpenIddictConstants.Permissions.Endpoints.Authorization,
            OpenIddictConstants.Permissions.Endpoints.Token,
            OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode,
            OpenIddictConstants.Permissions.ResponseTypes.Code,
            OpenIddictConstants.Permissions.Scopes.Email,
            OpenIddictConstants.Permissions.Scopes.Profile,
            OpenIddictConstants.Permissions.Scopes.Roles
        ]);

        await manager.CreateAsync(descriptor);
    }
}