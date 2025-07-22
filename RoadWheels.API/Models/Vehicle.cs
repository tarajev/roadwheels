using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace RoadWheels.API.Models;

public class Vehicle
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    /*
    [BsonElement("type")]
    public string Type { get; set; } = null!; // Car, Camper, TouringBike, TouringMotorbike */

    [BsonElement("brand")]
    public string Brand { get; set; } = null!;

    [BsonElement("model")]
    public string Model { get; set; } = null!;

    [BsonElement("seats")]
    public int Seats { get; set; }

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("imageUrls")]
    public List<string> ImageUrls { get; set; } = new();

    [BsonElement("needsRepair")]
    public bool NeedsRepair { get; set; } = false;

    // public string Region { get; set; } = null!;   // Europe, USA itd.
    [BsonElement("country")]
    public string Country { get; set; } = null!;
    [BsonElement("city")]
    public string City { get; set; } = null!;
    [BsonElement("pricePerDay")]
    public decimal PricePerDay { get; set; }
    [BsonElement("location")]
    public GeoJsonPoint<GeoJson2DCoordinates>? Location { get; set; }
}


public enum VehicleType
{
    Car,
    Camper,
    TouringMotorcycle,
    TouringBike
}
