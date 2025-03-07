namespace EnglishForKids.ViewModels
{
    public class CourseDetailViewModel
    {
        public bool IsSuccess { get; set; } // Trường isSuccess trong JSON
        public SourceViewModel Source { get; set; } = new SourceViewModel();
        public List<ChapterViewModel> Chapters { get; set; } = new List<ChapterViewModel>();
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
        public List<LessonOrQuizViewModel> Items { get; set; } = new List<LessonOrQuizViewModel>();
    }

    public class LessonOrQuizViewModel
    {
        public string Type { get; set; } // "Lesson" hoặc "Quiz"
        public int? LessonId { get; set; } // Nếu Type == "Lesson"
        public int? QuizId { get; set; } // Nếu Type == "Quiz"
        public string LessonTitle { get; set; }
        public string Title { get; set; }

        public string Author { get; set; }
        public string Thumbnail { get; set; }
        public string VideoDuration { get; set; }
        public string Article { get; set; }
        public List<FileViewModel> Files { get; set; } = new List<FileViewModel>();
        public List<QuestionViewModel> Questions { get; set; } = new List<QuestionViewModel>();
    }

    public class QuestionViewModel
    {
        public int QuestionId { get; set; }
        public string Description { get; set; }
        public List<AnswerViewModel> Answers { get; set; } = new List<AnswerViewModel>();
    }

    public class AnswerViewModel
    {
        public int AnswerId { get; set; }
        public string Description { get; set; }
        public bool IsCorrect { get; set; }
        public string Note { get; set; }
    }

    public class FileViewModel
    {
        public int FileId { get; set; }
        public int Type { get; set; }
        public string Path { get; set; }
        public string Ext { get; set; }
        public int Duration { get; set; }
    }
}
