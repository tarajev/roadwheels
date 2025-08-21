namespace RoadWheels.API.DTOs;

public class RideDto
{
    public string Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal TotalPrice { get; set; }
    public string City { get; set; }
    public string Country { get; set; }

    // podaci o vozilu
    public string VehicleBrand { get; set; }
    public string VehicleModel { get; set; }

}
