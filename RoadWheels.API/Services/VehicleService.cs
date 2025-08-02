using MongoDB.Driver;
using RoadWheels.API.DTOs;
using RoadWheels.API.Models;

namespace RoadWheels.API.Services
{
    public class VehicleService(IMongoDatabase database, CountryService countryService)
    {
        private readonly IMongoCollection<Vehicle> _cars = database.GetCollection<Vehicle>("cars");
        private readonly IMongoCollection<Vehicle> _touringBikes = database.GetCollection<Vehicle>("touringBikes");
        private readonly IMongoCollection<Vehicle> _touringMotorcycles = database.GetCollection<Vehicle>("touringMotorcycles");
        private readonly IMongoCollection<Vehicle> _campers = database.GetCollection<Vehicle>("campers");
        private readonly IMongoCollection<Reservation> _reservations = database.GetCollection<Reservation>("reservations");
        private readonly CountryService _countryService = countryService;

        #region CRUD
        private async Task<List<string>> GetReservedVehicleIdsAsync(VehicleType type, DateTime startDate, DateTime endDate)
        {
            var filter = Builders<Reservation>.Filter.And(
                Builders<Reservation>.Filter.Eq(r => r.VehicleType, type),
                Builders<Reservation>.Filter.Ne(r => r.Status, ReservationStatus.Cancelled),
                Builders<Reservation>.Filter.Lt(r => r.StartDate, endDate),
                Builders<Reservation>.Filter.Gt(r => r.EndDate, startDate)
            );

            return await _reservations.Find(filter)
                .Project(r => r.VehicleId)
                .ToListAsync();
        }
        public async Task<List<VehiclePostDto>> GetAvailableVehiclesByLocationAsync(VehicleSearchDto searchData)
        {
            var reservedVehicleIds = await GetReservedVehicleIdsAsync(searchData.Type, searchData.StartDate, searchData.EndDate);

            var filterBuilder = Builders<Vehicle>.Filter;

            var filter = filterBuilder.Eq(v => v.Country, searchData.Country) & filterBuilder.Eq(v => v.NeedsRepair, false);

            if (!string.IsNullOrEmpty(searchData.City))
                filter &= filterBuilder.Eq(v => v.City, searchData.City);

            if (reservedVehicleIds.Count != 0)
                filter &= !filterBuilder.In(v => v.Id, reservedVehicleIds);

            var collection = GetCollectionByType(searchData.Type);
            var availableVehicles = await collection.Find(filter).SortByDescending(v => v.Year).Skip(searchData.Skip).Limit(searchData.Take).ToListAsync();

            var result = availableVehicles.Select(v =>
            {
                return new VehiclePostDto
                {
                    Id = v.Id,
                    City = v.City,
                    Brand = v.Brand,
                    Model = v.Model,
                    Seats = v.Seats,
                    Transmission = v.Transmission,
                    FuelConsumption = v.FuelConsumption,
                    PricePerDay = v.PricePerDay,
                    MainImage = v.ImageUrls.FirstOrDefault(),
                    Type = searchData.Type
                };
            }).ToList();

            return result;
        }

        /*TODO:
                public async Task<List<VehicleInstance>> GetVehiclesNearUser()
                {

                }
        */

        public async Task<VehicleDetailsDto?> GetVehicleDetailsByIdAsync(VehicleType type, string id)
        {
            var collection = GetCollectionByType(type);
            var vehicle = await collection.Find(v => v.Id == id).FirstOrDefaultAsync();

            return new VehicleDetailsDto
            {
                Id = vehicle.Id,
                Country = vehicle.Country,
                City = vehicle.City,
                Brand = vehicle.Brand,
                Model = vehicle.Model,
                Seats = vehicle.Seats,
                Transmission = vehicle.Transmission,
                FuelConsumption = vehicle.FuelConsumption,
                PricePerDay = vehicle.PricePerDay,
                ImageUrls = vehicle.ImageUrls,
                Description = vehicle.Description,
                Location = vehicle.Location,

            };
        }

        public async Task<Vehicle> CreateVehicleAsync(VehicleType type, Vehicle vehicle)
        {
            var collection = GetCollectionByType(type);
            await collection.InsertOneAsync(vehicle);
            await _countryService.UpdateCountryAsync(vehicle.Country, vehicle.City, 1);
            return vehicle;
        }

        public async Task<bool> UpdateVehicleAsync(VehicleDetailsDto vehicle) //bez slike
        {
            var collection = GetCollectionByType(vehicle.Type);
            var update = Builders<Vehicle>.Update
                .Set(v => v.Model, vehicle.Model)
                .Set(v => v.Country, vehicle.Country)
                .Set(v => v.NeedsRepair, vehicle.NeedsRepair)
                .Set(v => v.Seats, vehicle.Seats)
                .Set(v => v.Description, vehicle.Description)
                .Set(v => v.PricePerDay, vehicle.PricePerDay)
                .Set(v => v.Location, vehicle.Location);

            var result = await collection.UpdateOneAsync(v => v.Id == vehicle.Id, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteVehicleAsync(VehicleType type, string id, string country, string city)
        {
            var collection = GetCollectionByType(type);
            var result = await collection.DeleteOneAsync(v => v.Id == id);

            if (result.DeletedCount > 0)
                await _countryService.UpdateCountryAsync(country, city, -1);

            return result.DeletedCount > 0;
        }

        #endregion CRUD

        public async Task<bool> IsAvailable(string vehicleId, DateTime requestedStart, DateTime requestedEnd)
        {
            var conflictingReservations = await _reservations.Find(r =>
                r.VehicleId == vehicleId &&
                r.Status != ReservationStatus.Cancelled &&
                r.StartDate < requestedEnd &&
                r.EndDate > requestedStart
            ).AnyAsync();

            // Ako postoji neka rezervacija vozilo nije dostupno
            return !conflictingReservations;
        }

        public IMongoCollection<Vehicle> GetCollectionByType(VehicleType type)
        {
            return type switch
            {
                VehicleType.Car => _cars,
                VehicleType.TouringBike => _touringBikes,
                VehicleType.TouringMotorcycle => _touringMotorcycles,
                VehicleType.Camper => _campers,
                _ => throw new ArgumentException($"Unknown vehicle type: {type}")
            };
        }
    }
}
