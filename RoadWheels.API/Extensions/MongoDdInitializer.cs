using MongoDB.Driver;
using RoadWheels.API.Models;

public static class MongoDbInitializer
{
    public static async Task InitIndexes(IMongoDatabase database)
    {
        var vehicleCollections = new[] { "cars", "touringBikes", "touringMotorcycles", "campers" };

        foreach (var collectionName in vehicleCollections)
        {
            var collection = database.GetCollection<Vehicle>(collectionName);

            // Skip ako indexi postoje
            var existingIndexes = await collection.Indexes.ListAsync();
            var indexNames = new HashSet<string>();
            await existingIndexes.ForEachAsync(index =>
            {
                if (index.TryGetValue("name", out var name))
                    indexNames.Add(name.AsString);
            });

            // Indeksi za sortiranje
            if (!indexNames.Contains("location_repair_year_idx"))
            {
                var locationIndex = Builders<Vehicle>.IndexKeys
                    .Ascending(v => v.Country)
                    .Ascending(v => v.City)
                    .Ascending(v => v.NeedsRepair)
                    .Descending(v => v.Year);

                await collection.Indexes.CreateOneAsync(new CreateIndexModel<Vehicle>(
                    locationIndex,
                    new CreateIndexOptions { Name = "location_repair_year_idx" }));
            }

            // Brand i Model indeksi
            if (!indexNames.Contains("brand_model_text_idx"))
            {
                var textIndex = Builders<Vehicle>.IndexKeys
                    .Text(v => v.Brand)
                    .Text(v => v.Model);

                await collection.Indexes.CreateOneAsync(new CreateIndexModel<Vehicle>(
                    textIndex,
                    new CreateIndexOptions { Name = "brand_model_text_idx" }));
            }
        }

        // Rezervacije
        var reservations = database.GetCollection<Reservation>("reservations");
        var reservationIndexes = await reservations.Indexes.ListAsync();
        var reservationIndexNames = new HashSet<string>();
        await reservationIndexes.ForEachAsync(index =>
        {
            if (index.TryGetValue("name", out var name))
                reservationIndexNames.Add(name.AsString);
        });

        // Check da li su vozila dostupna indeksi
        if (!reservationIndexNames.Contains("vehicle_availability_idx"))
        {
            var availabilityIndex = Builders<Reservation>.IndexKeys
                .Ascending(r => r.VehicleId)
                .Ascending(r => r.Status)
                .Ascending(r => r.StartDate)
                .Ascending(r => r.EndDate);

            await reservations.Indexes.CreateOneAsync(new CreateIndexModel<Reservation>(
                availabilityIndex,
                new CreateIndexOptions { Name = "vehicle_availability_idx" }));
        }

        // Rezervacije korisnika indeksi
        if (!reservationIndexNames.Contains("user_history_idx"))
        {
            var userIndex = Builders<Reservation>.IndexKeys
                .Ascending(r => r.UserId)
                .Descending(r => r.StartDate);

            await reservations.Indexes.CreateOneAsync(new CreateIndexModel<Reservation>(
                userIndex,
                new CreateIndexOptions { Name = "user_history_idx" }));
        }

        // Pending rezervacije indeksi
        if (!reservationIndexNames.Contains("pending_reservations_idx"))
        {
            var pendingIndex = Builders<Reservation>.IndexKeys
                .Ascending(r => r.VehicleType)
                .Ascending(r => r.Status)
                .Ascending(r => r.StartDate)
                .Ascending(r => r.EndDate);

            await reservations.Indexes.CreateOneAsync(new CreateIndexModel<Reservation>(
                pendingIndex,
                new CreateIndexOptions { Name = "pending_reservations_idx" }));
        }

        // TTL index, za brisanje indexa starih rezervacija
        if (!reservationIndexNames.Contains("reservation_ttl_idx"))
        {
            var ttlIndex = Builders<Reservation>.IndexKeys.Ascending(r => r.EndDate);
            await reservations.Indexes.CreateOneAsync(new CreateIndexModel<Reservation>(
                ttlIndex,
                new CreateIndexOptions
                {
                    Name = "reservation_ttl_idx",
                    ExpireAfter = TimeSpan.FromDays(30) // 30 dana da traju
                }));
        }
    }
}