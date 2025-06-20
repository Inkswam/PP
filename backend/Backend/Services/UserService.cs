using Backend.Data;
using Backend.Interfaces;
using Backend.Models;



namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        
        
        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

        public User CreateUser(User newUser)
        {
            _context.Users.Add(newUser);
            _context.SaveChanges();
            return newUser;
        }
        
        public User GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }
        public User UpdateUser(User updatedUser)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Id == updatedUser.Id);
            if (existingUser == null)
                return null;

            existingUser.Username = updatedUser.Username;
            existingUser.Email = updatedUser.Email;
            existingUser.Telegram = updatedUser.Telegram;
            existingUser.Password = updatedUser.Password;

            _context.SaveChanges();

            return existingUser;
        }
        
        public User? ValidateUser(string username, string password)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
        }
    }
}