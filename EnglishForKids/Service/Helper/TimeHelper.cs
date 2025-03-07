namespace EnglishForKids.Service.Helper
{
    public static class TimeHelper
    {
        public static string FormatDuration(int seconds)
        {
            if (seconds <= 0)
                return "0 phút";

            if (seconds >= 3600) // Nếu trên 1 tiếng
                return $"{seconds / 3600} giờ {seconds % 3600 / 60} phút";
            else if (seconds >= 60) // Nếu trên 1 phút
                return $"{seconds / 60} phút {seconds % 60} giây";
            else
                return $"{seconds} giây";
        }
    }

}
