using DomainUser = StartingPoint.User.Domain.User;
namespace StartingPoint.Tests.User.Domain;

public class UserTests
{
    [Fact]
    public void Create_ShouldCreateUser()
    {
        var momentBefore = DateTimeOffset.UtcNow;
        var email = "email@example.com";
        var username = "username";
        var user = DomainUser.Create(email,username);
        var momentAfter = DateTimeOffset.UtcNow;
        
        Assert.NotNull(user);
        Assert.NotEqual(Guid.Empty, user.Id);
        Assert.Equal(email, user.Email);
        Assert.Equal(username, user.Username);
        Assert.InRange(user.CreatedAt, momentBefore, momentAfter);
    }
}