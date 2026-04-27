using LeadManagement.Domain.Entities;
using LeadManagement.Domain.Interfaces;
using LeadManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeadManagement.Infrastructure.Repositories;

public class LeadRepository : ILeadRepository
{
    private readonly AppDbContext _context;

    public LeadRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Lead>> GetAllAsync(string? search, LeadStatus? status)
    {
        var query = _context.Leads.Include(l => l.Tasks).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(l =>
                l.Name.Contains(search) || l.Email.Contains(search));

        if (status.HasValue)
            query = query.Where(l => l.Status == status.Value);

        return await query.OrderByDescending(l => l.CreatedAt).ToListAsync();
    }

    public async Task<Lead?> GetByIdAsync(Guid id)
        => await _context.Leads.Include(l => l.Tasks).FirstOrDefaultAsync(l => l.Id == id);

    public async Task<Lead> CreateAsync(Lead lead)
    {
        _context.Leads.Add(lead);
        await _context.SaveChangesAsync();
        return lead;
    }

    public async Task<Lead> UpdateAsync(Lead lead)
    {
        _context.Leads.Update(lead);
        await _context.SaveChangesAsync();
        return lead;
    }

    public async Task DeleteAsync(Guid id)
    {
        var lead = await _context.Leads.FindAsync(id);
        if (lead != null)
        {
            _context.Leads.Remove(lead);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
        => await _context.Leads.AnyAsync(l => l.Id == id);
}
