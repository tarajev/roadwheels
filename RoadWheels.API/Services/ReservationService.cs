using MongoDB.Bson;
using MongoDB.Driver;
using RoadWheels.API.DTOs;
using RoadWheels.API.Exceptions;
using RoadWheels.API.Models;

namespace RoadWheels.API.Services
{
    public class ReservationService(IMongoDatabase database, VehicleService service)
    {
        private readonly VehicleService _vehicleService = service;
        private readonly IMongoCollection<Reservation> _reservations = database.GetCollection<Reservation>("reservations");

        public async Task<List<Reservation>> GetReservationsForVehicle(string vehicleId)
        {
            List<Reservation> reservations = await _reservations
                .Find(r => r.VehicleId == vehicleId)
                .ToListAsync();

            if (reservations.Count == 0)
                throw new NotFoundException("No reservations found for this vehicle ID.");

            return reservations;
        }

        public async Task<string> ReserveAVehicle(ReservationPostDto reservation)
        {
            DateTime today = DateTime.UtcNow.Date; // use UTC to avoid timezone issues
            if (reservation.StartDate.Date <= today)
                throw new ArgumentException("Reservations must start at least one day in advance.");

            if (reservation.StartDate.Date > reservation.EndDate.Date)
                throw new ArgumentException("Start date cannot be after end date.");

            var collection = _vehicleService.GetCollectionByType(reservation.VehicleType);

            Vehicle vehicle = await collection
                .Find(v => v.Id == reservation.VehicleId)
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("No vehicle found with the provided ID.");

            var totalDaysReserved = (reservation.EndDate - reservation.StartDate).Days + 1;

            Reservation newReservation = new()
            {
                VehicleId = reservation.VehicleId!,
                UserId = ObjectId.Parse("000000000000000000000000").ToString(), // TODO: Zameni ovo
                StartDate = reservation.StartDate.Date,
                EndDate = reservation.EndDate.Date,
                TotalPrice = totalDaysReserved * vehicle.PricePerDay,
                VehicleType = reservation.VehicleType
            };

            await _reservations.InsertOneAsync(newReservation);
            return newReservation.Id;
        }

        public async Task UpdateReservation(ReservationPostDto reservation)
        {
            if (reservation.StartDate.Date > reservation.EndDate.Date)
                throw new ArgumentException("Start date cannot be after end date.");

            var existingReservation = await _reservations
                .Find(r => r.Id == reservation.Id)
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("Reservation not found.");

            var collection = _vehicleService.GetCollectionByType(reservation.VehicleType);
            var vehicle = await collection
                .Find(v => v.Id == existingReservation.VehicleId)
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("Vehicle not found.");

            int totalDays = (reservation.EndDate.Date - reservation.StartDate.Date).Days + 1;
            decimal totalPrice = totalDays * vehicle.PricePerDay;

            var update = Builders<Reservation>.Update
                .Set(r => r.StartDate, reservation.StartDate.Date)
                .Set(r => r.EndDate, reservation.EndDate.Date)
                .Set(r => r.TotalPrice, totalPrice);

            var result = await _reservations.UpdateOneAsync(
                r => r.Id == reservation.Id,
                update
            );

            if (result.ModifiedCount == 0)
                throw new Exception("Failed to update the reservation.");
        }


        public async Task CancelReservation(string reservationId)
        {
            // TODO: Staviti da ne moze da skine rezervaciju ako je pickup vozila za manje od 2 dana.

            var result = await _reservations.DeleteOneAsync(r => r.Id == reservationId);

            if (result.DeletedCount == 0)
                throw new NotFoundException("Reservation with the provided ID was not found.");
        }
    }
}
