using EnglishForKids.ViewModels;

namespace EnglishForKids.Models.Course
{
    public class QuizProgressResponse
    {
        public bool Status { get; set; }   // Trạng thái request
        public bool Completed { get; set; } // Người dùng đã hoàn thành quiz chưa
        public int? NextQuestionIndex { get; set; } // Câu hỏi tiếp theo cần làm (null nếu hoàn thành)
        public int CorrectCount { get; set; } // Số câu đúng
        public List<QuestionViewModel> CorrectAnswers { get; set; } = new List<QuestionViewModel>(); // Câu hỏi đúng
        public List<QuestionViewModel> IncorrectAnswers { get; set; } = new List<QuestionViewModel>(); // Câu hỏi sai
        public string Message { get; set; } // Thông báo trạng thái
    }
}
