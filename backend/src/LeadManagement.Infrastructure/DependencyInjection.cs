using LeadManagement.Domain.Interfaces;
using LeadManagement.Infrastructure.Data;
using LeadManagement.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LeadManagement.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ILeadRepository, LeadRepository>();
        services.AddScoped<ITaskItemRepository, TaskItemRepository>();

        return services;
    }
}
