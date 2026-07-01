namespace Server.Analytics.Services;

public enum AnalyticsRange
{
    OneDay,
    SevenDays,
    OneMonth,
    ThreeMonths,
    OneYear,
    Max,
}

public static class AnalyticsRangeParser
{
    public static bool TryParse(string? value, out AnalyticsRange range)
    {
        switch (value?.Trim().ToUpperInvariant())
        {
            case null:
            case "":
            case "1 DAY":
                range = AnalyticsRange.OneDay;
                return true;
            case "7 DAYS":
                range = AnalyticsRange.SevenDays;
                return true;
            case "1 MONTH":
                range = AnalyticsRange.OneMonth;
                return true;
            case "3 MONTHS":
                range = AnalyticsRange.ThreeMonths;
                return true;
            case "1 YEAR":
                range = AnalyticsRange.OneYear;
                return true;
            case "MAX":
                range = AnalyticsRange.Max;
                return true;
            default:
                range = default;
                return false;
        }
    }

    public static DateTime? GetStartDateUtc(AnalyticsRange range, DateTime utcNow) => range switch
    {
        AnalyticsRange.OneDay => utcNow.AddDays(-1),
        AnalyticsRange.SevenDays => utcNow.AddDays(-7),
        AnalyticsRange.OneMonth => utcNow.AddDays(-30),
        AnalyticsRange.ThreeMonths => utcNow.AddDays(-90),
        AnalyticsRange.OneYear => utcNow.AddYears(-1),
        AnalyticsRange.Max => null,
        _ => null
    };

    public static DateTime GetBucketStartUtc(AnalyticsRange range, DateTime dateTimeUtc)
    {
        var utc = dateTimeUtc.Kind == DateTimeKind.Utc
            ? dateTimeUtc
            : DateTime.SpecifyKind(dateTimeUtc, DateTimeKind.Utc);

        return range switch
        {
            AnalyticsRange.OneDay => new DateTime(
                utc.Year,
                utc.Month,
                utc.Day,
                utc.Hour,
                0,
                0,
                DateTimeKind.Utc),
            AnalyticsRange.SevenDays or AnalyticsRange.OneMonth => utc.Date,
            AnalyticsRange.ThreeMonths => GetWeekStartUtc(utc),
            AnalyticsRange.OneYear => new DateTime(utc.Year, utc.Month, 1, 0, 0, 0, DateTimeKind.Utc),
            AnalyticsRange.Max => GetQuarterStartUtc(utc),
            _ => utc.Date
        };
    }

    public static string GetAllowedRangeMessage() => "Range must be one of 1 day, 7 days, 1 month, 3 months, 1 year, or max.";

    private static DateTime GetWeekStartUtc(DateTime utcDateTime)
    {
        var daysSinceMonday = ((int)utcDateTime.DayOfWeek + 6) % 7;
        return utcDateTime.Date.AddDays(-daysSinceMonday);
    }

    private static DateTime GetQuarterStartUtc(DateTime utcDateTime)
    {
        var quarterStartMonth = ((utcDateTime.Month - 1) / 3) * 3 + 1;
        return new DateTime(utcDateTime.Year, quarterStartMonth, 1, 0, 0, 0, DateTimeKind.Utc);
    }
}
