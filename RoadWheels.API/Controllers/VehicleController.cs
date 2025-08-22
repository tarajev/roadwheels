using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RoadWheels.API.Services;
using RoadWheels.API.Models;
using RoadWheels.API.DTOs;

namespace RoadWheels.API.Controllers;

[ApiController]
[Route("Vehicle")]
[Authorize(Roles = "Employee")]
public class VehicleController(VehicleService vehicleService) : ControllerBase
{
    private readonly VehicleService _vehicleService = vehicleService;

    [AllowAnonymous]
    [HttpGet("GetAvailableVehiclesByLocation")]
    public async Task<IActionResult> GetAvailableVehiclesByLocation([FromQuery] VehicleSearchDto searchData)
    {
        var vehicles = await _vehicleService.GetAvailableVehiclesByLocationAsync(searchData);
        if (vehicles.Count == 0)
            return NotFound("No Vehicles found at this location");

        return Ok(vehicles);
    }

    [HttpGet("GetVehiclesByType")]
    public async Task<IActionResult> GetVehiclesByType([FromQuery] string vehicleType, [FromQuery] int page, [FromQuery] string country, [FromQuery] string city)
    {
        var vehicles = await _vehicleService.GetVehiclesByTypeAsync(vehicleType, page, country, city);
        if (vehicles.Count == 0)
            return NotFound("No Vehicles found of this type.");

        return Ok(vehicles);
    }

    [HttpGet("GetVehicleCounts/{country}/{city}")]
    public async Task<IActionResult> GetVehicleCounts([FromRoute] string country, [FromRoute] string city)
    {
        var vehicles = await _vehicleService.GetVehicleCountsAsync(country, city);
        return Ok(vehicles);
    }

    [HttpGet("SearchVehicle")]
    public async Task<IActionResult> GetVehicleCounts([FromQuery] string searchTerm, [FromQuery] string vehicleType, [FromQuery] int page)
    {
        var vehicles = await _vehicleService.SearchVehiclesAsync(searchTerm, vehicleType, page);
        return Ok(vehicles);
    }

    [AllowAnonymous]
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

    [HttpPut("UpdateVehicle")]
    public async Task<IActionResult> UpdateVehicle(VehicleDetailsDto vehicle)
    {
        var result = await _vehicleService.UpdateVehicleAsync(vehicle);
        if (result)
            return Ok(vehicle);
        else
            return BadRequest("There was an error updating the vehicle.");
    }

    [HttpDelete("DeleteVehicle")]
    public async Task<IActionResult> DeleteVehicle(VehicleType type, string id, string country, string city)
    {
        var result = await _vehicleService.DeleteVehicleAsync(type, id, country, city);
        if (result)
            return Ok("Vehicle successfully deleted");

        return BadRequest("There was an error deleting the vehicle.");
    }

    [HttpPost("UploadVehicleImages/{vehicleId}/{vehicleType}")]
    public async Task<IActionResult> UploadImages(string vehicleId, VehicleType vehicleType, List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest("No files to upload.");

        var imageUrls = await _vehicleService.UploadImages(vehicleId, vehicleType, files);

        return Ok(new { imageUrls });
    }
}