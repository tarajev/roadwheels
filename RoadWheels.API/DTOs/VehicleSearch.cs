using RoadWheels.API.Models;

namespace RoadWheels.API.DTOs;

public class VehicleSearchDto
{
    public VehicleType Type { get; set; }
    public string Country { get; set; }
    public string? City { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Skip { get; set; }
    public int Take { get; set; }
}
