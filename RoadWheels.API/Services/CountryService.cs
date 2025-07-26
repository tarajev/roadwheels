using MongoDB.Bson;
using MongoDB.Driver;
using RoadWheels.API.DTOs;
using RoadWheels.API.Exceptions;
using RoadWheels.API.Models;

namespace RoadWheels.API.Services
{
    public class CountryService(IMongoDatabase database)
    {
        private readonly IMongoCollection<Country> _countries = database.GetCollection<Country>("countries");

        public async Task<List<Country>> GetAvailableCountries()
        {
            return await _countries.Find(_ => true).ToListAsync();
        }

        public async Task UpdateCountryAsync(string countryName, string cityName, int value)
        {
            var filter = Builders<Country>.Filter.Eq(c => c.Name, countryName);

            var update = Builders<Country>.Update
                .SetOnInsert(c => c.Name, countryName)
                .SetOnInsert(c => c.Id, ObjectId.GenerateNewId())
                .Inc($"CityWithVehicles.{cityName}", value);

            var options = new UpdateOptions { IsUpsert = true };

            await _countries.UpdateOneAsync(filter, update, options);
        }

    }
}
