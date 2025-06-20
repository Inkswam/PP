// Backend/Services/TaskService.cs
using System.Collections.Generic;
using System.Linq;
using Backend.Data;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;
using TaskModel = Backend.Models.Task;

namespace Backend.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _ctx;
        public TaskService(AppDbContext ctx) => _ctx = ctx;

        public IEnumerable<TaskModel> GetTasksForTeam(int teamId, int ownerId)
        {
            return _ctx.Tasks
                .Include(t => t.Team)
                .Where(t => t.TeamId == teamId && t.Team.OwnerId == ownerId)
                .ToList();
        }

        public TaskModel CreateTask(TaskModel newTask)
        {
            _ctx.Tasks.Add(newTask);
            _ctx.SaveChanges();
            return newTask;
        }
    }
}