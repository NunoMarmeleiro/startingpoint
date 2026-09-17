using Moq;
using StartingPoint.Common.Exceptions;
using StartingPoint.Trip.Application.DTOs;
using StartingPoint.Trip.Application.Repositories;
using StartingPoint.Trip.Application.Services;
using StartingPoint.Trip.Domain;

namespace StartingPoint.Tests.Trip.Application;

public class TripServiceTests
{
    private readonly Mock<ITripRepository> _repositoryMock = new();
    private readonly TripService _tripService;
    
    public TripServiceTests()
    {
        _tripService = new TripService(_repositoryMock.Object);
    }
    
    [Fact]
    public async Task CreateTrip_ShouldCreateTrip()
    {
        var date1 = new DateOnly(2026, 10, 1);
        var date2 = new DateOnly(2026, 10, 5);
        
        
        var tripDTO = new  CreateTripRequestDTO("Barcelona Trip", "Barcelona",date1,date2);
        var tripResponseDTO = await _tripService.CreateTrip(tripDTO);

        Assert.NotEqual(Guid.Empty, tripResponseDTO.Id);
        Assert.Equal("Barcelona Trip", tripResponseDTO.Name);
        Assert.Equal("Barcelona", tripResponseDTO.Destination);
        Assert.Equal(date1, tripResponseDTO.StartDate);
        Assert.Equal(date2, tripResponseDTO.EndDate);
        _repositoryMock.Verify(
            repository => repository.AddAsync(
                It.Is<StartingPoint.Trip.Domain.Trip>(trip =>
                    trip.Name == "Barcelona Trip" &&
                    trip.Destination == "Barcelona" &&
                    trip.DateRange.Start == date1 &&
                    trip.DateRange.End == date2)),
            Times.Once);
    }
    
    [Fact]
    public async Task GetTrip_ShouldReturnTrip()
    {
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        var trip = StartingPoint.Trip.Domain.Trip.Create(
            "Barcelona Trip",
            "Barcelona",
            dateRange);

        _repositoryMock
            .Setup(repository => repository.GetByIdAsync(trip.Id))
            .ReturnsAsync(trip);

        var result = await _tripService.GetTripById(trip.Id);

        Assert.NotNull(result);
        Assert.Equal(trip.Id, result.Id);
        Assert.Equal(trip.Name, result.Name);
        Assert.Equal(trip.Destination, result.Destination);
        Assert.Equal(trip.DateRange.Start, result.StartDate);
        Assert.Equal(trip.DateRange.End, result.EndDate);

        _repositoryMock.Verify(
            repository => repository.GetByIdAsync(trip.Id),
            Times.Once);
    }
    
    [Fact]
    public async Task GetTrip_ShouldThrowNotFoundException_WhenTripDoesNotExist()
    {
        var id = Guid.NewGuid();

        _repositoryMock
            .Setup(repository => repository.GetByIdAsync(id))
            .ReturnsAsync((StartingPoint.Trip.Domain.Trip?)null);

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.GetTripById(id));

        _repositoryMock.Verify(
            repository => repository.GetByIdAsync(id),
            Times.Once);
    }
    
    [Fact]
    public async Task AddPointOfInterest_ShouldAddPointOfInterestToTrip()
    {
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        var trip = StartingPoint.Trip.Domain.Trip.Create(
            "Barcelona Trip",
            "Barcelona",
            dateRange);

        _repositoryMock
            .Setup(repository => repository.GetByIdAsync(trip.Id))
            .ReturnsAsync(trip);

        await _tripService.AddPointOfInterest(
            trip.Id,
            "Sagrada Família",
            POICategory.HistoricalSite,
            "Famous basilica",
            "Barcelona");

        Assert.Single(trip.PointsOfInterest);

        var poi = trip.PointsOfInterest.Single();

        Assert.Equal("Sagrada Família", poi.Name);
        Assert.Equal(POICategory.HistoricalSite, poi.Category);
        Assert.Equal("Famous basilica", poi.Description);
        Assert.Equal("Barcelona", poi.Address);

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(trip),
            Times.Once);
    }
    
    [Fact]
    public async Task AddPointOfInterest_ShouldThrow_WhenTripDoesNotExist()
    {
        var tripId = Guid.NewGuid();

        _repositoryMock
            .Setup(repository => repository.GetByIdAsync(tripId))
            .ReturnsAsync((StartingPoint.Trip.Domain.Trip?)null);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _tripService.AddPointOfInterest(
                tripId,
                "Sagrada Família",
                POICategory.HistoricalSite));

        Assert.Equal("Trip was not found.", exception.Message);

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(It.IsAny<StartingPoint.Trip.Domain.Trip>()),
            Times.Never);
    }
    
    [Fact]
    public async Task GetAllTrips_ShouldReturnAllTrips()
    {
        // Arrange
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 15));
        
        var dateRange2 = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 15));
        var trips = new List<StartingPoint.Trip.Domain.Trip>
        {
            StartingPoint.Trip.Domain.Trip.Create(
                "Japan",
                "Tokyo",
                dateRange),

            StartingPoint.Trip.Domain.Trip.Create(
                "Portugal",
                "Porto",
                dateRange2)
        };

        _repositoryMock
            .Setup(repository => repository.GetAllAsync())
            .ReturnsAsync(trips);

        // Act
        var result = await _tripService.GetAllTrips();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count());

        Assert.Contains(result, trip =>
            trip.Name == "Japan" &&
            trip.Destination == "Tokyo");

        Assert.Contains(result, trip =>
            trip.Name == "Portugal" &&
            trip.Destination == "Porto");

        _repositoryMock.Verify(
            repository => repository.GetAllAsync(),
            Times.Once);
    }
    
    [Fact]
    public async Task GetAllTrips_WhenNoTripsExist_ShouldReturnEmptyCollection()
    {
        // Arrange
        _repositoryMock
            .Setup(repository => repository.GetAllAsync())
            .ReturnsAsync(new List<StartingPoint.Trip.Domain.Trip>());

        // Act
        var result = await _tripService.GetAllTrips();

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);

        _repositoryMock.Verify(
            repository => repository.GetAllAsync(),
            Times.Once);
    }
}