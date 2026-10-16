using StartingPoint.Common.Exceptions;

namespace StartingPoint.User.Domain;

public class User
{
    public Guid Id { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }

    private User(Guid id, DateTimeOffset createdAt)
    {
        this.Id = id;
        this.CreatedAt = createdAt;
    }

    public static User Create()
    {
        return new User(
                Guid.NewGuid(),
                DateTimeOffset.UtcNow)
            ;
    }
    
    public static User Create(Guid id)
    {
        if (id == Guid.Empty)
        {
            throw new DomainException(
                "User ID cannot be empty."
            );
        }
        return new User(
                id,
                DateTimeOffset.UtcNow)
            ;
    }
}