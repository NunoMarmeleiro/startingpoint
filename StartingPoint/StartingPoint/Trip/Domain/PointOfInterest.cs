namespace StartingPoint.Trip.Domain;

public sealed class PointOfInterest
{
    public Guid Id { get; private set; }

    public string Name { get; private set; }

    public string? Description { get; private set; }

    public POICategory Category { get; private set; }

    public string? Address { get; private set; }

    public string? Notes { get; private set; }

    private PointOfInterest()
    {
        
    }
    private PointOfInterest(
        Guid id,
        string name,
        POICategory category,
        string? description,
        string? address,
        string? notes)
    {
        Id = id;
        Name = name;
        Category = category;
        Description = description;
        Address = address;
        Notes = notes;
    }

    public static PointOfInterest Create(
        string name,
        POICategory category,
        string? description = null,
        string? address = null,
        string? notes = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Point of interest name cannot be empty.",
                nameof(name));
        }

        return new PointOfInterest(
            Guid.NewGuid(),
            name.Trim(),
            category,
            description?.Trim(),
            address?.Trim(),
            notes?.Trim());
    }

    public void Update(
        string name,
        POICategory category,
        string? description = null,
        string? address = null,
        string? notes = null)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Point of interest name cannot be empty.",
                nameof(name));
        }

        Name = name.Trim();
        Category = category;
        Description = description?.Trim();
        Address = address?.Trim();
        Notes = notes?.Trim();
    }
}