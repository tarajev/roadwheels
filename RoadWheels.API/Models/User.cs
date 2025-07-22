using MongoDB.Bson;           
using MongoDB.Bson.Serialization.Attributes;  

namespace RoadWheels.API.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } 
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    
    public UserRole Role { get; set; } = UserRole.User;
}

public enum UserRole
{
    Guest,   
    User,
    Moderator
}
