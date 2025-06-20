using System.IdentityModel.Tokens.Jwt;
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        // [HttpPost("login")]
        // public IActionResult Login([FromBody] LoginRequest request)
        // {
        //     var user = _userService.ValidateUser(request.Username, request.Password);
        //     if (user == null)
        //         return Unauthorized("Invalid credentials");
        //
        //     var token = JwtHelper.GenerateToken(user, _configuration);
        //
        //     Response.Cookies.Append("jwt", token, new CookieOptions
        //     {
        //         HttpOnly = true,
        //         Secure = false,
        //         SameSite = SameSiteMode.None,
        //         Expires = DateTime.UtcNow.AddDays(7)
        //     });
        //
        //     return Ok(new { message = "Logged in" });
        // }

        
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _userService.ValidateUser(request.Username, request.Password);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var token = JwtHelper.GenerateToken(user, _configuration);

            // Зберігаємо в cookie (як було)
            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            // ТАКОЖ повертаємо токен в response для localStorage
            return Ok(new { 
                message = "Logged in",
                token = token,  // ← додаємо токен в response
                user = new { 
                    id = user.Id, 
                    username = user.Username 
                }
            });
        }
        
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { message = "Logged out" });
        }

        
        [HttpGet("user")]
        public IActionResult UserProfile()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];
                if (jwt == null) return Unauthorized();

                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.ReadJwtToken(jwt);

                var userId = token.Claims.First(c => c.Type == "id").Value;
                var user = _userService.GetUserById(int.Parse(userId));
                return Ok(user);
            }
            catch
            {
                return Unauthorized();
            }
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];
                if (jwt == null) return Unauthorized();

                var tokenHandler = new JwtSecurityTokenHandler();
                var jsonToken = tokenHandler.ReadJwtToken(jwt);

                var userId = jsonToken.Claims.First(c => c.Type == "id").Value;
                var user = _userService.GetUserById(int.Parse(userId));
        
                if (user == null)
                    return NotFound();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return Unauthorized();
            }
        }

            
        }

        

    }

    
    
    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
