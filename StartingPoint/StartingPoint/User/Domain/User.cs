namespace StartingPoint.User.Domain;

public class User
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

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
}