using Microsoft.AspNetCore.Mvc;

namespace StartingPoint.Common.Exceptions;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (EntityNotFoundException ex)
        {
            await HandleEntityNotFoundExceptionAsync(context, ex);
        }
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
}