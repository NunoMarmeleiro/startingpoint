using DomainUser = StartingPoint.User.Domain.User;
namespace StartingPoint.Tests.User.Domain;

public class UserTests
{
    [Fact]
    public void Create_ShouldCreateUser()
    {
        var momentBefore = DateTimeOffset.UtcNow;
        var user = DomainUser.Create();
        var momentAfter = DateTimeOffset.UtcNow;
        
        Assert.NotNull(user);
        Assert.NotEqual(Guid.Empty, user.Id);
        Assert.InRange(user.CreatedAt, momentBefore, momentAfter);
    }
}