namespace EnglishForKids.Models.Authentication
{
    public class APITokenCacheModel
    {
        public string token { get; set; }
        public DateTime expires { get; set; }
    }
}
