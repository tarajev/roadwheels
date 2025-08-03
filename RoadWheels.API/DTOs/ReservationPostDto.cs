using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public sealed record ReservationPostDto(
  string? Id,
  string? VehicleId,
  string UserId,
  DateTime StartDate,
  DateTime EndDate,
  VehicleType VehicleType
);