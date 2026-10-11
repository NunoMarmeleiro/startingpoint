using StartingPoint.Common.Exceptions;

namespace StartingPoint.Trip.Domain;

public sealed record DateRange
{
    public DateOnly Start { get; }
    public DateOnly End { get; }

    private DateRange(DateOnly start, DateOnly end)
    {
        Start = start;
        End = end;
    }

    public static DateRange Create(DateOnly? start, DateOnly? end)
    {
        if (!start.HasValue)
        {
            throw new DomainException("There must be a start date");
        }
        
        if (!end.HasValue)
        {
            throw new DomainException("There must be an end date");
        }
        
        if (end < start)
        {
            throw new DomainException(
                "The end date cannot be before the start date.");
        }

        return new DateRange(start.Value, end.Value);
    }

    public int DurationInDays =>
        End.DayNumber - Start.DayNumber + 1;
}