using LeadManagement.Domain.Entities;

namespace LeadManagement.Application.DTOs;

public class TaskItemDto
{
    public Guid Id { get; set; }
    public Guid LeadId { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public TaskItemStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class TaskItemCreateDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public TaskItemStatus Status { get; set; } = TaskItemStatus.Todo;
}

public class TaskItemUpdateDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public TaskItemStatus Status { get; set; }
}
