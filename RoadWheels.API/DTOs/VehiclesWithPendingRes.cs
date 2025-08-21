using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public sealed record VehiclesWithPendingRes(
  Vehicle Vehicle,
  int Reservations
);