using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public class UpdateUserDto
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? NewPassword { get; set; } 
    public string OldPassword { get; set; } = null!;
    public string? PhoneNumber { get; set; } 
}
