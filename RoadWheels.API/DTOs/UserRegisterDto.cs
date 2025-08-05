using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public class UserRegisterDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password{ get; set; } = null!;
    public UserRole Role = UserRole.Customer;
    public string PhoneNumber { get; set; } = null!;
}
