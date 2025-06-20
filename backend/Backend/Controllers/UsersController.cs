using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize] // Додаємо авторизацію
        public ActionResult<IEnumerable<object>> GetAll() // Змінюємо тип повернення
        {
            // Повертаємо користувачів без паролів
            var users = _userService.GetAllUsers()
                .Select(u => new {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Telegram = u.Telegram
                    // Пароль не повертаємо з безпеки
                });
            return Ok(users);
        }

        [HttpPost]
        public ActionResult<User> Create(User newUser)
        {
            var createdUser = _userService.CreateUser(newUser);
            return CreatedAtAction(nameof(GetAll), new { id = createdUser.Id }, createdUser);
        }
        
        
        [HttpGet("current")]
        public ActionResult<User> GetCurrentUser()
        {
            var user = _userService.GetAllUsers().FirstOrDefault();

            if (user == null)
                return NotFound();

            return Ok(user);
        }
        
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, User updatedUser)
        {
            var existingUser = _userService.GetUserById(id);
            if (existingUser == null)
                return NotFound();

            // Оновлення полів користувача
            existingUser.Username = updatedUser.Username;
            existingUser.Email = updatedUser.Email;
            existingUser.Telegram = updatedUser.Telegram;
            existingUser.Password = updatedUser.Password;

            _userService.UpdateUser(existingUser);

            return Ok(existingUser);
        }
        
        
        
        
    }
}