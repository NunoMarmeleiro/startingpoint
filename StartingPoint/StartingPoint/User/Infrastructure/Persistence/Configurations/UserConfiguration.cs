using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StartingPoint.User.Infrastructure.Persistence.Configurations;

public class UserConfiguration
    : IEntityTypeConfiguration<StartingPoint.User.Domain.User>
{
    public void Configure(
        EntityTypeBuilder<StartingPoint.User.Domain.User> builder)
    {
        builder.HasKey(user => user.Id);

        builder.Property(user => user.Email)
            .HasMaxLength(256)
            .IsRequired();
        
        builder.Property(user => user.Username)
            .HasMaxLength(200)
            .IsRequired();
    }
}