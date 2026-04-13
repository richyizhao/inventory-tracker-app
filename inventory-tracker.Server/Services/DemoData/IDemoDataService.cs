using inventory_management.Server.Contracts.Common;

namespace inventory_management.Server.Services.DemoData;

public interface IDemoDataService
{
    Task<DemoDataResultDto> GenerateAsync();

    Task<DemoDataResultDto> ResetAsync();
}
