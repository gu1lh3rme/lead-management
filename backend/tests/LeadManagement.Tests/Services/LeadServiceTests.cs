using FluentAssertions;
using LeadManagement.Application.DTOs;
using LeadManagement.Application.Mappings;
using LeadManagement.Application.Services;
using LeadManagement.Domain.Entities;
using LeadManagement.Domain.Interfaces;
using Moq;

namespace LeadManagement.Tests.Services;

public class LeadServiceTests
{
    private readonly Mock<ILeadRepository> _repositoryMock;
    private readonly LeadService _service;

    public LeadServiceTests()
    {
        MappingConfig.Configure();
        _repositoryMock = new Mock<ILeadRepository>();
        _service = new LeadService(_repositoryMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllLeads()
    {
        var leads = new List<Lead>
        {
            new() { Id = Guid.NewGuid(), Name = "Alice", Email = "alice@test.com", Status = LeadStatus.New, Tasks = new List<TaskItem>() },
            new() { Id = Guid.NewGuid(), Name = "Bob", Email = "bob@test.com", Status = LeadStatus.Qualified, Tasks = new List<TaskItem>() }
        };
        _repositoryMock.Setup(r => r.GetAllAsync(null, null)).ReturnsAsync(leads);

        var result = await _service.GetAllAsync(null, null);

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetByIdAsync_WhenLeadExists_ShouldReturnLead()
    {
        var id = Guid.NewGuid();
        var lead = new Lead { Id = id, Name = "Alice", Email = "alice@test.com", Tasks = new List<TaskItem>() };
        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(lead);

        var result = await _service.GetByIdAsync(id);

        result.Should().NotBeNull();
        result.Name.Should().Be("Alice");
    }

    [Fact]
    public async Task GetByIdAsync_WhenLeadNotFound_ShouldThrowKeyNotFoundException()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Lead?)null);

        await _service.Invoking(s => s.GetByIdAsync(id))
            .Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateAndReturnLead()
    {
        var dto = new LeadCreateDto { Name = "Alice", Email = "alice@test.com", Status = LeadStatus.New };
        _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<Lead>()))
            .ReturnsAsync((Lead l) => l);

        var result = await _service.CreateAsync(dto);

        result.Should().NotBeNull();
        result.Name.Should().Be("Alice");
        _repositoryMock.Verify(r => r.CreateAsync(It.IsAny<Lead>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WhenLeadNotFound_ShouldThrowKeyNotFoundException()
    {
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.ExistsAsync(id)).ReturnsAsync(false);

        await _service.Invoking(s => s.DeleteAsync(id))
            .Should().ThrowAsync<KeyNotFoundException>();
    }
}
