/*
// Backend.Controllers.TasksController.cs
using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using TaskModel = Backend.Models.Task;


namespace Backend.Controllers;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    public TasksController(ITaskService taskService) => _taskService = taskService;

    // GET /api/tasks?teamId={id}
    [HttpGet]
    public IActionResult GetTasks([FromQuery] int teamId)
    {
        var ownerId = int.Parse(User.FindFirst("id")!.Value);
        var tasks = _taskService.GetTasksForTeam(teamId, ownerId);
        return Ok(tasks);
    }

    // POST /api/tasks
    [HttpPost]
    public IActionResult Create([FromBody] CreateTaskDto dto)
    {
        var ownerId = int.Parse(User.FindFirst("id")!.Value);

        // можна тут перевірити, що dto.TeamId належить ownerId

        var task = new  TaskModel
        {
            Title = dto.Title,
            Status = dto.Status,
            TeamId = dto.TeamId
        };

        var created = _taskService.CreateTask(task);
        return CreatedAtAction(
            nameof(GetTasks),
            new { teamId = created.TeamId },
            created
        );
    }
}
*/

using Backend.DTOs;
using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskModel = Backend.Models.Task;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    public TasksController(ITaskService taskService) => _taskService = taskService;

    [HttpGet]
    public IActionResult GetTasks([FromQuery] int teamId)
    {
        var ownerId = int.Parse(User.FindFirst("id")!.Value);
        var tasks = _taskService.GetTasksForTeam(teamId, ownerId);
        return Ok(tasks);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreateTaskDto dto)
    {
        var ownerId = int.Parse(User.FindFirst("id")!.Value);
        var task = new TaskModel
        {
            Title = dto.Title,
            Status = dto.Status,
            TeamId = dto.TeamId
        };
        var created = _taskService.CreateTask(task);
        return CreatedAtAction(nameof(GetTasks), new { teamId = created.TeamId }, created);
    }

    [HttpPatch("{id}")]
    public IActionResult UpdateStatus(int id, [FromBody] UpdateTaskStatusDto dto)
    {
        var task = _taskService.UpdateTaskStatus(id, dto.Status);
        if (task == null) return NotFound();
        return Ok(task);
    }
}