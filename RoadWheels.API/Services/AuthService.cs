using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using RoadWheels.API.Models;
using Microsoft.IdentityModel.JsonWebTokens;
using MongoDB.Driver;
using RoadWheels.API.Extensions;
using RoadWheels.API.DTOs;


namespace RoadWheels.API.Services;

public class AuthService(IMongoDatabase database, IConfiguration configuration)
{
    private readonly IMongoCollection<User> _users = database.GetCollection<User>("users");
    private readonly IConfiguration _configuration = configuration;
    public string GenerateJwtToken(User user)
    {
        string key = _configuration["Jwt:Secret"]!;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.Role, user.Role.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier,user.Id)
                ]
            ),
            Expires = DateTime.UtcNow.AddMinutes(120),
            SigningCredentials = credentials,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Issuer"],
        };

        var handler = new JsonWebTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);

        return token;
    }

    public async Task<AuthDto?> Login(string email, string password)
    {
        var user = await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        if (user != null)
        {
            var verifyPassword = PasswordHasher.VerifyPassword(password, user.PasswordHash);
            if (verifyPassword)
            {
                Console.WriteLine("role:" + user.Role);
                var token = GenerateJwtToken(user);
                return new AuthDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                    JwtToken = token
                };
            }

        }
        return null;
    }

}