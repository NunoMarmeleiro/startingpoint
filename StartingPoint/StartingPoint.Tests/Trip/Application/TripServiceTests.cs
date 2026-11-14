using Moq;
using StartingPoint.Common.Application.Abstractions;
using StartingPoint.Common.Exceptions;
using StartingPoint.Trip.Application.DTOs;
using StartingPoint.Trip.Application.Repositories;
using StartingPoint.Trip.Application.Services;
using StartingPoint.Trip.Domain;
using DomainTrip = StartingPoint.Trip.Domain.Trip;

namespace StartingPoint.Tests.Trip.Application;

public class TripServiceTests
{
    private readonly Mock<ITripRepository> _repositoryMock = new();
    private readonly Mock<ICurrentUser> _currentUserMock = new();
    private readonly Guid _ownerId = Guid.NewGuid();
    private readonly TripService _tripService;

    public TripServiceTests()
    {
        // Without this setup, ICurrentUser.Id returns Guid.Empty and every
        // owner-scoped repository setup below would never match.
        _currentUserMock.Setup(user => user.Id).Returns(_ownerId);

        _tripService = new TripService(_repositoryMock.Object, _currentUserMock.Object);
    }

    private DomainTrip CreateTrip(
        string name = "Barcelona Trip",
        string destination = "Barcelona",
        Guid? ownerId = null)
    {
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        return DomainTrip.Create(
            name,
            destination,
            dateRange,
            ownerId ?? _ownerId);
    }

    private void SetupTripFound(DomainTrip trip)
    {
        _repositoryMock
            .Setup(repository => repository.GetByIdAndOwnerIdAsync(trip.Id, _ownerId))
            .ReturnsAsync(trip);
    }

    private void SetupTripNotFound(Guid tripId)
    {
        _repositoryMock
            .Setup(repository => repository.GetByIdAndOwnerIdAsync(tripId, _ownerId))
            .ReturnsAsync((DomainTrip?)null);
    }

    [Fact]
    public async Task CreateTrip_ShouldCreateTrip()
    {
        var date1 = new DateOnly(2026, 10, 1);
        var date2 = new DateOnly(2026, 10, 5);

        var tripDTO = new CreateTripRequestDTO("Barcelona Trip", "Barcelona", date1, date2);
        var tripResponseDTO = await _tripService.CreateTrip(tripDTO);

        Assert.NotEqual(Guid.Empty, tripResponseDTO.Id);
        Assert.Equal("Barcelona Trip", tripResponseDTO.Name);
        Assert.Equal("Barcelona", tripResponseDTO.Destination);
        Assert.Equal(date1, tripResponseDTO.StartDate);
        Assert.Equal(date2, tripResponseDTO.EndDate);

        _repositoryMock.Verify(
            repository => repository.AddAsync(
                It.Is<DomainTrip>(trip =>
                    trip.Name == "Barcelona Trip" &&
                    trip.Destination == "Barcelona" &&
                    trip.DateRange.Start == date1 &&
                    trip.DateRange.End == date2 &&
                    trip.OwnerId == _ownerId)),
            Times.Once);
    }

    [Fact]
    public async Task GetTrip_ShouldReturnTrip()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        var result = await _tripService.GetTripById(trip.Id);

        Assert.NotNull(result);
        Assert.Equal(trip.Id, result.Id);
        Assert.Equal(trip.Name, result.Name);
        Assert.Equal(trip.Destination, result.Destination);
        Assert.Equal(trip.DateRange.Start, result.StartDate);
        Assert.Equal(trip.DateRange.End, result.EndDate);
        Assert.Equal(trip.OwnerId, result.OwnerId);

