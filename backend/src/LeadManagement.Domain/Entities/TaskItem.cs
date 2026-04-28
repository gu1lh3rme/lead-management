namespace LeadManagement.Domain.Entities;

public class TaskItem
{
    public Guid Id { get; set; }
    public Guid LeadId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Lead Lead { get; set; } = null!;
}
