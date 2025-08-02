using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public sealed record ReservationPostDto(
  string? Id,
  string? VehicleId,
  DateTime StartDate,
  DateTime EndDate,
  VehicleType VehicleType
);