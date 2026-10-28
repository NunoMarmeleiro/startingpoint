using Microsoft.AspNetCore.Mvc;
using StartingPoint.Authentication.Application.Exceptions;

namespace StartingPoint.Common.Exceptions;

public class ExceptionHandlingMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (EntityNotFoundException ex)
        {
            await HandleEntityNotFoundExceptionAsync(context, ex);
        }
        catch (DomainException ex)
        {
            await HandleDomainExceptionAsync(context, ex);
        }
        catch (UserRegistrationException ex)
        {
            await HandleUserRegistrationException(context, ex);
        }
        catch (UserLoginException ex)
        {
            await HandleApplicationUserNotFoundException(context, ex);
        }
        catch (Exception)
        {
            await HandleUnexpectedExceptionAsync(context);
        }
    }

    private static async Task HandleApplicationUserNotFoundException(
        HttpContext context, 
        UserLoginException exception
        )
    {
        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status401Unauthorized,
            Title = "Login failed",
            Detail = exception.Message,
            Instance = context.Request.Path
        };

        context.Response.StatusCode = StatusCodes.Status401Unauthorized;

        await context.Response.WriteAsJsonAsync(problemDetails);
    }

    private static async Task HandleUnexpectedExceptionAsync(
        HttpContext context)
    {
        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Internal server error",
            Detail = "An unexpected error occurred.",
            Instance = context.Request.Path
        };

        context.Response.StatusCode =
            StatusCodes.Status500InternalServerError;

        await context.Response.WriteAsJsonAsync(problemDetails);
    }

    private static async Task HandleEntityNotFoundExceptionAsync(
        HttpContext context,
        EntityNotFoundException exception)
    {
        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status404NotFound,
            Title = "Entity not found",
            Detail = exception.Message,
            Instance = context.Request.Path
        };

        context.Response.StatusCode = StatusCodes.Status404NotFound;

        await context.Response.WriteAsJsonAsync(problemDetails);
    }
    
    private static async Task HandleDomainExceptionAsync(
        HttpContext context,
        DomainException exception)
    {
        var problemDetails = new ProblemDetails
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Domain rule violation",
            Detail = exception.Message,
            Instance = context.Request.Path
        };

        context.Response.StatusCode = StatusCodes.Status400BadRequest;

        await context.Response.WriteAsJsonAsync(problemDetails);
    }
    
    private static async Task HandleUserRegistrationException(
        HttpContext context,
        UserRegistrationException exception)
    {
        var problemDetails = new ProblemDetails
        {
            Status = exception.StatusCode,
            Title = "Error Registering User",
            Detail = exception.Message,
            Instance = context.Request.Path
        };

        context.Response.StatusCode = exception.StatusCode;

        await context.Response.WriteAsJsonAsync(problemDetails);
    }
}