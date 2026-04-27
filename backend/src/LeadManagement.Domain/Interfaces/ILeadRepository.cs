using LeadManagement.Domain.Entities;

namespace LeadManagement.Domain.Interfaces;

public interface ILeadRepository
{
    Task<IEnumerable<Lead>> GetAllAsync(string? search, LeadStatus? status);
    Task<Lead?> GetByIdAsync(Guid id);
    Task<Lead> CreateAsync(Lead lead);
    Task<Lead> UpdateAsync(Lead lead);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}
