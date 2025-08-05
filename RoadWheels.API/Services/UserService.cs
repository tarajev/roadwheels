using MongoDB.Driver;
using RoadWheels.API.Models;
using RoadWheels.API.DTOs;
using RoadWheels.API.Extensions;

namespace RoadWheels.API.Services
{
    public class UserService(IMongoDatabase database)
    {
        private readonly IMongoCollection<User> _users = database.GetCollection<User>("users");

        #region CRUD

        public async Task<User?> GetUser(string id)
        {
            var user = await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
            return user;
        }

        public async Task<User?> CreateUser(UserRegisterDto userRegisterDto)
        {
            var existingUser = await _users.Find(u => u.Email == userRegisterDto.Email).FirstOrDefaultAsync();
            if (existingUser != null)
                return null;

            var user = new User
            {
                Name = userRegisterDto.Name,
                Email = userRegisterDto.Email,
                PasswordHash = PasswordHasher.HashPassword(userRegisterDto.Password),
                PhoneNumber = userRegisterDto.PhoneNumber,
                Role = userRegisterDto.Role,

            };

            await _users.InsertOneAsync(user);
            return user;
        }

        public async Task<bool> UpdateUser(UpdateUserDto updateUserDto)
        {
            var user = await _users.Find(u => u.Id == updateUserDto.Id).FirstOrDefaultAsync();
            if (user == null)
                return false;

            var updateDef = Builders<User>.Update
            .Set(u => u.Name, updateUserDto.Name)
            .Set(u => u.PhoneNumber, updateUserDto.PhoneNumber);

            if (!string.IsNullOrWhiteSpace(updateUserDto.NewPassword))
            {
                var isOldPasswordCorrect = PasswordHasher.VerifyPassword(updateUserDto.OldPassword, user.PasswordHash);
                if (!isOldPasswordCorrect)
                    return false;

                var newPasswordHash = PasswordHasher.HashPassword(updateUserDto.NewPassword);
                updateDef = updateDef.Set(u => u.PasswordHash, newPasswordHash);
            }

            var result = await _users.UpdateOneAsync(u => u.Id == updateUserDto.Id, updateDef);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteUser(string id)
        {
            var result = await _users.DeleteOneAsync(u => u.Id == id);
            return result.DeletedCount > 0;
        }

        #endregion CRUD
    }
}