        _repositoryMock.Verify(
            repository => repository.GetByIdAndOwnerIdAsync(trip.Id, _ownerId),
            Times.Once);
    }

    [Fact]
    public async Task GetTrip_ShouldThrowNotFoundException_WhenTripDoesNotExist()
    {
        var id = Guid.NewGuid();
        SetupTripNotFound(id);

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.GetTripById(id));

        _repositoryMock.Verify(
            repository => repository.GetByIdAndOwnerIdAsync(id, _ownerId),
            Times.Once);
    }

    [Fact]
    public async Task GetTrip_ShouldThrowNotFoundException_WhenTripBelongsToAnotherUser()
    {
        // The trip belongs to the original owner.
        var trip = CreateTrip();
        SetupTripFound(trip);

        // A different user is now making the request.
        var otherUserId = Guid.NewGuid();
        _currentUserMock.Setup(user => user.Id).Returns(otherUserId);

        // The service must query with the caller's id, so the repository
        // finds nothing and the service reports "not found" (not "forbidden").
        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.GetTripById(trip.Id));

        _repositoryMock.Verify(
            repository => repository.GetByIdAndOwnerIdAsync(trip.Id, otherUserId),
            Times.Once);
        _repositoryMock.Verify(
            repository => repository.GetByIdAndOwnerIdAsync(trip.Id, _ownerId),
            Times.Never);
    }

    [Fact]
    public async Task AddPointOfInterest_ShouldAddPointOfInterestToTrip()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

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
    public async Task AddPointOfInterest_ShouldThrowNotFoundException_WhenTripDoesNotExist()
    {
        var tripId = Guid.NewGuid();
        SetupTripNotFound(tripId);

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.AddPointOfInterest(
                tripId,
                "Sagrada Família",
                POICategory.HistoricalSite));

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }

    [Fact]
    public async Task AddPointOfInterest_ShouldAddAllPointOfInterestInformation()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        await _tripService.AddPointOfInterest(
            trip.Id,
            "Sagrada Família",
            POICategory.HistoricalSite,
            "Famous basilica",
            "Barcelona",
            "Book tickets in advance");

        var poi = Assert.Single(trip.PointsOfInterest);

        Assert.Equal("Sagrada Família", poi.Name);
        Assert.Equal(POICategory.HistoricalSite, poi.Category);
        Assert.Equal("Famous basilica", poi.Description);
        Assert.Equal("Barcelona", poi.Address);
        Assert.Equal("Book tickets in advance", poi.Notes);

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(trip),
            Times.Once);
    }

    [Fact]
    public async Task AddPointOfInterest_ShouldThrow_WhenNameIsEmpty()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        await Assert.ThrowsAsync<DomainException>(
            () => _tripService.AddPointOfInterest(
                trip.Id,
                "",
                POICategory.HistoricalSite));

        Assert.Empty(trip.PointsOfInterest);

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(trip),
            Times.Never);
    }

    [Fact]
    public async Task GetAllTrips_ShouldReturnAllTripsOfCurrentUser()
    {
        var trips = new List<DomainTrip>
        {
            CreateTrip("Japan", "Tokyo"),
            CreateTrip("Portugal", "Porto")
        };

        _repositoryMock
            .Setup(repository => repository.GetAllByOwnerIdAsync(_ownerId))
            .ReturnsAsync(trips);

        var result = await _tripService.GetAllTrips();

        Assert.NotNull(result);
        Assert.Equal(2, result.Count());

        Assert.Contains(result, trip =>
            trip.Name == "Japan" &&
            trip.Destination == "Tokyo");

        Assert.Contains(result, trip =>
            trip.Name == "Portugal" &&
            trip.Destination == "Porto");

        _repositoryMock.Verify(
            repository => repository.GetAllByOwnerIdAsync(_ownerId),
            Times.Once);
    }

    [Fact]
    public async Task GetAllTrips_WhenNoTripsExist_ShouldReturnEmptyCollection()
    {
        _repositoryMock
            .Setup(repository => repository.GetAllByOwnerIdAsync(_ownerId))
            .ReturnsAsync(new List<DomainTrip>());

        var result = await _tripService.GetAllTrips();

        Assert.NotNull(result);
        Assert.Empty(result);

        _repositoryMock.Verify(
            repository => repository.GetAllByOwnerIdAsync(_ownerId),
            Times.Once);
    }

    [Fact]
    public async Task UpdateTrip_ShouldUpdateTrip()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        var newStartDate = new DateOnly(2026, 11, 1);
        var newEndDate = new DateOnly(2026, 11, 7);

        var request = new UpdateTripRequestDTO(
            "Madrid Trip",
            "Madrid",
            newStartDate,
            newEndDate);

        var result = await _tripService.UpdateTrip(trip.Id, request);

        Assert.Equal(trip.Id, result.Id);
        Assert.Equal("Madrid Trip", result.Name);
        Assert.Equal("Madrid", result.Destination);
        Assert.Equal(newStartDate, result.StartDate);
        Assert.Equal(newEndDate, result.EndDate);

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(trip),
            Times.Once);
    }

    [Fact]
    public async Task UpdateTrip_ShouldThrowNotFoundException_WhenTripDoesNotExist()
    {
        var tripId = Guid.NewGuid();
        SetupTripNotFound(tripId);

        var request = new UpdateTripRequestDTO(
            "Madrid Trip",
            "Madrid",
            new DateOnly(2026, 11, 1),
            new DateOnly(2026, 11, 7));

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.UpdateTrip(tripId, request));

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdateTrip_ShouldThrow_WhenEndDateIsBeforeStartDate()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        var request = new UpdateTripRequestDTO(
            "Madrid Trip",
            "Madrid",
            new DateOnly(2026, 11, 10),
            new DateOnly(2026, 11, 5));

        await Assert.ThrowsAsync<DomainException>(
            () => _tripService.UpdateTrip(trip.Id, request));

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdatePointOfInterest_ShouldUpdatePointOfInterest()
    {
        var trip = CreateTrip();

        var poi = PointOfInterest.Create(
            "Old Name",
            POICategory.Attraction,
            "Old description",
            "Old address",
            "Old notes");

        trip.AddPointOfInterest(poi);
        SetupTripFound(trip);

        await _tripService.UpdatePointOfInterest(
            trip.Id,
            poi.Id,
            "Sagrada Família",
            POICategory.HistoricalSite,
            "Famous basilica",
            "Barcelona",
            "Visit in the morning");

        Assert.Equal("Sagrada Família", poi.Name);
        Assert.Equal(POICategory.HistoricalSite, poi.Category);
        Assert.Equal("Famous basilica", poi.Description);
        Assert.Equal("Barcelona", poi.Address);
        Assert.Equal("Visit in the morning", poi.Notes);

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(trip),
            Times.Once);
    }

    [Fact]
    public async Task UpdatePointOfInterest_ShouldThrowNotFoundException_WhenTripDoesNotExist()
    {
        var tripId = Guid.NewGuid();
        var poiId = Guid.NewGuid();
        SetupTripNotFound(tripId);

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.UpdatePointOfInterest(
                tripId,
                poiId,
                "Sagrada Família",
                POICategory.HistoricalSite));

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }

    [Fact]
    public async Task UpdatePointOfInterest_ShouldThrowNotFoundException_WhenPointOfInterestDoesNotExist()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        var poiId = Guid.NewGuid();

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.UpdatePointOfInterest(
                trip.Id,
                poiId,
                "Sagrada Família",
                POICategory.HistoricalSite));

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }

    [Fact]
    public async Task DeletePointOfInterest_ShouldRemovePointOfInterest()
    {
        var trip = CreateTrip();

        var poi = PointOfInterest.Create(
            "Sagrada Família",
            POICategory.Attraction);

        trip.AddPointOfInterest(poi);
        SetupTripFound(trip);

        await _tripService.DeletePointOfInterest(trip.Id, poi.Id);

        Assert.Empty(trip.PointsOfInterest);

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(trip),
            Times.Once);
    }

    [Fact]
    public async Task DeletePointOfInterest_ShouldThrowNotFoundException_WhenTripDoesNotExist()
    {
        var tripId = Guid.NewGuid();
        var poiId = Guid.NewGuid();
        SetupTripNotFound(tripId);

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.DeletePointOfInterest(tripId, poiId));

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }

    [Fact]
    public async Task DeletePointOfInterest_ShouldThrowNotFoundException_WhenPointOfInterestDoesNotExist()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        var poiId = Guid.NewGuid();

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.DeletePointOfInterest(trip.Id, poiId));

        _repositoryMock.Verify(
            repository => repository.UpdateAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteTrip_ShouldDeleteTrip()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        await _tripService.DeleteTrip(trip.Id);

        _repositoryMock.Verify(
            repository => repository.DeleteAsync(trip),
            Times.Once);
    }

    [Fact]
    public async Task DeleteTrip_ShouldThrowNotFoundException_WhenTripDoesNotExist()
    {
        var tripId = Guid.NewGuid();
        SetupTripNotFound(tripId);

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.DeleteTrip(tripId));

        _repositoryMock.Verify(
            repository => repository.DeleteAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteTrip_ShouldNotDeleteTrip_WhenTripBelongsToAnotherUser()
    {
        var trip = CreateTrip();
        SetupTripFound(trip);

        _currentUserMock.Setup(user => user.Id).Returns(Guid.NewGuid());

        await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _tripService.DeleteTrip(trip.Id));

        _repositoryMock.Verify(
            repository => repository.DeleteAsync(It.IsAny<DomainTrip>()),
            Times.Never);
    }
}