public class LessonDetailResponse
{
    public string VideoUrl { get; set; } // Link video nếu có
    public string AudioUrl { get; set; } // Link audio nếu có
    public string ArticleContent { get; set; } // Nội dung bài viết nếu có
    public List<LessonFile> ArticleFiles { get; set; } // Danh sách tài liệu nếu có
    public List<QuizQuestion> QuizData { get; set; } // Dữ liệu câu hỏi của Quiz nếu có
}

public class LessonFile
{
    public string Name { get; set; } // Tên file
    public string Path { get; set; } // Đường dẫn file
}

public class QuizQuestion
{
    public int QuestionId { get; set; } // ID câu hỏi
    public string QuestionText { get; set; } // Nội dung câu hỏi
    public List<QuizOption> Options { get; set; } // Danh sách đáp án
}

public class QuizOption
{
    public int OptionId { get; set; } // ID đáp án
    public string OptionText { get; set; } // Nội dung đáp án
}
