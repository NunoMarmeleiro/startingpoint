namespace StartingPoint.Common.Application.Abstractions;

public interface ICurrentUser
{
    Guid Id { get; }
}