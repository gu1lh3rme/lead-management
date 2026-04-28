using LeadManagement.Application.DTOs;
using LeadManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LeadManagement.Api.Controllers;

[ApiController]
[Route("api/leads/{leadId:guid}/tasks")]
[Produces("application/json")]
public class TaskItemsController : ControllerBase
{
    private readonly ITaskItemService _service;

    public TaskItemsController(ITaskItemService service)
    {
        _service = service;
    }

    /// <summary>Get all tasks for a lead</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskItemDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByLeadId(Guid leadId)
    {
        var tasks = await _service.GetByLeadIdAsync(leadId);
        return Ok(tasks);
    }

    /// <summary>Get a specific task</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid leadId, Guid id)
    {
        var task = await _service.GetByIdAsync(id);
        return Ok(task);
    }

    /// <summary>Create a task for a lead</summary>
    [HttpPost]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(Guid leadId, [FromBody] TaskItemCreateDto dto)
    {
        var task = await _service.CreateAsync(leadId, dto);
        return CreatedAtAction(nameof(GetById), new { leadId, id = task.Id }, task);
    }

    /// <summary>Update a task</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(TaskItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid leadId, Guid id, [FromBody] TaskItemUpdateDto dto)
    {
        var task = await _service.UpdateAsync(id, dto);
        return Ok(task);
    }

    /// <summary>Delete a task</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid leadId, Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
