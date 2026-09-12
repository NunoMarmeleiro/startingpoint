using StartingPoint.Trip.Domain;

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

        // Act
        var trip = StartingPoint.Trip.Domain.Trip.Create(
            "Barcelona Trip",
            "Barcelona",
            dateRange);

        // Assert
        Assert.NotEqual(Guid.Empty, trip.Id);
        Assert.Equal("Barcelona Trip", trip.Name);
        Assert.Equal("Barcelona", trip.Destination);
        Assert.Equal(dateRange, trip.DateRange);
    }
    
    [Fact]
    public void Create_ShouldRejectEmptyName()
    {
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        Assert.Throws<ArgumentException>(() =>
            StartingPoint.Trip.Domain.Trip.Create(
                "",
                "Barcelona",
                dateRange));
    }
    
    [Fact]
    public void Create_ShouldRejectEmptyDestination()
    {
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        Assert.Throws<ArgumentException>(() =>
            StartingPoint.Trip.Domain.Trip.Create(
                "Barcelona Trip",
                "",
                dateRange));
    }
    
    [Fact]
    public void AddPointOfInterest_ShouldAddPoiToTrip()
    {
        var dateRange = DateRange.Create(
            new DateOnly(2026, 10, 1),
            new DateOnly(2026, 10, 5));

        var trip = StartingPoint.Trip.Domain.Trip.Create(
            "Barcelona Trip",
            "Barcelona",
            dateRange);

        var poi = PointOfInterest.Create(
            "Sagrada Família",
            POICategory.Attraction);

        trip.AddPointOfInterest(poi);

        Assert.Single(trip.PointsOfInterest);
        Assert.Contains(poi, trip.PointsOfInterest);
    }
    
    
}