using LeadManagement.Application.DTOs;
using LeadManagement.Domain.Entities;

namespace LeadManagement.Application.Interfaces;

public interface ILeadService
{
    Task<IEnumerable<LeadDto>> GetAllAsync(string? search, LeadStatus? status);
    Task<LeadDto> GetByIdAsync(Guid id);
    Task<LeadDto> CreateAsync(LeadCreateDto dto);
    Task<LeadDto> UpdateAsync(Guid id, LeadUpdateDto dto);
    Task DeleteAsync(Guid id);
}
