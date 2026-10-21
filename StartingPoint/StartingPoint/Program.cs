using Microsoft.EntityFrameworkCore;
using StartingPoint.Common.Exceptions;
using StartingPoint.Trip.Application.Repositories;
using StartingPoint.Trip.Application.Services;
using StartingPoint.Trip.Infrastructure.Persistence;
using StartingPoint.Trip.Infrastructure.Persistence.Repositories;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using StartingPoint.User.Application.Services;
using StartingPoint.User.Infrastructure.Authentication;
using StartingPoint.User.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

//Trips
builder.Services.AddDbContext<TripDbContext>(options =>
    options.UseInMemoryDatabase("StartingPoint"));
builder.Services.AddScoped<ITripRepository, TripRepository>();
builder.Services.AddScoped<TripService>();

//ApplicationUser
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequiredLength = 12;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationIdentityDbContext>();
builder.Services.AddDbContext<ApplicationIdentityDbContext>(options =>
    options.UseInMemoryDatabase("StartingPoint"));
builder.Services.AddScoped<ApplicationUserService>();
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
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthorization();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapControllers();

app.Run();