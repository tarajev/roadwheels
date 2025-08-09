using Microsoft.AspNetCore.Mvc;
using RoadWheels.API.Services;
using RoadWheels.API.DTOs;
using RoadWheels.API.Exceptions;

namespace RoadWheels.API.Controllers;

[ApiController]
[Route("Reservation")]
public class ReservationController(ReservationService reservationService) : ControllerBase
{
    private readonly ReservationService _reservationService = reservationService;

    [HttpGet("GetReservationsForVehicle/{vehicleId}")]
    public async Task<IActionResult> GetReservationsForVehicle(string vehicleId)
    {
        try
        {
            var reservations = await _reservationService.GetReservationsForVehicle(vehicleId);
            return Ok(reservations);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest("Failed to fetch reservations.");
        }
    }

    [HttpPost("ReserveAVehicle")]
    public async Task<IActionResult> ReserveAVehicle([FromBody] ReservationPostDto reservation)
    {
        try
        {
            var id = await _reservationService.ReserveAVehicle(reservation);
            return Ok("Reservation created successfully with ID: " + id);
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest("Failed to create reservation.");
        }
    }

    [HttpPut("UpdateReservation")]
    public async Task<IActionResult> UpdateReservation([FromBody] ReservationPostDto reservation)
    {
        try
        {
            await _reservationService.UpdateReservation(reservation);
            return Ok("Reservation updated successfully.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest("Failed to update reservation.");
        }
    }

    [HttpDelete("CancelReservation/{reservationId}")]
    public async Task<IActionResult> CancelReservation(string reservationId)
    {
        try
        {
            await _reservationService.CancelReservation(reservationId);
            return Ok("Reservation cancelled successfully.");
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest("Failed to cancel reservation.");
        }
    }
}
