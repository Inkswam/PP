using System.Collections.Generic;
using System.Linq;
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  
    public class TeamsController : ControllerBase
    {
        private readonly ITeamService _teamService;
        private readonly IUserService _userService;

        public TeamsController(ITeamService teamService, IUserService userService)
        {
            _teamService = teamService;
            _userService = userService;
        }

        // GET /api/teams - отримати ВСІ команди де користувач є власником АБО учасником
        [HttpGet]
        public IActionResult GetMyTeams()
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            if (!int.TryParse(userIdClaim, out var userId))
                return BadRequest("Invalid user id in token");

            // Тепер отримуємо команди де користувач є власником АБО учасником
            var teams = _teamService.GetAllTeamsForUser(userId);

            var result = teams.Select(t => new TeamDto {
                Id           = t.Id,
                Name         = t.Name,
                Participants = t.Participants,
                OwnerId      = t.OwnerId
            }).ToList();

            return Ok(result);
        }

        // GET /api/teams/{id}
        [HttpGet("{id}")]
        public IActionResult GetTeam(int id)
        {
            var team = _teamService.GetTeamById(id);
            if (team == null)
                return NotFound();

            var userIdClaim = User.FindFirst("id")?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized();

            // Перевіряємо чи користувач має доступ до команди (власник АБО учасник)
            bool hasAccess = team.OwnerId == userId || 
                           team.Participants.Contains(userId.ToString());

            if (!hasAccess)
                return Forbid();

            var dto = new TeamDto {
                Id           = team.Id,
                Name         = team.Name,
                Participants = team.Participants,
                OwnerId      = team.OwnerId
            };
            return Ok(dto);
        }

        // POST /api/teams
        [HttpPost]
        public IActionResult CreateTeam([FromBody] TeamDto dto)
        {
            var ownerIdClaim = User.FindFirst("id")?.Value;
            if (ownerIdClaim == null)
                return Unauthorized();

            if (!int.TryParse(ownerIdClaim, out var ownerId))
                return BadRequest("Invalid user id in token");

            var newTeam = new Team {
                Name         = dto.Name,
                Participants = dto.Participants ?? new List<string>(),
                OwnerId      = ownerId
            };

            var created = _teamService.CreateTeam(newTeam);

            var createdDto = new TeamDto {
                Id           = created.Id,
                Name         = created.Name,
                Participants = created.Participants,
                OwnerId      = created.OwnerId
            };

            return CreatedAtAction(
                nameof(GetTeam),
                new { id = createdDto.Id },
                createdDto
            );
        }

        // POST /api/teams/{teamId}/participants/{userId} - додати учасника до команди
        [HttpPost("{teamId}/participants/{participantId}")]
        public IActionResult AddParticipant(int teamId, int participantId)
        {
            var currentUserIdClaim = User.FindFirst("id")?.Value;
            if (!int.TryParse(currentUserIdClaim, out int currentUserId))
                return Unauthorized();

            var team = _teamService.GetTeamById(teamId);
            if (team == null)
                return NotFound("Team not found");

            // Тільки власник може додавати учасників
            if (team.OwnerId != currentUserId)
                return Forbid("Only team owner can add participants");

            // Перевіряємо чи існує користувач
            var participant = _userService.GetUserById(participantId);
            if (participant == null)
                return BadRequest("User not found");

            var success = _teamService.AddParticipantToTeam(teamId, participantId);
            if (!success)
                return BadRequest("Failed to add participant");

            return Ok(new { message = "Participant added successfully" });
        }

        // DELETE /api/teams/{teamId}/participants/{userId} - видалити учасника з команди
        [HttpDelete("{teamId}/participants/{participantId}")]
        public IActionResult RemoveParticipant(int teamId, int participantId)
        {
            var currentUserIdClaim = User.FindFirst("id")?.Value;
            if (!int.TryParse(currentUserIdClaim, out int currentUserId))
                return Unauthorized();

            var team = _teamService.GetTeamById(teamId);
            if (team == null)
                return NotFound("Team not found");

            // Власник може видаляти будь-кого, учасник може видалити тільки себе
            if (team.OwnerId != currentUserId && participantId != currentUserId)
                return Forbid("You can only remove yourself or be the team owner");

            var success = _teamService.RemoveParticipantFromTeam(teamId, participantId);
            if (!success)
                return BadRequest("Failed to remove participant");

            return Ok(new { message = "Participant removed successfully" });
        }

        // GET /api/teams/{teamId}/participants - отримати всіх учасників команди
        [HttpGet("{teamId}/participants")]
        public IActionResult GetTeamParticipants(int teamId)
        {
            var currentUserIdClaim = User.FindFirst("id")?.Value;
            if (!int.TryParse(currentUserIdClaim, out int currentUserId))
                return Unauthorized();

            var team = _teamService.GetTeamById(teamId);
            if (team == null)
                return NotFound("Team not found");

            // Перевіряємо доступ до команди
            bool hasAccess = team.OwnerId == currentUserId || 
                           team.Participants.Contains(currentUserId.ToString());

            if (!hasAccess)
                return Forbid();

            var participants = _teamService.GetTeamParticipants(teamId);
            return Ok(participants);
        }

        // POST /api/teams/{teamId}/join - приєднатися до команди (self-join)
        [HttpPost("{teamId}/join")]
        public IActionResult JoinTeam(int teamId)
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var team = _teamService.GetTeamById(teamId);
            if (team == null)
                return NotFound("Team not found");

            // Перевіряємо чи користувач вже не є учасником
            if (team.OwnerId == userId || team.Participants.Contains(userId.ToString()))
                return BadRequest("You are already a member of this team");

            var success = _teamService.AddParticipantToTeam(teamId, userId);
            if (!success)
                return BadRequest("Failed to join team");

            return Ok(new { message = "Successfully joined the team" });
        }
        
        // DELETE /api/teams/{id} - видалити команду
        [HttpDelete("{id}")]
        public IActionResult DeleteTeam(int id)
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var team = _teamService.GetTeamById(id);
            if (team == null)
                return NotFound("Team not found");

            // Перевіряємо чи користувач є власником команди
            if (team.OwnerId != userId)
                return Forbid("Only team owner can delete the team");

            var success = _teamService.DeleteTeam(id, userId);
            if (!success)
                return BadRequest("Failed to delete team");

            return Ok(new { message = "Team deleted successfully" });
        }

        // POST /api/teams/{teamId}/leave - покинути команду
        [HttpPost("{teamId}/leave")]
        public IActionResult LeaveTeam(int teamId)
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized();

            var team = _teamService.GetTeamById(teamId);
            if (team == null)
                return NotFound("Team not found");

            // Власник не може покинути власну команду
            if (team.OwnerId == userId)
                return BadRequest("Team owner cannot leave the team");

            var success = _teamService.RemoveParticipantFromTeam(teamId, userId);
            if (!success)
                return BadRequest("Failed to leave team");

            return Ok(new { message = "Successfully left the team" });
        }
    }
}