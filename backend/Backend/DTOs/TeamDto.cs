namespace Backend.DTOs;

public class TeamDto
{
    public int Id { get; set; }             
    public string Name { get; set; } = "";
    public List<string> Participants { get; set; } = new();

   
       public int OwnerId { get; set; }
}


