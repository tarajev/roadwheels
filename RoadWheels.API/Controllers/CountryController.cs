using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using RoadWheels.API.Services;
using RoadWheels.API.Models;
using RoadWheels.API.DTOs;
using MongoDB.Bson;

namespace RoadWheels.API.Controllers;

[ApiController]
[Route("Country")]
public class CountryController(CountryService countryService) : ControllerBase
{
    private readonly CountryService _countryService = countryService;

    [HttpGet("GetAvailableCountries")]
    public async Task<IActionResult> GetAvailableCountries()
    {
        var countries = await _countryService.GetAvailableCountries();
        if (countries == null)
            return NotFound("No locations found at this location");

        return Ok(countries);
    }
}