using MongoDB.Bson.Serialization.Attributes;
using RoadWheels.API.Models;
using MongoDB.Bson;


namespace RoadWheels.API.DTOs;

public sealed record ReservationPostDto(
    
  string? Id,
  string? VehicleId,
  string UserId,
  DateTime StartDate,
  DateTime EndDate,
  VehicleType VehicleType
);