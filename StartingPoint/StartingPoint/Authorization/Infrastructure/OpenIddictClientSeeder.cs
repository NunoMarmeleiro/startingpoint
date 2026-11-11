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
        
        var postLogoutUri = configuration["OpenIddict:Frontend:PostLogoutRedirectUri"]
                            ?? throw new InvalidOperationException("PostLogoutRedirectUri is not configured.");

        var manager = services.GetRequiredService<IOpenIddictApplicationManager>();

        

        var descriptor = new OpenIddictApplicationDescriptor
        {
            ClientId = clientId,
            DisplayName = "StartingPoint React Frontend",
            ClientType = OpenIddictConstants.ClientTypes.Public,
            ConsentType = OpenIddictConstants.ConsentTypes.Implicit
        };

        descriptor.RedirectUris.Add(new Uri(redirectUri));
        descriptor.PostLogoutRedirectUris.Add(new Uri(postLogoutUri));

        descriptor.Permissions.UnionWith(
        [
            OpenIddictConstants.Permissions.Endpoints.Authorization,
            OpenIddictConstants.Permissions.Endpoints.Token,
            OpenIddictConstants.Permissions.Endpoints.EndSession,
            OpenIddictConstants.Permissions.GrantTypes.AuthorizationCode,
            OpenIddictConstants.Permissions.GrantTypes.RefreshToken,
            OpenIddictConstants.Permissions.ResponseTypes.Code,
            OpenIddictConstants.Permissions.Scopes.Email,
            OpenIddictConstants.Permissions.Scopes.Profile,
            OpenIddictConstants.Permissions.Scopes.Roles,
            OpenIddictConstants.Permissions.Prefixes.Scope + OpenIddictConstants.Scopes.OfflineAccess,
            
        ]);

        var existing = await manager.FindByClientIdAsync(clientId);
        if (existing is null)
            await manager.CreateAsync(descriptor);
        else
            await manager.UpdateAsync(existing, descriptor);
    }
}