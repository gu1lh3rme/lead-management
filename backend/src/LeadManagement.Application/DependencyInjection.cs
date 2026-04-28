using LeadManagement.Application.Interfaces;
using LeadManagement.Application.Mappings;
using LeadManagement.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace LeadManagement.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        MappingConfig.Configure();
        services.AddScoped<ILeadService, LeadService>();
        services.AddScoped<ITaskItemService, TaskItemService>();
        return services;
    }
}
