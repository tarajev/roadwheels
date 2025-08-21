using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public class VehicleDetailsDto
{
    public string Id { get; set; } = null!;
    public string Brand { get; set; } = null!;
    public string Model { get; set; } = null!;
    public int Seats { get; set; }
    public double? FuelConsumption { get; set; }
    public string? Transmission { get; set; }
    public string? Description { get; set; }
    public List<string> ImageUrls { get; set; } = new();
    public bool NeedsRepair { get; set; } = false;
    public string Country { get; set; } = null!;
    public string? City { get; set; }
    public decimal PricePerDay { get; set; }
    public VehicleType Type { get; set; }
    public GeoJsonPoint<GeoJson2DCoordinates>? Location { get; set; }
}
