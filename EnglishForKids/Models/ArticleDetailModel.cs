namespace EnglishForKids.Models
{
    public class ArticleDetailModel:CategoryArticleModel
    {
        public string body { get; set; } = null!;

        public int status { get; set; }

        public int articletype { get; set; }

        public int? pageview { get; set; }

        public DateTime? createdon { get; set; }

        public DateTime? modifiedon { get; set; }

        public DateTime? downtime { get; set; }

        public DateTime? uptime { get; set; }

        public short? position { get; set; }
    }
}
