// using Backend.Models;
//
// namespace Backend.Interfaces
// {
//     public interface ITeamService
//     {
//         IEnumerable<Team> GetAllTeamsForUser(int userId);
//         Team? GetTeamById(int id);
//         Team CreateTeam(Team newTeam);
//         
//         // Нові методи для роботи з учасниками
//         bool AddParticipantToTeam(int teamId, int userId);
//         bool RemoveParticipantFromTeam(int teamId, int userId);
//         IEnumerable<User> GetTeamParticipants(int teamId);
//     }
// }



using Backend.Models;

namespace Backend.Interfaces
{
    public interface ITeamService
    {
        IEnumerable<Team> GetAllTeamsForUser(int userId);
        Team? GetTeamById(int id);
        Team CreateTeam(Team newTeam);
        bool DeleteTeam(int teamId, int userId); // Додано метод видалення
        
        // Методи для роботи з учасниками
        bool AddParticipantToTeam(int teamId, int userId);
        bool RemoveParticipantFromTeam(int teamId, int userId);
        IEnumerable<User> GetTeamParticipants(int teamId);
    }
}