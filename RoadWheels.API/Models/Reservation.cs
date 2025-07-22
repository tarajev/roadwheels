using MongoDB.Bson;           
using MongoDB.Bson.Serialization.Attributes;  

namespace RoadWheels.API.Models;

public class Reservation
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string VehicleId { get; set; } = null!;

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = null!;

    [BsonElement("startDate")]
    public DateTime StartDate { get; set; }

    [BsonElement("endDate")]
    public DateTime EndDate { get; set; }

    [BsonElement("status")]
    public ReservationStatus Status { get; set; } = ReservationStatus.Pending;

    [BsonElement("totalPrice")]
    public decimal TotalPrice { get; set; }

    [BsonElement("vehicleType")]
    public VehicleType VehicleType { get; set; } 
}

public enum ReservationStatus
{
    Pending,
    Confirmed,
    Cancelled
}
