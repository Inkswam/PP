using Backend.Models;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        IEnumerable<User> GetAllUsers();
        User CreateUser(User newUser); // новий метод
        
        User GetUserById(int id);  

        User UpdateUser(User user);
        User? ValidateUser(string username, string password);

    }
}