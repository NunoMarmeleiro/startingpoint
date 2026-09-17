using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StartingPoint.Trip.Infrastructure.Persistence.Configurations;

public class TripConfiguration : IEntityTypeConfiguration<Domain.Trip>
{
    public void Configure(EntityTypeBuilder<Domain.Trip> builder)
    {
        builder.HasKey(trip => trip.Id);

        builder.Property(trip => trip.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(trip => trip.Destination)
            .IsRequired()
            .HasMaxLength(200);

        builder.OwnsOne(
            trip => trip.DateRange,
            dateRange =>
            {
                dateRange.Property(x => x.Start)
                    .HasColumnName("StartDate");

                dateRange.Property(x => x.End)
                    .HasColumnName("EndDate");
            });

        builder.HasMany(trip => trip.PointsOfInterest)
            .WithOne()
            .HasForeignKey("TripId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(trip => trip.PointsOfInterest)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}