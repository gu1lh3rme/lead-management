using LeadManagement.Domain.Entities;
using LeadManagement.Domain.Interfaces;
using LeadManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LeadManagement.Infrastructure.Repositories;

public class TaskItemRepository : ITaskItemRepository
{
    private readonly AppDbContext _context;

    public TaskItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItem>> GetByLeadIdAsync(Guid leadId)
        => await _context.TaskItems
            .Where(t => t.LeadId == leadId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

    public async Task<TaskItem?> GetByIdAsync(Guid id)
        => await _context.TaskItems.FindAsync(id);

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        _context.TaskItems.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem> UpdateAsync(TaskItem task)
    {
        _context.TaskItems.Update(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task DeleteAsync(Guid id)
    {
        var task = await _context.TaskItems.FindAsync(id);
        if (task != null)
        {
            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
        => await _context.TaskItems.AnyAsync(t => t.Id == id);
}
