using StartingPoint.Common.Exceptions;
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
    
    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("   ")]
    public void Create_WithEmptyEmail_ThrowsDomainException(string email)
    {
        // Arrange
        const string username = "nuno";

        // Act
        Func<DomainUser> act = () => DomainUser.Create(email, username);

        // Assert
        Assert.Throws<DomainException>(act);
    }
    
    [Fact]
    public void Create_WithNullEmail_ThrowsDomainException()
    {
        var act = () => DomainUser.Create(null!, "nuno");

        Assert.Throws<DomainException>(act);
    }
    
    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData("   ")]
    public void Create_WithEmptyUsername_ThrowsDomainException(string username)
    {
        var act = () => DomainUser.Create("nuno@example.com", username);

        Assert.Throws<DomainException>(act);
    }

    [Fact]
    public void Create_WithNullUsername_ThrowsDomainException()
    {
        var act = () => DomainUser.Create("nuno@example.com", null!);

        Assert.Throws<DomainException>(act);
    }

    [Fact]
    public void Create_WithEmptyId_ThrowsDomainException()
    {
        var act = () => DomainUser.Create(
            Guid.Empty,
            "nuno@example.com",
            "nuno");

        Assert.Throws<DomainException>(act);
    }
}