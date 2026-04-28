using LeadManagement.Application.DTOs;

namespace LeadManagement.Application.Interfaces;

public interface ITaskItemService
{
    Task<IEnumerable<TaskItemDto>> GetByLeadIdAsync(Guid leadId);
    Task<TaskItemDto> GetByIdAsync(Guid id);
    Task<TaskItemDto> CreateAsync(Guid leadId, TaskItemCreateDto dto);
    Task<TaskItemDto> UpdateAsync(Guid id, TaskItemUpdateDto dto);
    Task DeleteAsync(Guid id);
}
