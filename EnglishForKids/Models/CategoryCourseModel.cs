namespace EnglishForKids.Models
{
    public class CategoryCourseModel
    {
        public int id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string thumbnail { get; set; }
        public string video_intro { get; set; }

        public DateTime? create_date { get; set; }
        public int status { get; set; }
        public decimal price { get; set; }
        public decimal original_price { get; set; }
        public int? pageview { get; set; }
        public string list_category_id { get; set; }
        public string list_category_name { get; set; }
        // ✅ Thêm tổng số bài giảng
        public int? TotalLessons { get; set; }

        // ✅ Thêm tổng thời lượng khóa học (phút)
        public int TotalDuration { get; set; }
    }
}
