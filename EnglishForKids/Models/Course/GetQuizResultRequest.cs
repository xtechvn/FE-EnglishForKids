namespace EnglishForKids.Models.Course
{
    public class GetQuizResultRequest
    {
        public int QuizId { get; set; }    // ID của bài Quiz
        public int UserId { get; set; }    // ID của người dùng
    }

}
