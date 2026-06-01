// Backend.Interfaces.ITaskService.cs
using Backend.Models;
namespace Backend.Interfaces;
using TaskModel = Backend.Models.Task;


public interface ITaskService
{
    IEnumerable<TaskModel> GetTasksForTeam(int teamId, int ownerId);
    TaskModel CreateTask(TaskModel newTask);
    
    TaskModel? UpdateTaskStatus(int id, string status);
}
