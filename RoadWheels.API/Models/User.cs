using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RoadWheels.API.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = null!;
    [BsonElement("email")]
    public string Email { get; set; } = null!;

    [BsonElement("passwordHash")]
    public string PasswordHash { get; set; } = null!;

    [BsonElement("role")]
    public UserRole Role { get; set; } = UserRole.Guest;

    //customer
    [BsonElement("phoneNumber")]
    [BsonIgnoreIfNull]
    public string? PhoneNumber { get; set; }

    //employee
    [BsonElement("country")]
    [BsonIgnoreIfNull]
    public string? Country { get; set; }
    [BsonElement("city")]
    [BsonIgnoreIfNull]
    public string? City { get; set; }
}

public enum UserRole
{
    Guest,
    Customer,
    Employee
}
