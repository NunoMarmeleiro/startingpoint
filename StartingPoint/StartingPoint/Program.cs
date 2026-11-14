using Microsoft.EntityFrameworkCore;
using StartingPoint.Common.Exceptions;
using StartingPoint.Trip.Application.Repositories;
using StartingPoint.Trip.Application.Services;
using StartingPoint.Trip.Infrastructure.Persistence;
using StartingPoint.Trip.Infrastructure.Persistence.Repositories;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using OpenIddict.Abstractions;
using OpenIddict.Validation.AspNetCore;
using StartingPoint.Authentication.Application.Services;
using StartingPoint.Authorization.Application;
using StartingPoint.Authorization.Application.Services;
using StartingPoint.Authorization.Infrastructure;
using StartingPoint.User.Application.Services;
using StartingPoint.User.Infrastructure.Authentication;
using StartingPoint.User.Infrastructure.Persistence;
using StartingPoint.User.Application.Repositories;
using StartingPoint.User.Infrastructure.Persistence.Repositories;
using StartingPoint.User.Presentation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultScheme = OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
    })
    .AddCookie(IdentityConstants.ApplicationScheme, options =>
    {
        options.Cookie.Name = "StartingPoint.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Lax;

        // Never redirect API calls; let the authorize endpoint decide where to send the user.
        options.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorizationBuilder()
    .SetFallbackPolicy(new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build())
    .AddPolicy("User", p => p.RequireRole(ApplicationUserRoles.User))
    .AddPolicy("Admin", p => p.RequireRole(ApplicationUserRoles.Admin));

//Trips
builder.Services.AddDbContext<TripDbContext>(options =>
    options.UseInMemoryDatabase("StartingPoint"));
builder.Services.AddScoped<ITripRepository, TripRepository>();
builder.Services.AddScoped<TripService>();

//Users
builder.Services.AddDbContext<UserDbContext>(options =>
{
    options.UseInMemoryDatabase("StartingPoint");
});
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

//Authentication
builder.Services.AddScoped<IdentityUserAuthenticationService>();
builder.Services.AddHttpContextAccessor();
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.ClaimsIdentity.UserIdClaimType = OpenIddictConstants.Claims.Subject;
        options.ClaimsIdentity.UserNameClaimType = OpenIddictConstants.Claims.Name;
        options.ClaimsIdentity.RoleClaimType = OpenIddictConstants.Claims.Role;
        options.User.RequireUniqueEmail = true;
        options.Password.RequiredLength = 12;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationIdentityDbContext>()
    .AddSignInManager();

builder.Services.AddDbContext<ApplicationIdentityDbContext>(options =>
{
    options.UseInMemoryDatabase("StartingPoint");
    options.UseOpenIddict<Guid>();
});

//Authorization
builder.Services.AddScoped<IdentityUserAuthorizationService>();
builder.Services.AddOpenIddict()
    .AddCore(options =>
    {
        options.UseEntityFrameworkCore()
            .UseDbContext<ApplicationIdentityDbContext>()
            .ReplaceDefaultEntities<Guid>();
    })
    .AddServer(options =>
    {
        // Enable the authorization and token endpoints.
        options.SetAuthorizationEndpointUris("/connect/authorize")
            .SetTokenEndpointUris("/connect/token")
            .SetEndSessionEndpointUris("/connect/logout");

        // Enable Authorization Code flow.
        options.AllowAuthorizationCodeFlow();
        
        //Enable Refresh Token
        options.AllowRefreshTokenFlow();

        // Require PKCE.
        options.RequireProofKeyForCodeExchange();
        
        //Set Refresh Token Lifetime
        options.SetRefreshTokenLifetime(TimeSpan.FromDays(14));

        // Development-only signing and encryption certificates.
        options.AddDevelopmentSigningCertificate()
            .AddDevelopmentEncryptionCertificate();

        // Integrate OpenIddict with ASP.NET Core.
        options.UseAspNetCore()
            .EnableAuthorizationEndpointPassthrough()
            .EnableEndSessionEndpointPassthrough();
    })
    .AddValidation(options =>
    {
        options.UseLocalServer();
        options.UseAspNetCore();
        options.EnableAuthorizationEntryValidation();
        options.EnableTokenEntryValidation();
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>() ?? [];

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();


//Authorization Roles
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider
        .GetRequiredService<RoleManager<IdentityRole<Guid>>>();

    var roles = new[]
    {
        ApplicationUserRoles.User,
        ApplicationUserRoles.Admin
    };

    foreach (var roleName in roles)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            var result = await roleManager.CreateAsync(
                new IdentityRole<Guid>(roleName));

            if (!result.Succeeded)
            {
                var errors = string.Join(
                    "; ",
                    result.Errors.Select(error => error.Description));

                throw new InvalidOperationException(
                    $"Failed to create role '{roleName}': {errors}");
            }
        }
    }
    
    await OpenIddictClientSeeder.SeedAsync(
        scope.ServiceProvider,
        app.Configuration);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();