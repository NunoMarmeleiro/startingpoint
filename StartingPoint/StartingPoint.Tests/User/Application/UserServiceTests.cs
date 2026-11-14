using Moq;
using StartingPoint.Common.Exceptions;
using StartingPoint.User.Application.Repositories;
using StartingPoint.User.Application.Services;
using DomainUser = StartingPoint.User.Domain.User;

namespace StartingPoint.Tests.User.Application;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();

        _userService = new UserService(
            _userRepositoryMock.Object);
    }

    [Fact]
    public async Task GetById_WhenUserExists_ReturnsUserResponse()
    {
        // Arrange
        var id = Guid.NewGuid();
        var domainUser = DomainUser.Create(
            id,
            "nuno@example.com",
            "nuno");

        _userRepositoryMock
            .Setup(repository => repository.GetByIdAsync(id))
            .ReturnsAsync(domainUser);

        // Act
        var response = await _userService.GetById(id);

        // Assert
        Assert.Equal(id, response.Id);
        Assert.Equal("nuno@example.com", response.Email);
        Assert.Equal("nuno", response.Username);
        Assert.Equal(domainUser.CreatedAt, response.CreatedAt);

        _userRepositoryMock.Verify(
            repository => repository.GetByIdAsync(id),
            Times.Once);
    }

    [Fact]
    public async Task GetById_WhenUserDoesNotExist_ThrowsEntityNotFoundException()
    {
        // Arrange
        var id = Guid.NewGuid();

        _userRepositoryMock
            .Setup(repository => repository.GetByIdAsync(id))
            .ReturnsAsync((DomainUser?)null);

        // Act
        var exception = await Assert.ThrowsAsync<EntityNotFoundException>(
            () => _userService.GetById(id));

        // Assert
        Assert.Contains(id.ToString(), exception.Message);

        _userRepositoryMock.Verify(
            repository => repository.GetByIdAsync(id),
            Times.Once);
    }

    [Fact]
    public async Task CreateUserAsync_WithValidData_CreatesDomainUser()
    {
        // Arrange
        var id = Guid.NewGuid();
        var username = "nuno";
        var email = "nuno@example.com";

        _userRepositoryMock
            .Setup(repository => repository.AddAsync(
                It.IsAny<DomainUser>()))
            .Returns(Task.CompletedTask);

        // Act
        await _userService.CreateUserAsync(id, username, email);

        // Assert
        _userRepositoryMock.Verify(
            repository => repository.AddAsync(
                It.Is<DomainUser>(user =>
                    user.Id == id &&
                    user.Email == email &&
                    user.Username == username)),
            Times.Once);
    }

    [Fact]
    public async Task CreateUserAsync_WhenRepositoryFails_PropagatesException()
    {
        // Arrange
        _userRepositoryMock
            .Setup(repository => repository.AddAsync(
                It.IsAny<DomainUser>()))
            .ThrowsAsync(
                new InvalidOperationException("Persistence failed."));

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _userService.CreateUserAsync(
                Guid.NewGuid(),
                "nuno",
                "nuno@example.com"));
    }
}
