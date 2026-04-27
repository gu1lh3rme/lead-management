using LeadManagement.Application.DTOs;
using LeadManagement.Application.Interfaces;
using LeadManagement.Domain.Entities;
using LeadManagement.Domain.Interfaces;
using Mapster;

namespace LeadManagement.Application.Services;

public class TaskItemService : ITaskItemService
{
    private readonly ITaskItemRepository _repository;
    private readonly ILeadRepository _leadRepository;

    public TaskItemService(ITaskItemRepository repository, ILeadRepository leadRepository)
    {
        _repository = repository;
        _leadRepository = leadRepository;
    }

    public async Task<IEnumerable<TaskItemDto>> GetByLeadIdAsync(Guid leadId)
    {
        if (!await _leadRepository.ExistsAsync(leadId))
            throw new KeyNotFoundException($"Lead with id {leadId} not found.");
        var tasks = await _repository.GetByLeadIdAsync(leadId);
        return tasks.Adapt<IEnumerable<TaskItemDto>>();
    }

    public async Task<TaskItemDto> GetByIdAsync(Guid id)
    {
        var task = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Task with id {id} not found.");
        return task.Adapt<TaskItemDto>();
    }

    public async Task<TaskItemDto> CreateAsync(Guid leadId, TaskItemCreateDto dto)
    {
        if (!await _leadRepository.ExistsAsync(leadId))
            throw new KeyNotFoundException($"Lead with id {leadId} not found.");
        var task = dto.Adapt<TaskItem>();
        task.LeadId = leadId;
        var created = await _repository.CreateAsync(task);
        return created.Adapt<TaskItemDto>();
    }

    public async Task<TaskItemDto> UpdateAsync(Guid id, TaskItemUpdateDto dto)
    {
        var task = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Task with id {id} not found.");
        dto.Adapt(task);
        var updated = await _repository.UpdateAsync(task);
        return updated.Adapt<TaskItemDto>();
    }

    public async Task DeleteAsync(Guid id)
    {
        if (!await _repository.ExistsAsync(id))
            throw new KeyNotFoundException($"Task with id {id} not found.");
        await _repository.DeleteAsync(id);
    }
}
