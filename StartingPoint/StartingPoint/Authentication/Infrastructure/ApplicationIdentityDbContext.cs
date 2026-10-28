using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StartingPoint.User.Infrastructure.Authentication;

namespace StartingPoint.User.Infrastructure.Persistence;

public class ApplicationIdentityDbContext(
    DbContextOptions<ApplicationIdentityDbContext> options)
    : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<Domain.User> DomainUsers => Set<Domain.User>();
}