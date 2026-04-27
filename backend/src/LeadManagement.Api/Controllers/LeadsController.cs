using LeadManagement.Application.DTOs;
using LeadManagement.Application.Interfaces;
using LeadManagement.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LeadManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class LeadsController : ControllerBase
{
    private readonly ILeadService _service;

    public LeadsController(ILeadService service)
    {
        _service = service;
    }

    /// <summary>Get all leads with optional filters</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<LeadDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] LeadStatus? status)
    {
        var leads = await _service.GetAllAsync(search, status);
        return Ok(leads);
    }

    /// <summary>Get a lead by ID</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(LeadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var lead = await _service.GetByIdAsync(id);
        return Ok(lead);
    }

    /// <summary>Create a new lead</summary>
    [HttpPost]
    [ProducesResponseType(typeof(LeadDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] LeadCreateDto dto)
    {
        var lead = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = lead.Id }, lead);
    }

    /// <summary>Update an existing lead</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(LeadDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] LeadUpdateDto dto)
    {
        var lead = await _service.UpdateAsync(id, dto);
        return Ok(lead);
    }

    /// <summary>Delete a lead</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}
