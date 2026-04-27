using LeadManagement.Domain.Entities;

namespace LeadManagement.Domain.Interfaces;

public interface ITaskItemRepository
{
    Task<IEnumerable<TaskItem>> GetByLeadIdAsync(Guid leadId);
    Task<TaskItem?> GetByIdAsync(Guid id);
    Task<TaskItem> CreateAsync(TaskItem task);
    Task<TaskItem> UpdateAsync(TaskItem task);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
