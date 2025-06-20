// Backend.DTOs.CreateTaskDto.cs
namespace Backend.DTOs;
public class CreateTaskDto
{
    public string Title { get; set; } = "";
    public string Status { get; set; } = "";
    public int TeamId { get; set; }
}