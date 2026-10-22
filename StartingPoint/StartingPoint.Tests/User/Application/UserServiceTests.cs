using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using StartingPoint.Common.Exceptions;
using StartingPoint.User.Application.DTOs;
using StartingPoint.User.Application.Exceptions;
using StartingPoint.User.Application.Repositories;
using StartingPoint.User.Application.Services;
using StartingPoint.User.Infrastructure.Authentication;

using DomainUser = StartingPoint.User.Domain.User;

namespace StartingPoint.Tests.User.Application;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();

        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();

        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);

        _userService = new UserService(
            _userManagerMock.Object,
            _userRepositoryMock.Object);
    }

    [Fact]
    public async Task RegisterUserAsync_WithValidRequest_ReturnsUserResponse()
    {
        // Arrange
        var request = new RegisterUserRequestDTO(
            "nuno@example.com",
            "nuno",
            "ValidPassword123!");

        _userManagerMock
            .Setup(manager => manager.CreateAsync(
                It.IsAny<ApplicationUser>(),
                request.Password))
            .ReturnsAsync(IdentityResult.Success);

        _userRepositoryMock
            .Setup(repository => repository.AddAsync(
                It.IsAny<DomainUser>()))
            .Returns(Task.CompletedTask);

        // Act
        var response = await _userService.RegisterUserAsync(request);

        // Assert
        Assert.NotEqual(Guid.Empty, response.Id);
        Assert.Equal("nuno@example.com", response.Email);
        Assert.Equal("nuno", response.Username);
        Assert.NotEqual(default, response.CreatedAt);

        _userManagerMock.Verify(
            manager => manager.CreateAsync(
                It.Is<ApplicationUser>(user =>
                    user.Email == "nuno@example.com" &&
                    user.UserName == "nuno"),
                request.Password),
            Times.Once);

        _userRepositoryMock.Verify(
            repository => repository.AddAsync(
                It.Is<DomainUser>(user =>
                    user.Id == response.Id &&
                    user.Email == response.Email &&
                    user.Username == response.Username)),
            Times.Once);
    }

    [Fact]
    public async Task RegisterUserAsync_WhenIdentityRejectsUser_ThrowsRegistrationException()
    {
        // Arrange
        var request = new RegisterUserRequestDTO(
            "nuno@example.com",
            "nuno",
            "weak");

        var identityErrors = new[]
        {
            new IdentityError
            {
                Code = "PasswordTooShort",
                Description = "Password is too short."
            }
        };

        _userManagerMock
            .Setup(manager => manager.CreateAsync(
                It.IsAny<ApplicationUser>(),
                request.Password))
            .ReturnsAsync(IdentityResult.Failed(identityErrors));

        // Act
        var exception = await Assert.ThrowsAsync<UserRegistrationException>(
            () => _userService.RegisterUserAsync(request));

        // Assert
        Assert.Equal(StatusCodes.Status400BadRequest, exception.StatusCode);
        Assert.Contains("Password is too short.", exception.Message);

        _userRepositoryMock.Verify(
            repository => repository.AddAsync(It.IsAny<DomainUser>()),
            Times.Never);
    }

    [Fact]
    public async Task RegisterUserAsync_WhenRepositoryFails_RollsBackIdentityUser()
    {
        // Arrange
        var request = new RegisterUserRequestDTO(
            "nuno@example.com",
            "nuno",
            "ValidPassword123!");

        _userManagerMock
            .Setup(manager => manager.CreateAsync(
                It.IsAny<ApplicationUser>(),
                request.Password))
            .ReturnsAsync(IdentityResult.Success);

        _userRepositoryMock
            .Setup(repository => repository.AddAsync(
                It.IsAny<DomainUser>()))
            .ThrowsAsync(new InvalidOperationException("Persistence failed."));

        _userManagerMock
            .Setup(manager => manager.DeleteAsync(
                It.IsAny<ApplicationUser>()))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => _userService.RegisterUserAsync(request));

        // Assert
        _userManagerMock.Verify(
            manager => manager.DeleteAsync(
                It.Is<ApplicationUser>(user =>
                    user.Email == "nuno@example.com")),
            Times.Once);
    }

    [Fact]
    public async Task RegisterUserAsync_WhenRollbackFails_ThrowsRegistrationException()
    {
        // Arrange
        var request = new RegisterUserRequestDTO(
            "nuno@example.com",
            "nuno",
            "ValidPassword123!");

        _userManagerMock
            .Setup(manager => manager.CreateAsync(
                It.IsAny<ApplicationUser>(),
                request.Password))
            .ReturnsAsync(IdentityResult.Success);

        _userRepositoryMock
            .Setup(repository => repository.AddAsync(
                It.IsAny<DomainUser>()))
            .ThrowsAsync(new InvalidOperationException("Persistence failed."));

        _userManagerMock
            .Setup(manager => manager.DeleteAsync(
                It.IsAny<ApplicationUser>()))
            .ReturnsAsync(IdentityResult.Failed(
                new IdentityError
                {
                    Code = "DeleteFailed",
                    Description = "Deletion failed."
                }));

        // Act
        var exception = await Assert.ThrowsAsync<UserRegistrationException>(
            () => _userService.RegisterUserAsync(request));

        // Assert
        Assert.Equal(
            StatusCodes.Status500InternalServerError,
            exception.StatusCode);
        Assert.Contains("could not be rolled back", exception.Message);
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
    public async Task? RegisterUserAsync_WhenUsernameAndEmailHasWhitespacesTrims_ReturnsUserResponse()
    {
        // Arrange
        var request = new RegisterUserRequestDTO(
            "   nuno@example.com      ",
            "    nuno    ",
            "ValidPassword123!");

        _userManagerMock
            .Setup(manager => manager.CreateAsync(
                It.IsAny<ApplicationUser>(),
                request.Password))
            .ReturnsAsync(IdentityResult.Success);

        _userRepositoryMock
            .Setup(repository => repository.AddAsync(
                It.IsAny<DomainUser>()))
            .Returns(Task.CompletedTask);

        // Act
        var response = await _userService.RegisterUserAsync(request);

        // Assert
        Assert.NotEqual(Guid.Empty, response.Id);
        Assert.Equal("nuno@example.com", response.Email);
        Assert.Equal("nuno", response.Username);
        Assert.NotEqual(default, response.CreatedAt);

        _userManagerMock.Verify(
            manager => manager.CreateAsync(
                It.Is<ApplicationUser>(user =>
                    user.Email == "nuno@example.com" &&
                    user.UserName == "nuno"),
                request.Password),
            Times.Once);

        _userRepositoryMock.Verify(
            repository => repository.AddAsync(
                It.Is<DomainUser>(user =>
                    user.Id == response.Id &&
                    user.Email == response.Email &&
                    user.Username == response.Username)),
            Times.Once);
    }
}