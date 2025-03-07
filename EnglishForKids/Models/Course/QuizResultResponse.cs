namespace EnglishForKids.Models.Course
{
    public class QuizResultResponse
    {
        public bool Status { get; set; } // Trạng thái xử lý API (true nếu thành công)
        public bool IsCorrect { get; set; } // Đáp án của user có đúng không
        public string? CorrectAnswerNote { get; set; } // Lời giải thích nếu user chọn sai
        public string Message { get; set; } // Thông báo hiển thị cho user
    }
}
