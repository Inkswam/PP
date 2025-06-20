namespace Backend.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // власник команди (User.Id)
        public int OwnerId { get; set; }
        public User Owner { get; set; } = null!;

        // за потреби серіалізується в JSON чи окрему таблицю
        public List<string> Participants { get; set; } = new();
    }
}