using FluentAssertions;
using LeadManagement.Application.DTOs;
using LeadManagement.Application.Mappings;
using LeadManagement.Application.Services;
using LeadManagement.Domain.Entities;
using LeadManagement.Domain.Interfaces;
using Moq;

namespace LeadManagement.Tests.Services;

public class TaskItemServiceTests
{
    private readonly Mock<ITaskItemRepository> _taskRepositoryMock;
    private readonly Mock<ILeadRepository> _leadRepositoryMock;
    private readonly TaskItemService _service;

    public TaskItemServiceTests()
    {
        MappingConfig.Configure();
        _taskRepositoryMock = new Mock<ITaskItemRepository>();
        _leadRepositoryMock = new Mock<ILeadRepository>();
        _service = new TaskItemService(_taskRepositoryMock.Object, _leadRepositoryMock.Object);
    }

    [Fact]
    public async Task GetByLeadIdAsync_WhenLeadNotFound_ShouldThrowKeyNotFoundException()
    {
        var leadId = Guid.NewGuid();
        _leadRepositoryMock.Setup(r => r.ExistsAsync(leadId)).ReturnsAsync(false);

        await _service.Invoking(s => s.GetByLeadIdAsync(leadId))
            .Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task CreateAsync_WhenLeadExists_ShouldCreateTask()
    {
        var leadId = Guid.NewGuid();
        var dto = new TaskItemCreateDto { Title = "Call client", DueDate = DateTime.UtcNow.AddDays(1) };
        _leadRepositoryMock.Setup(r => r.ExistsAsync(leadId)).ReturnsAsync(true);
        _taskRepositoryMock.Setup(r => r.CreateAsync(It.IsAny<TaskItem>()))
            .ReturnsAsync((TaskItem t) => t);

        var result = await _service.CreateAsync(leadId, dto);

        result.Should().NotBeNull();
        result.Title.Should().Be("Call client");
    }
}
