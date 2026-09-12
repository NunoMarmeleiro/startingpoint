namespace StartingPoint.Trip.Domain;

public class Trip
{
    private readonly List<PointOfInterest> _pointsOfInterest = [];

    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public string Destination { get; private set; }

    public DateRange DateRange { get; private set; }

    public IReadOnlyCollection<PointOfInterest> PointsOfInterest =>
        _pointsOfInterest.AsReadOnly();

    private Trip(
        Guid id,
        string name,
        string destination,
        DateRange dateRange)
    {
        Id = id;
        Name = name;
        Destination = destination;
        DateRange = dateRange;
    }

    public static Trip Create(
        string name,
        string destination,
        DateRange dateRange)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Trip name cannot be empty.",
                nameof(name));
        }

        if (string.IsNullOrWhiteSpace(destination))
        {
            throw new ArgumentException(
                "Trip destination cannot be empty.",
                nameof(destination));
        }

        return new Trip(
            Guid.NewGuid(),
            name.Trim(),
            destination.Trim(),
            dateRange);
    }

    public void AddPointOfInterest(PointOfInterest pointOfInterest)
    {
        ArgumentNullException.ThrowIfNull(pointOfInterest);

        if (_pointsOfInterest.Any(p => p.Id == pointOfInterest.Id))
        {
            throw new InvalidOperationException(
                "The point of interest is already part of this trip.");
        }

        _pointsOfInterest.Add(pointOfInterest);
    }

    public void RemovePointOfInterest(Guid pointOfInterestId)
    {
        var pointOfInterest = _pointsOfInterest
            .SingleOrDefault(p => p.Id == pointOfInterestId);

        if (pointOfInterest is null)
        {
            throw new InvalidOperationException(
                "The point of interest does not belong to this trip.");
        }

        _pointsOfInterest.Remove(pointOfInterest);
    }

    public void Update(
        string name,
        string destination,
        DateRange dateRange)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Trip name cannot be empty.",
                nameof(name));
        }

        if (string.IsNullOrWhiteSpace(destination))
        {
            throw new ArgumentException(
                "Trip destination cannot be empty.",
                nameof(destination));
        }

        Name = name.Trim();
        Destination = destination.Trim();
        DateRange = dateRange;
    }
}