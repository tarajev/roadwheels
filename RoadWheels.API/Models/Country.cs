using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RoadWheels.API.Models;

public class Country
{
    [BsonId]
    public ObjectId Id { get; set; }

    public required string Name { get; set; } 
    public Dictionary<string, int> CityWithVehicles { get; set; } = new Dictionary<string, int>();
}