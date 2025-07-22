using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public class VehiclePostDto
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;
    public string City { get; set; } = "";
    public decimal PricePerDay { get; set; } = 0;
    public string Brand { get; set; } = null!;
    public string Model { get; set; } = "";
    public int Seats { get; set; }
    public string? MainImage { get; set; }
    public VehicleType Type { get; set; }
}
