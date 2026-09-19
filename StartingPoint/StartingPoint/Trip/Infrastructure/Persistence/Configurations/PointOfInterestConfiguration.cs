using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StartingPoint.Trip.Domain;

namespace StartingPoint.Trip.Infrastructure.Persistence.Configurations;

public class PointOfInterestConfiguration : IEntityTypeConfiguration<PointOfInterest>
{
    public void Configure(EntityTypeBuilder<PointOfInterest> builder) 
    {
        builder.HasKey(poi => poi.Id);
        builder.Property(poi => poi.Id).ValueGeneratedNever();
        
        builder.Property(poi => poi.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(poi => poi.Description)
            .HasMaxLength(2000);

        builder.Property(poi => poi.Address)
            .HasMaxLength(500);

        builder.Property(poi => poi.Notes)
            .HasMaxLength(2000);

        builder.Property(poi => poi.Category)
            .HasConversion<string>()
            .IsRequired();
    }
}