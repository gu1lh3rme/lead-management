using LeadManagement.Application.DTOs;
using LeadManagement.Application.Interfaces;
using LeadManagement.Domain.Entities;
using LeadManagement.Domain.Interfaces;
using Mapster;

namespace LeadManagement.Application.Services;

public class LeadService : ILeadService
{
    private readonly ILeadRepository _repository;

    public LeadService(ILeadRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<LeadDto>> GetAllAsync(string? search, LeadStatus? status)
    {
        var leads = await _repository.GetAllAsync(search, status);
        return leads.Adapt<IEnumerable<LeadDto>>();
    }

    public async Task<LeadDto> GetByIdAsync(Guid id)
    {
        var lead = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Lead with id {id} not found.");
        return lead.Adapt<LeadDto>();
    }

    public async Task<LeadDto> CreateAsync(LeadCreateDto dto)
    {
        var lead = dto.Adapt<Lead>();
        var created = await _repository.CreateAsync(lead);
        return created.Adapt<LeadDto>();
    }

    public async Task<LeadDto> UpdateAsync(Guid id, LeadUpdateDto dto)
    {
        var lead = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException($"Lead with id {id} not found.");
        dto.Adapt(lead);
        var updated = await _repository.UpdateAsync(lead);
        return updated.Adapt<LeadDto>();
    }

    public async Task DeleteAsync(Guid id)
    {
        if (!await _repository.ExistsAsync(id))
            throw new KeyNotFoundException($"Lead with id {id} not found.");
        await _repository.DeleteAsync(id);
    }
}
