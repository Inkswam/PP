// Backend.Models.Task.cs
namespace Backend.Models;
public class Task
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Status { get; set; } = "";    // "awaiting", "in-progress", "completed"
    public int TeamId { get; set; }
    public Team Team { get; set; } = null!;
}