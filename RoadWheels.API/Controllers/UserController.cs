using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RoadWheels.API.Services;
using RoadWheels.API.Models;
using RoadWheels.API.DTOs;
using MongoDB.Bson;
using System.Security.Claims;

namespace RoadWheels.API.Controllers;

[ApiController]
[Route("User")]
//[Authorize(Roles = "Customer,Employee")]
public class UserController(UserService userService) : ControllerBase
{
    private readonly UserService _userService = userService;

    [HttpGet("GetUser/{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var jwtId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Console.WriteLine("jwtId" + " : " + jwtId + " , id prosledjen: " + id);
        if (jwtId != id)
            return Unauthorized();

        var user = await _userService.GetUser(id);
        if (user == null)
            return BadRequest("Error - GetUser");

        return Ok(user);
    }

    [AllowAnonymous]
    [HttpPost("CreateUser")]
    public async Task<IActionResult> CreateUser([FromBody]UserRegisterDto userRegisterDto)
    {
        var user = await _userService.CreateUser(userRegisterDto);
        if (user == null)
            return BadRequest("Error - CreateUser");
        return Ok(user);
    }

    [AllowAnonymous] //TODO: samo za customers
    [HttpPut("UpdateUser")]
    public async Task<IActionResult> Updateuser([FromBody] UpdateUserDto user)
    {
        var result = await _userService.UpdateUser(user);
        if (result)
            return Ok(user);
        else
            return BadRequest("There was an error updating the user.");
    }

    [AllowAnonymous] //TODO: samo za customers
    [HttpDelete("Deleteuser/{id}")]
    public async Task<IActionResult> Deleteuser(string id)
    {
        var result = await _userService.DeleteUser(id);
        if (result)
            return Ok("User successfully deleted");

        return BadRequest("There was an error deleting the user.");
    }
}