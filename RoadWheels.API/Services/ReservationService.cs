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
        private readonly IMongoCollection<User> _users = database.GetCollection<User>("users");

        public async Task<List<Reservation>> GetReservationsForVehicle(string vehicleId)
        {
            List<Reservation> reservations = await _reservations
                .Find(r => r.VehicleId == vehicleId && r.Status != ReservationStatus.Cancelled)
                .ToListAsync();

            if (reservations.Count == 0)
                throw new NotFoundException("No reservations found for this vehicle ID.");

            return reservations;
        }

        public async Task<string> ReserveAVehicle(ReservationPostDto reservation)
        {
            DateTime today = DateTime.UtcNow.Date;
            if (reservation.StartDate.Date <= today)
                throw new ArgumentException("Reservations must start at least one day in advance.");

            if (reservation.StartDate.Date > reservation.EndDate.Date)
                throw new ArgumentException("Start date cannot be after end date.");

            var collection = _vehicleService.GetCollectionByType(reservation.VehicleType);

            Vehicle vehicle = await collection
                .Find(v => v.Id == reservation.VehicleId)
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("No vehicle found with the provided ID.");

            User user = await _users
                .Find(u => u.Id == reservation.UserId)
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("No user found with the provided ID.");

            var totalDaysReserved = (reservation.EndDate - reservation.StartDate).Days + 1;

            Reservation newReservation = new()
            {
                VehicleId = reservation.VehicleId!,
                UserId = reservation.UserId,
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

        public async Task UpdateStatus(string reservationId, bool confirmed)
        {
            var reservation = await _reservations
                .Find(r => r.Id == reservationId)
                .FirstOrDefaultAsync()
                ?? throw new NotFoundException("Reservation with the provided ID was not found.");

            var newStatus = confirmed ? ReservationStatus.Confirmed : ReservationStatus.Cancelled;

            if (reservation.Status == ReservationStatus.Cancelled)
                throw new InvalidOperationException("Cannot change the status of a reservation that is already cancelled.");

            var update = Builders<Reservation>.Update
                .Set(r => r.Status, newStatus);

            var result = await _reservations.UpdateOneAsync(
                r => r.Id == reservationId,
                update
            );

            if (result.ModifiedCount == 0)
                throw new Exception("Failed to update the reservation status.");
        }

        public async Task CancelReservation(string reservationId)
        {
            DateTime today = DateTime.UtcNow.Date;

            var reservation = await _reservations
                .Find(r => r.Id == reservationId)
                .FirstOrDefaultAsync();

            if (reservation == null)
                throw new NotFoundException("Reservation with the provided ID was not found.");

            if ((reservation.StartDate.Date - today).TotalDays < 2)
                throw new InvalidOperationException("Cannot cancel reservation less than 2 days before pickup.");

            var result = await _reservations.DeleteOneAsync(r => r.Id == reservationId);

            if (result.DeletedCount == 0)
                throw new Exception("Failed to delete the reservation.");
        }
    }
}
