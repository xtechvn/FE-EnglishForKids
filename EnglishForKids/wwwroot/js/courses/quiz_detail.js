document.addEventListener("DOMContentLoaded", function () {
    debugger
    // Kiểm tra nếu danh sách bài học tồn tại
    if (document.querySelector(".list-lesson")) {
        document.querySelectorAll(".list-lesson .item").forEach(item => {
            item.addEventListener("click", function () {
                let id = this.getAttribute("data-id"); // Lấy ID từ data-attribute
                let type = this.getAttribute("data-type"); // Lấy Type từ data-attribute
                //loadContent(id, type);
            });
        });
    }
});

//function loadContent(id, type) {
//    debugger
//    var contentDiv = document.getElementById("quiz-content");

//    // Kiểm tra nếu dữ liệu Model tồn tại trước khi sử dụng
//    if (typeof Model === 'undefined' || !Model.Chapters) {
//        console.error("Dữ liệu Model không tồn tại hoặc chưa được load.");
//        return;
//    }

//    //var lessons = @Html.Raw(Json.Serialize(Model.Chapters.SelectMany(ch => ch.Items).ToList()));

//    if (type === "Lesson") {
//        var selectedLesson = lessons.find(l => l.LessonId == id);
//        if (selectedLesson) {
//            let videoFile = selectedLesson.Files.find(f => f.Type == 40);
//            let resourceFiles = selectedLesson.Files.filter(f => f.Type == 50);

//            contentDiv.innerHTML = `
//                <h3>${selectedLesson.LessonTitle}</h3>
//                ${videoFile ? `<video width="100%" height="auto" controls>
//                                <source src="${videoFile.Path}" type="video/mp4">
//                              </video>` : "<p>Không có video.</p>"}
//                <div>${selectedLesson.Article}</div>
//                ${resourceFiles.length > 0 ? "<h4>Tài nguyên:</h4>" + resourceFiles.map(f => `<a href="${f.Path}" download>${f.Path}</a>`).join("<br>") : ""}
//            `;
//        }
//    }
//    else if (type === "Quiz") {
//        var quiz = lessons.find(q => q.QuizId == id);
//        if (quiz) {
//            contentDiv.innerHTML = `
//                <h3>${quiz.Title}</h3>
//                ${quiz.Questions.map(q => `
//                    <div class="quiz-question">
//                        <p>${q.Description}</p>
//                        <ul>
//                            ${q.Answers.map(a => `<li>${a.Description} ${a.IsCorrect ? "✔" : ""}</li>`).join("")}
//                        </ul>
//                    </div>
//                `).join("")}
//            `;
//        }
//    }
//}
