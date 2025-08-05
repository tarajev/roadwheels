using System.ComponentModel.DataAnnotations;

namespace RoadWheels.API.DTOs;
public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    public required string Email { get; set; } = null!;
    [Required]
    public required string Password { get; set; } = null!;
}
