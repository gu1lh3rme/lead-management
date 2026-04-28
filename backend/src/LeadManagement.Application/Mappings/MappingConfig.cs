using LeadManagement.Application.DTOs;
using LeadManagement.Domain.Entities;
using Mapster;

namespace LeadManagement.Application.Mappings;

public static class MappingConfig
{
    public static void Configure()
    {
        TypeAdapterConfig<Lead, LeadDto>.NewConfig()
            .Map(dest => dest.Tasks, src => src.Tasks);

        TypeAdapterConfig<LeadCreateDto, Lead>.NewConfig()
            .Map(dest => dest.Id, _ => Guid.NewGuid())
            .Map(dest => dest.CreatedAt, _ => DateTime.UtcNow)
            .Map(dest => dest.UpdatedAt, _ => DateTime.UtcNow);

        TypeAdapterConfig<LeadUpdateDto, Lead>.NewConfig()
            .Map(dest => dest.UpdatedAt, _ => DateTime.UtcNow)
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.CreatedAt)
            .Ignore(dest => dest.Tasks);

        TypeAdapterConfig<TaskItem, TaskItemDto>.NewConfig();

        TypeAdapterConfig<TaskItemCreateDto, TaskItem>.NewConfig()
            .Map(dest => dest.Id, _ => Guid.NewGuid())
            .Map(dest => dest.CreatedAt, _ => DateTime.UtcNow)
            .Map(dest => dest.UpdatedAt, _ => DateTime.UtcNow);

        TypeAdapterConfig<TaskItemUpdateDto, TaskItem>.NewConfig()
            .Map(dest => dest.UpdatedAt, _ => DateTime.UtcNow)
            .Ignore(dest => dest.Id)
            .Ignore(dest => dest.LeadId)
            .Ignore(dest => dest.CreatedAt);
    }
}
