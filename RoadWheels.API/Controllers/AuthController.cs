using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoadWheels.API.DTOs;
using RoadWheels.API.Services;

namespace RoadWheels.API.Controllers;


[ApiController]
[Route("Auth")]
[AllowAnonymous]
public class AuthController(AuthService authService) : ControllerBase
{
    private readonly AuthService _authService = authService;

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await _authService.Login(request.Email, request.Password);
        if (result == null)
            return BadRequest("Invalid email or password.");
        Console.WriteLine(result);

        return Ok(result); 
    }
}
