namespace StartingPoint.Authentication.Application.Exceptions;

public sealed class UserLoginException() : Exception("User not registered or credentials do not match");