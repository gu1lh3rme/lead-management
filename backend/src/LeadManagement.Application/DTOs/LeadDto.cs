using LeadManagement.Domain.Entities;

namespace LeadManagement.Application.DTOs;

public class LeadDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public LeadStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<TaskItemDto> Tasks { get; set; } = new();
}

public class LeadCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public LeadStatus Status { get; set; } = LeadStatus.New;
}

public class LeadUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public LeadStatus Status { get; set; }
}
