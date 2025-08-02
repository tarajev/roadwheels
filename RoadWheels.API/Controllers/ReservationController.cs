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
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Failed to fetch reservations: " + ex.Message });
        }
    }

    [HttpPost("ReserveAVehicle")]
    public async Task<IActionResult> ReserveAVehicle([FromBody] ReservationPostDto reservation)
    {
        try
        {
            var id = await _reservationService.ReserveAVehicle(reservation);
            return Ok(new { message = "Reservation created successfully with ID: " + id });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Failed to create reservation: " + ex.Message });
        }
    }

    [HttpPut("UpdateReservation")]
    public async Task<IActionResult> UpdateReservation([FromBody] ReservationPostDto reservation)
    {
        try
        {
            await _reservationService.UpdateReservation(reservation);
            return Ok(new { message = "Reservation updated successfully." });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Failed to update reservation: " + ex.Message });
        }
    }

    [HttpDelete("CancelReservation/{reservationId}")]
    public async Task<IActionResult> CancelReservation(string reservationId)
    {
        try
        {
            await _reservationService.CancelReservation(reservationId);
            return Ok(new { message = "Reservation cancelled successfully." });
        }
        catch (NotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Failed to cancel reservation: " + ex.Message });
        }
    }
}
