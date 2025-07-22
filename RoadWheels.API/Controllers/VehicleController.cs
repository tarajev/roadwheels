using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RoadWheels.API.Services;
using RoadWheels.API.Models;
using RoadWheels.API.DTOs;
using MongoDB.Bson;

namespace RoadWheels.API.Controllers;

[ApiController]
[Route("Vehicle")]
public class VehicleController(VehicleService vehicleService) : ControllerBase
{
    private readonly VehicleService _vehicleService = vehicleService;

    [HttpGet("GetAvailableVehiclesByLocation")]
    public async Task<IActionResult> GetAvailableVehiclesByLocation([FromQuery] VehicleSearchDto searchData)
    {
        var vehicles = await _vehicleService.GetAvailableVehiclesByLocationAsync(searchData);
        if (vehicles == null)
            return NotFound("No Vehicles found at this location");

        return Ok(vehicles);
    }

    
    [HttpGet("GetVehicleDetailsById/{type}/{id}")]
    public async Task<IActionResult> GetVehicleDetailsById(VehicleType type, string id)
    {
        var vehicles = await _vehicleService.GetVehicleDetailsByIdAsync(type, id);
        if (vehicles == null)
            return NotFound("No Vehicles found at this location");

        return Ok(vehicles);
    }

    [HttpPost("CreateVehicle/{type}")]
    public async Task<IActionResult> CreateVehicle([FromRoute] VehicleType type, [FromBody] Vehicle vehicle)
    {
        try
        {
            var v = await _vehicleService.CreateVehicleAsync(type, vehicle);
            return Ok(v);
        }
        catch (Exceptions.NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Insert failed: " + ex.Message });
        }
    }

    [HttpPut("UpdateVehicle/{type}")]
    public async Task<IActionResult> UpdateVehicle(VehicleDetailsDto vehicle)
    {

        var result = await _vehicleService.UpdateVehicleAsync(vehicle);
        if (result)
            return Ok(vehicle);
        else
            return BadRequest("There was an error updating the vehicle.");
    }

    [HttpDelete("DeleteVehicle/{type}")]
    public async Task<IActionResult> DeleteVehicle(VehicleType type, string id, string country, string city)
    {

        var result = await _vehicleService.DeleteVehicleAsync(type, id, country, city);
        if (result)
            return Ok("Vehicle successfully deleted");

        return BadRequest("THere was an error deleting the vehicle.");
       
    }
}