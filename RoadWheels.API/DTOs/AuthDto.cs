using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public class AuthDto
{
    public string? Id { get; set; }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public UserRole Role { get; set; } = UserRole.Guest;
    public string JwtToken { get; set; } = null!;
}
