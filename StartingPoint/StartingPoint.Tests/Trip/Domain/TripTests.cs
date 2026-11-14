using StartingPoint.Common.Exceptions;
using StartingPoint.Trip.Domain;
using DomainTrip = StartingPoint.Trip.Domain.Trip;

namespace StartingPoint.Tests.Trip.Domain;

public class TripTests
{
    [Fact]
    public void Create_ShouldCreateTrip()
    {
        // Arrange
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));
        
        var ownerId = Guid.NewGuid();

        // Act
        var trip = DomainTrip.Create(
            "Barcelona Trip",
            "Barcelona",
            dateRange,
            ownerId);

        // Assert
        Assert.NotEqual(Guid.Empty, trip.Id);
        Assert.Equal("Barcelona Trip", trip.Name);
        Assert.Equal("Barcelona", trip.Destination);
        Assert.Equal(dateRange, trip.DateRange);
    }
    
    [Fact]
    public void Create_ShouldRejectEmptyName()
    {
        var ownerId = Guid.NewGuid();
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        Assert.Throws<DomainException>(() =>
            DomainTrip.Create(
                "",
                "Barcelona",
                dateRange,
                ownerId));
    }
    
    [Fact]
    public void Create_ShouldRejectEmptyDestination()
    {
        var ownerId = Guid.NewGuid();
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        Assert.Throws<DomainException>(() =>
            DomainTrip.Create(
                "Barcelona Trip",
                "",
                dateRange,
                ownerId));
    }


    [Fact]
    public void Create_ShouldRejectEmptyOwnerId()
    {
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        Assert.Throws<DomainException>(() =>
            DomainTrip.Create(
                "Barcelona Trip",
                "",
                dateRange,
                Guid.Empty));
    }
    
    [Fact]
    public void AddPointOfInterest_ShouldAddPoiToTrip()
    {
        var ownerId = Guid.NewGuid();
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        var trip = DomainTrip.Create(
            "Barcelona Trip",
            "Barcelona",
            dateRange,
            ownerId);

        var poi = PointOfInterest.Create(
            "Sagrada Família",
            POICategory.Attraction);

        trip.AddPointOfInterest(poi);

        Assert.Single(trip.PointsOfInterest);
        Assert.Contains(poi, trip.PointsOfInterest);
    }
    
    
}