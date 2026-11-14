using System.Net;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace StartingPoint.Tests.Common.Presentation;

public class CommonControllerTests
{
    [Fact]
    public void Every_endpoint_requires_authorization_unless_allowlisted()
    {
        using var factory = new WebApplicationFactory<Program>();
        var endpoints = factory.Services.GetRequiredService<EndpointDataSource>().Endpoints
            .OfType<RouteEndpoint>();

        var allowed = new[] { "api/auth/login", "api/auth/register", "connect/authorize", "connect/logout", "openapi" };

        var open = endpoints
            .Where(e => e.Metadata.GetMetadata<IAllowAnonymous>() is not null)
            .Select(e => e.RoutePattern.RawText)
            .Where(p => !allowed.Any(a => p!.StartsWith(a)))
            .ToList();

        Assert.Empty(open);
    }
    
    [Fact]
    public async Task Fallback_policy_requires_authenticated_user()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var provider = factory.Services.GetRequiredService<IAuthorizationPolicyProvider>();

        var fallback = await provider.GetFallbackPolicyAsync();

        Assert.NotNull(fallback);
        Assert.Contains(fallback!.Requirements, r => r is DenyAnonymousAuthorizationRequirement);
    }
    
    [Fact]
    public async Task Every_endpoint_returns_401_without_token_unless_allowlisted()
    {
        using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

        var allowed = new[]
        {
            "/api/auth/login", "/api/auth/register",
            "/connect/authorize","/connect/token", "/connect/logout", "/openapi"
        };

        var endpoints = factory.Services.GetRequiredService<EndpointDataSource>()
            .Endpoints.OfType<RouteEndpoint>();

        var failures = new List<string>();

        foreach (var endpoint in endpoints)
        {
            var raw = endpoint.RoutePattern.RawText ?? "";
            var pattern = "/" + raw.TrimStart('/');

            if (allowed.Any(a => pattern.StartsWith(a, StringComparison.OrdinalIgnoreCase)))
                continue;

            var path = Regex.Replace(pattern, @"\{[^}]+\}", "00000000-0000-0000-0000-000000000001");

            var methods = endpoint.Metadata.GetMetadata<HttpMethodMetadata>()?.HttpMethods ?? ["GET"];

            foreach (var method in methods)
            {
                var response = await client.SendAsync(new HttpRequestMessage(new HttpMethod(method), path));

                if (response.StatusCode != HttpStatusCode.Unauthorized)
                    failures.Add($"{method} {pattern} returned {(int)response.StatusCode}");
            }
        }

        Assert.Empty(failures);
    }
}