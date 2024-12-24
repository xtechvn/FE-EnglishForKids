namespace EnglishForKids.ViewModels
{
    public class CourseDetailViewModel
    {
        public bool IsSuccess { get; set; } // Trường isSuccess trong JSON
        public SourceViewModel Source { get; set; }
        public List<ChapterViewModel> Chapters { get; set; }
    }

    public class SourceViewModel
    {
        public int SourceId { get; set; }
        public string SourceTitle { get; set; }
        public string SourceDescription { get; set; }
        public string SourceThumbnail { get; set; }
        public string VideoIntro { get; set; }
        public string SourceBenefif { get; set; }
        public decimal Price { get; set; }
        public decimal OriginalPrice { get; set; }
        public int Status { get; set; }
    }

    public class ChapterViewModel
    {
        public int ChapterId { get; set; }
        public string ChapterTitle { get; set; }
        public List<LessonViewModel> Lessons { get; set; }
    }

    public class LessonViewModel
    {
        public int LessonId { get; set; }
        public string LessonTitle { get; set; }
        public string Author { get; set; }
        public string Thumbnail { get; set; }
        public string VideoDuration { get; set; }
    }
}
