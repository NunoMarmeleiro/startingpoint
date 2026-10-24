using StartingPoint.Common.Exceptions;

namespace StartingPoint.User.Domain;

public class User
{
    public Guid Id { get; private set; }
    public string Email { get; private set; }
    public string Username { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }

    private User(Guid id,string email,string username, DateTimeOffset createdAt)
    {
        this.Id = id;
        this.CreatedAt = createdAt;
        this.Email = email;
        this.Username = username;
    }

    public static User Create(string email,string username)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new DomainException(
                "Email cannot be empty."
            );
        }
        
        if (string.IsNullOrWhiteSpace(username))
        {
            throw new DomainException(
                "Username cannot be empty."
            );
        }
        
        return new User(
                Guid.NewGuid(),
                email,
                username,
                DateTimeOffset.UtcNow)
            ;
    }
    
    public static User Create(Guid id, string email, string username)
    {
        if (id == Guid.Empty)
        {
            throw new DomainException(
                "User ID cannot be empty."
            );
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            throw new DomainException(
                "Email cannot be empty."
            );
        }
        
        if (string.IsNullOrWhiteSpace(username))
        {
            throw new DomainException(
                "Username cannot be empty."
            );
        }
        
        return new User(
                id,
                email,
                username,
                DateTimeOffset.UtcNow)
            ;
    }
}