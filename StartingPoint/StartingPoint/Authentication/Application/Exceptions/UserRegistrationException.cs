namespace StartingPoint.Authentication.Application.Exceptions;

public class UserRegistrationException(
    string message,
    int statusCode) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}