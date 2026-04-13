using inventory_management.Server.Contracts.Common;
using inventory_management.Server.Services.DemoData;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace inventory_management.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public sealed class SettingsController(IDemoDataService demoDataService) : ControllerBase
{
    private readonly IDemoDataService _demoDataService = demoDataService;

    [HttpPost("demo-data/generate")]
    public async Task<ActionResult<DemoDataResultDto>> GenerateDemoData()
    {
        return Ok(await _demoDataService.GenerateAsync());
    }

    [HttpPost("demo-data/reset")]
    public async Task<ActionResult<DemoDataResultDto>> ResetDemoData()
    {
        return Ok(await _demoDataService.ResetAsync());
    }
}
