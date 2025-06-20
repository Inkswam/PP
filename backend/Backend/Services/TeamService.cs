//
// using System.Collections.Generic;
// using System.Linq;
// using Backend.Data;
// using Backend.Interfaces;
// using Backend.Models;
// using Microsoft.EntityFrameworkCore;
//
// namespace Backend.Services
// {
//     public class TeamService : ITeamService
//     {
//         private readonly AppDbContext _context;
//         public TeamService(AppDbContext context)
//         {
//             _context = context;
//         }
//
//         public Team CreateTeam(Team newTeam)
//         {
//             _context.Teams.Add(newTeam);
//             _context.SaveChanges();
//             return newTeam;
//         }
//
//         // Оновлений метод: повертає команди де користувач є власником АБО учасником
//         public IEnumerable<Team> GetAllTeamsForUser(int userId)
//         {
//             var teams = _context.Teams
//                 .Include(t => t.Owner)
//                 .Where(t => t.OwnerId == userId || 
//                            t.Participants.Contains(userId.ToString()))
//                 .ToList();
//             
//             return teams;
//         }
//         
//         public Team? GetTeamById(int id)
//             => _context.Teams
//                 .Include(t => t.Owner)
//                 .FirstOrDefault(t => t.Id == id);
//
//         // Новий метод для додавання учасника до команди
//         public bool AddParticipantToTeam(int teamId, int userId)
//         {
//             var team = _context.Teams.FirstOrDefault(t => t.Id == teamId);
//             if (team == null) return false;
//
//             // Перевіряємо чи користувач вже не є учасником
//             if (!team.Participants.Contains(userId.ToString()))
//             {
//                 team.Participants.Add(userId.ToString());
//                 _context.SaveChanges();
//             }
//             
//             return true;
//         }
//
//         // Новий метод для видалення учасника з команди
//         public bool RemoveParticipantFromTeam(int teamId, int userId)
//         {
//             var team = _context.Teams.FirstOrDefault(t => t.Id == teamId);
//             if (team == null) return false;
//
//             team.Participants.Remove(userId.ToString());
//             _context.SaveChanges();
//             
//             return true;
//         }
//
//         // Метод для отримання всіх учасників команди
//         public IEnumerable<User> GetTeamParticipants(int teamId)
//         {
//             var team = _context.Teams
//                 .Include(t => t.Owner)
//                 .FirstOrDefault(t => t.Id == teamId);
//             
//             if (team == null) return new List<User>();
//
//             var participantIds = team.Participants
//                 .Select(p => int.TryParse(p, out int id) ? id : 0)
//                 .Where(id => id > 0)
//                 .ToList();
//
//             var participants = _context.Users
//                 .Where(u => participantIds.Contains(u.Id))
//                 .ToList();
//
//             // Додаємо власника до списку учасників
//             if (!participants.Any(p => p.Id == team.OwnerId))
//             {
//                 participants.Add(team.Owner);
//             }
//
//             return participants;
//         }
//
//         // TODO: UpdateTeam, DeleteTeam…
//     }
// }


using System.Collections.Generic;
using System.Linq;
using Backend.Data;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class TeamService : ITeamService
    {
        private readonly AppDbContext _context;
        public TeamService(AppDbContext context)
        {
            _context = context;
        }

        public Team CreateTeam(Team newTeam)
        {
            _context.Teams.Add(newTeam);
            _context.SaveChanges();
            return newTeam;
        }

        // Оновлений метод: повертає команди де користувач є власником АБО учасником
        public IEnumerable<Team> GetAllTeamsForUser(int userId)
        {
            var teams = _context.Teams
                .Include(t => t.Owner)
                .Where(t => t.OwnerId == userId || 
                           t.Participants.Contains(userId.ToString()))
                .ToList();
            
            return teams;
        }
        
        public Team? GetTeamById(int id)
            => _context.Teams
                .Include(t => t.Owner)
                .FirstOrDefault(t => t.Id == id);

        // Новий метод для видалення команди
        public bool DeleteTeam(int teamId, int userId)
        {
            var team = _context.Teams.FirstOrDefault(t => t.Id == teamId);
            if (team == null) return false;

            // Перевіряємо чи користувач є власником команди
            if (team.OwnerId != userId) return false;

            _context.Teams.Remove(team);
            _context.SaveChanges();
            
            return true;
        }

        // Новий метод для додавання учасника до команди
        public bool AddParticipantToTeam(int teamId, int userId)
        {
            var team = _context.Teams.FirstOrDefault(t => t.Id == teamId);
            if (team == null) return false;

            // Перевіряємо чи користувач вже не є учасником
            if (!team.Participants.Contains(userId.ToString()))
            {
                team.Participants.Add(userId.ToString());
                _context.SaveChanges();
            }
            
            return true;
        }

        // Новий метод для видалення учасника з команди
        public bool RemoveParticipantFromTeam(int teamId, int userId)
        {
            var team = _context.Teams.FirstOrDefault(t => t.Id == teamId);
            if (team == null) return false;

            team.Participants.Remove(userId.ToString());
            _context.SaveChanges();
            
            return true;
        }

        // Метод для отримання всіх учасників команди
        public IEnumerable<User> GetTeamParticipants(int teamId)
        {
            var team = _context.Teams
                .Include(t => t.Owner)
                .FirstOrDefault(t => t.Id == teamId);
            
            if (team == null) return new List<User>();

            var participantIds = team.Participants
                .Select(p => int.TryParse(p, out int id) ? id : 0)
                .Where(id => id > 0)
                .ToList();

            var participants = _context.Users
                .Where(u => participantIds.Contains(u.Id))
                .ToList();

            // Додаємо власника до списку учасників
            if (!participants.Any(p => p.Id == team.OwnerId))
            {
                participants.Add(team.Owner);
            }

            return participants;
        }
    }
}