
var player;
var currentLessonIndex = 0; // Index bài học hiện tại
var lessons = []; // Lưu danh sách các bài học
var debounceTimeout = null; // Dùng để chặn double click nhanh
let currentQuestionIndex = 0;
let selectedAnswers = {};
let quizData = []; // Lưu toàn bộ dữ liệu quiz
let correctAnswersCount = 0;
let userResults = [];
let skippedQuestions = []; // Lưu danh sách câu hỏi đã bỏ qua
let currentLessonId = null; // Lưu ID bài giảng hiện tại
let currentQuizId = null; // Lưu ID bài giảng hiện tại



document.addEventListener('DOMContentLoaded', function () {
    player = new Plyr('#lesson-video', {
        controls: ['play-large', 'restart', 'rewind', 'play', 'fast-forward',
            'progress', 'current-time', 'duration', 'mute', 'volume',
            'settings', 'fullscreen'],
        settings: ['captions', 'quality', 'speed'],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        ratio: '16:9'
    });

    const videoContainer = document.querySelector('.video-container');
    videoContainer.style.height = "572.200px";

    player.on('loadedmetadata', () => {
        const videoUrl = player.source;
        const savedTime = localStorage.getItem(`video-time-${videoUrl}`);
        if (savedTime) {
            player.currentTime = parseFloat(savedTime);
        }
    });

    player.on('timeupdate', () => {
        const videoUrl = player.source;
        localStorage.setItem(`video-time-${videoUrl}`, player.currentTime);
    });

    lessons = Array.from(document.querySelectorAll('.right-quiz .item'));

    // ✅ Kiểm tra xem đã có bài giảng hoặc quiz nào được lưu trong localStorage không
    let savedLessonId = localStorage.getItem('currentLessonId');
    let savedQuizId = localStorage.getItem('currentQuizId'); // 🔥 Lưu lại quiz ID

    if (lessons.length > 0) {
        let savedLesson = lessons.find(lesson => lesson.getAttribute("data-lesson-id") === savedLessonId);
        let savedQuiz = lessons.find(lesson => lesson.getAttribute("data-quiz-id") === savedQuizId);

        if (savedQuiz) {
            console.log("🟢 Mở lại Quiz đã lưu:", savedQuiz);
            handleLessonClick(savedQuiz); // 👉 Nếu trước đó đang làm quiz, mở lại quiz đó
        } else if (savedLesson) {
            console.log("🟢 Mở lại Bài giảng đã lưu:", savedLesson);
            handleLessonClick(savedLesson); // 👉 Nếu không, mở lại bài học đang xem
        } else {
            console.log("🟢 Mở bài học đầu tiên.");
            handleLessonClick(lessons[0]); // 👉 Nếu không có gì, mở bài đầu tiên
        }
    }

    document.querySelector('.nav-prev').addEventListener('click', () => navigateLesson(-1));
    document.querySelector('.nav-next').addEventListener('click', () => navigateLesson(1));
});

/**
 * 🟡 Phát video khi chọn bài học
 */
function playLesson(videoUrl) {
    if (!videoUrl) return;

    if (player) {
        player.source = {
            type: 'video',
            sources: [{ src: videoUrl, type: 'video/mp4' }]
        };
        player.play();
        document.querySelector('.video-container').scrollIntoView({ behavior: 'smooth' });
    }
}

function navigateLesson(direction) {
    if (debounceTimeout) {
        return; // Nếu đang trong thời gian debounce, chặn thao tác
    }

    debounceTimeout = setTimeout(() => {
        debounceTimeout = null;
    }, 300); // Khoảng thời gian chặn spam click (300ms)

    let newIndex = currentLessonIndex + direction;

    if (newIndex >= 0 && newIndex < lessons.length) {
        currentLessonIndex = newIndex;
        handleLessonClick(lessons[currentLessonIndex]);
    }
}
function handleLessonClick(element) {
    debugger;

    // Lấy ID của bài học mới
    let lessonId = element.getAttribute("data-lesson-id"); // 👈 Thêm data-lesson-id vào HTML nếu chưa có
    let type = element.getAttribute("data-type");
    let quizId2 = element.getAttribute("data-quiz-id"); // 📌 Lấy ID Quiz (nếu có)
    // 🛑 Nếu đang ở chính bài học này rồi, không làm gì cả (Kể cả Quiz)
    if (lessonId === currentLessonId && type !== "quiz") {
        console.log("📌 Đã ở trong bài này rồi, không cần reset lại.");
        return;
    }
    // 🛑 Nếu bấm lại chính Quiz đang làm → Không reset
    if (type === "quiz" && quizId2 === currentQuizId) {
        console.log("📌 Đã ở quiz này rồi, không cần reset lại!");
        return;
    }
    // ✅ Lưu lại ID bài giảng hoặc quiz vào localStorage
    localStorage.setItem('currentLessonId', lessonId);
    if (type === "quiz") {
        localStorage.setItem('currentQuizId', quizId2); // 🔥 Lưu lại quiz ID
    } else {
        localStorage.removeItem('currentQuizId'); // 🔥 Nếu chuyển sang bài học, xóa quiz ID
    }


    // ✅ Cập nhật bài học/quiz hiện tại
    currentLessonId = lessonId;
    if (type === "quiz") {
        currentQuizId = quizId2; // Cập nhật ID quiz
    } else {
        currentQuizId = null; // Reset quiz khi chuyển sang bài học
    }

    closeAllPanels();


    let lessonTitle = element.getAttribute("data-lesson-title"); // Lấy tiêu đề bài học
    let videoUrl = element.getAttribute("data-video-url") || "";
    let articleContent = element.getAttribute("data-article-content");
    let articleFiles = JSON.parse(element.getAttribute("data-article-files") || "[]");
    console.log("data-article-files:", element.getAttribute("data-article-files"));
    console.log("data-quiz-data:", element.getAttribute("data-quiz-data"));


    // ✅ Xác định Chapter chứa bài giảng
    let chapterElement = element.closest(".lesson"); // Tìm phần tử cha là Chapter
    if (chapterElement) {
        // ✅ Mở Chapter chứa bài giảng này
        let chapterList = chapterElement.querySelector(".list-lesson");
        if (chapterList) {
            chapterList.style.display = "block"; // Hiển thị chapter chứa bài học
        }
    }
    //let quizData = JSON.parse(element.getAttribute("data-quiz-data") || "[]");
    // Cập nhật trạng thái bài học đang được chọn (hover effect)
    lessons.forEach(lesson => lesson.classList.remove('active'));
    element.classList.add('active');

    if (type === "video") {
        document.getElementById('video-panel').style.display = 'block';
        playLesson(videoUrl);
    }
    else if (type === "article") {
        document.getElementById('article-panel').style.display = 'block';
        let articleTitle = document.getElementById('article-title');
        let articleContainer = document.getElementById('article-content');
        let articleNotice = document.getElementById('article-notice');
        let articleFilesContainer = document.getElementById('article-files'); // Container chứa danh sách tài nguyên
        let articleResource = document.getElementById('article-resource');
        let quizResult = document.getElementById('quiz-result-panel');
        // Hiển thị tiêu đề bài học
        articleTitle.innerText = lessonTitle;
        quizResult.style.display = 'none';

        if (articleContent.trim()) {
            articleContainer.innerHTML = articleContent;
            articleNotice.style.display = 'none';
        } else {
            articleContainer.innerHTML = "";
            articleNotice.style.display = 'block';
        }

        // Xóa danh sách cũ trước khi thêm file mới
        articleFilesContainer.innerHTML = "";

        if (articleFiles.length > 0) {
            articleFiles.forEach(file => {
                let fileLink = document.createElement("p");
                fileLink.innerHTML = `<a href="${file.Path}" download>📂 ${file.Path}</a>`;
                fileLink.addEventListener("click", function (event) {
                    event.preventDefault();
                    autoDownload(file.Path);
                });
                articleFilesContainer.appendChild(fileLink);
            });

            if (articleResource) {
                articleResource.href = articleFiles[0].Path;  // Đảm bảo key đúng là "path"
                articleResource.style.display = 'block';
            }
        } else {
            if (articleResource) {
                articleResource.style.display = 'none';
            }
            // Tự động tải xuống file đầu tiên
            //downloadFile(articleFiles[0].path);
        }
    }
    else if (type === "document") {
        // Nếu chỉ có tài liệu mà không có bài viết, hiển thị danh sách file
        document.getElementById('article-panel').style.display = 'block';

        let articleTitle = document.getElementById('article-title');
        let articleContainer = document.getElementById('article-content');
        let articleFilesContainer = document.getElementById('article-files');
        let articleNotice = document.getElementById('article-notice');
        if (articleContent.trim()) {
            articleContainer.innerHTML = articleContent;
            articleNotice.style.display = 'none';
        } else {
            articleContainer.innerHTML = "";
            articleNotice.style.display = 'block';
        }

        articleTitle.innerText = lessonTitle;
        articleContainer.innerHTML = "";


        articleFilesContainer.innerHTML = "";
        if (articleFiles.length > 0) {
            articleFiles.forEach(file => {
                let fileLink = document.createElement("p");
                fileLink.innerHTML = `<a href="${file.Path}" download class="file-download">${file.Path}</a>`;
                fileLink.addEventListener("click", function (event) {
                    event.preventDefault();
                    autoDownload(file.Path);
                });
                articleFilesContainer.appendChild(fileLink);
            });
        } else {
            articleNotice.style.display = 'block';
        }
    }
    else if (type === "quiz") {
        debugger
        document.getElementById('quiz-panel').style.display = 'block';
        document.getElementById('quiz-result-panel').style.display = 'none'; // 🛑 Ẩn panel kết quả khi mở quiz
        quizData = JSON.parse(element.getAttribute("data-quiz-data") || "[]");
        courseId = element.getAttribute("data-course-id");
        quizId = element.getAttribute("data-quiz-id");

        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        selectedAnswers = {};

        // 🛑 Reset UI để tránh hiển thị dữ liệu cũ
        document.getElementById('quiz-question').innerHTML = "";
        document.getElementById('quiz-answers').innerHTML = "";
        document.getElementById('quizIndex').innerHTML = "";
        document.getElementById('quizTotal').innerHTML = "";
        document.querySelector(".noti.error").style.display = "none";
        document.querySelector(".noti.success").style.display = "none";

        // 🛑 Gọi API để kiểm tra trạng thái quiz
        checkQuizProgress();

    } else {
        // Nếu chỉ có tài liệu mà không có bài viết, hiển thị danh sách file
        document.getElementById('article-panel').style.display = 'block';

        let articleTitle = document.getElementById('article-title');
        let articleContainer = document.getElementById('article-content');
        let articleFilesContainer = document.getElementById('article-files');
        let articleNotice = document.getElementById('article-notice');
        if (articleContent.trim()) {
            articleContainer.innerHTML = articleContent;
            articleNotice.style.display = 'none';
        } else {
            articleContainer.innerHTML = "";
            articleNotice.style.display = 'block';
        }
        articleTitle.innerText = lessonTitle;
        articleContainer.innerHTML = "";
        articleFilesContainer.innerHTML = "";

    }
    // Cập nhật index bài học hiện tại
    currentLessonIndex = lessons.indexOf(element);
}

function checkQuizProgress() {
    debugger;
    $.ajax({
        url: "/Course/GetQuizResults",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            QuizId: quizId,
            UserId: 1
        }),
        success: function (response) {
            debugger;
            if (response.status && response.completed) {
                showQuizResult(response);
                return;
            }

            // ✅ 1️⃣ Lưu danh sách đầy đủ câu hỏi từ API (giữ nguyên thứ tự gốc)
            if (response.allQuestions && response.allQuestions.length > 0) {
                quizData = response.allQuestions.slice(); // ✅ Copy để không thay đổi mảng gốc
            }

            // ✅ 2️⃣ Xác định câu đầu tiên chưa làm mà KHÔNG đảo thứ tự danh sách
            let firstUnansweredIndex = quizData.findIndex(q => !response.correctAnswers.some(r => r.questionId === q.questionId));

            if (firstUnansweredIndex !== -1) {
                currentQuestionIndex = firstUnansweredIndex; // ✅ Chuyển đến câu chưa làm đầu tiên
            } else {
                currentQuestionIndex = response.nextQuestionIndex ?? 0; // Nếu tất cả đã làm, chuyển theo logic cũ
            }

            userResults = response.correctAnswers || [];
            skippedQuestions = response.skippedQuestions || [];

            renderQuizQuestion();
        },
        error: function () {
            alert("Lỗi khi kiểm tra tiến trình quiz.");
        }
    });
}

function renderQuizQuestion() {
    debugger;
    let quizIndex = document.getElementById('quizIndex');
    let quizTotal = document.getElementById('quizTotal');
    let quizQuestion = document.getElementById('quiz-question');
    let quizAnswers = document.getElementById('quiz-answers');
    let checkButton = document.querySelector(".btn-check-answer");
    let errorMessage = document.querySelector(".noti.error");
    let successMessage = document.querySelector(".noti.success");

    errorMessage.style.display = "none";
    successMessage.style.display = "none";
    checkButton.style.display = "block";

    console.log("📌 Kiểm tra currentQuestionIndex trước render:", currentQuestionIndex);

    if (!quizData || quizData.length === 0 || currentQuestionIndex >= quizData.length) {
        console.log("🚨 Không có câu hỏi nào để hiển thị. Hiển thị kết quả quiz.");
        showQuizResult();
        return;
    }


    let question = quizData[currentQuestionIndex];

    console.log(`📝 Hiển thị câu hỏi ${question.questionId}`);

    // ✅ Hiển thị số thứ tự đúng
    quizTotal.innerHTML = `Câu hỏi ${currentQuestionIndex + 1}/${quizData.length}`;
    quizIndex.innerHTML = `Câu hỏi ${currentQuestionIndex + 1}`;
    quizQuestion.innerHTML = question.description;
    quizAnswers.innerHTML = "";

    // ✅ Giữ nguyên thứ tự câu trả lời từ API
    let originalAnswers = [...question.answers]; // Tạo bản sao để tránh thay đổi dữ liệu gốc

    originalAnswers.forEach((answer) => {
        let isChecked = question.selectedAnswer === answer.answerId ? "checked" : "";
        let isDisabled = question.isAnswered ? "disabled" : "";
        let isIncorrect = question.isAnswered && question.selectedAnswer !== answer.answerId ? "disabled-option" : "";

        let answerHTML = `
            <div class="item item3 ${isIncorrect}">
                <div class="box-radio">
                    <input type="radio" id="radio-${answer.answerId}" name="quiz-answer" class="radio" value="${answer.answerId}" ${isChecked} ${isDisabled} onclick="enableCheckButton()" />
                    <label for="radio-${answer.answerId}"></label>
                </div>
                <div class="txt">${answer.description}</div>
            </div>
        `;
        quizAnswers.innerHTML += answerHTML;
    });

    // ✅ Nếu câu hỏi đã làm, disable đáp án sai nhưng vẫn giữ nguyên thứ tự
    if (question.isAnswered) {
        let allOptions = document.querySelectorAll("input[name='quiz-answer']");
        allOptions.forEach(option => {
            if (parseInt(option.value) !== question.selectedAnswer) {
                option.disabled = true;
                let parent = option.closest(".item");
                parent.classList.add("disabled-option"); // Thêm class đổi màu
                parent.querySelector(".box-radio").style.opacity = "0.5"; // Làm mờ radio button
            }
        });

        checkButton.disabled = false;
        checkButton.innerText = "Kiểm tra đáp án";
        checkButton.style.opacity = "1";
        checkButton.onclick = checkAnswer;
    } else {
        checkButton.disabled = true;
        checkButton.innerText = "Kiểm tra đáp án";
        checkButton.style.opacity = "0.6";
        checkButton.onclick = checkAnswer;
    }
}

function fetchQuizResultsAndShow() {
    debugger;
    $.ajax({
        url: "/Course/GetQuizResults",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            QuizId: quizId,
            UserId: 1
        }),
        success: function (response) {
            debugger;
            if (response.status) {
                showQuizResult(response); // 🔥 Gọi lại `showQuizResult()` với dữ liệu API
            } else {
                alert("Lỗi khi lấy kết quả trắc nghiệm.");
            }
        },
        error: function () {
            alert("Lỗi hệ thống khi lấy kết quả trắc nghiệm.");
        }
    });
}

function checkAnswer() {
    debugger
    let selectedOption = document.querySelector("input[name='quiz-answer']:checked");
    if (!selectedOption) {
        alert("Vui lòng chọn một câu trả lời!");
        return;
    }

    let selectedAnswerId = parseInt(selectedOption.value);
    let question = quizData[currentQuestionIndex];
    let correctAnswer = question.answers.find(a => a.isCorrect);
    let errorMessage = document.querySelector(".noti.error");
    let successMessage = document.querySelector(".noti.success");
    let checkButton = document.querySelector(".btn-check-answer");
    let checkSkip = document.querySelector(".btn-skip");

    let allOptions = document.querySelectorAll("input[name='quiz-answer']");
    // 🛑 Disable nút "Kiểm tra đáp án" để tránh spam
    checkButton.disabled = true;

    console.log(question);
    $.ajax({
        url: "/Course/SubmitQuizAnswer",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            QuizId: question.questionId,
            QuizAnswerId: selectedAnswerId,
            SourceId: courseId,
            UserId: 1
        }),
        success: function (response) {
            debugger
            if (response.isCorrect) {
                successMessage.style.display = "block";
                successMessage.querySelector("p").innerText = "Chính xác! Bạn đã trả lời đúng.";
                errorMessage.style.display = "none";
                correctAnswersCount++;

                // ✅ Cập nhật `isAnswered` cho câu này
                quizData[currentQuestionIndex].isAnswered = true;
                quizData[currentQuestionIndex].selectedAnswer = selectedAnswerId;
                if (currentQuestionIndex + 1 < quizData.length) {
                    checkButton.innerText = "Tiếp tục để sang câu hỏi tiếp theo";
                    checkButton.style.opacity = "1"; // hiện nút
                    checkButton.disabled = false; // Bật lại nút để có thể nhấn tiếp tục
                    checkButton.onclick = nextQuestion;

                } else {
                    checkButton.innerText = "Xem kết quả";
                    checkSkip.style.display = "none";
                    checkButton.disabled = false; // Bật lại nút để có thể nhấn tiếp tục
                    checkButton.style.opacity = "1"; // hiện nút
                    checkButton.onclick = function () {
                        fetchQuizResultsAndShow();
                    };

                }
                allOptions.forEach(option => {
                    if (parseInt(option.value) !== correctAnswer.answerId) {
                        option.disabled = true;
                        let parent = option.closest(".item");
                        parent.classList.add("disabled-option"); // Thêm class đổi màu
                        parent.querySelector(".box-radio").style.opacity = "0.5";
                    }

                });
            } else {
                errorMessage.style.display = "block";
                errorMessage.querySelector("span").innerText = "Sai gòi";
                errorMessage.querySelector("p").innerText = question.answers.find(a => a.answerId === selectedAnswerId)?.note || "Câu trả lời chưa chính xác!";
                successMessage.style.display = "none";
                selectedOption.disabled = true; // Disable đáp án sai
                let parent = selectedOption.closest(".item");
                parent.classList.add("disabled-option"); // Thêm lớp để đổi màu đáp án sai
                parent.querySelector(".box-radio").style.opacity = "0.5"; // Làm mờ checkbox thay vì ẩn hoàn toàn
                // 🛑 Disable nút kiểm tra để tránh spam request
                checkButton.disabled = true;
                checkButton.style.opacity = "0.6"; // Làm mờ nút


            }


        },
        error: function () {
            alert("Lỗi khi gửi câu trả lời.");
            checkButton.disabled = false; // Nếu lỗi, bật lại nút
        }
    });

}
function showQuizResult(response = null) {
    debugger;
    document.getElementById('quiz-panel').style.display = 'none';

    document.getElementById('quiz-result-panel').style.display = 'block';

    let checkButton = document.querySelector(".btn-check-answer");

    if (response) {
        document.getElementById('quiz-result-title').innerText = response.completed
            ? "Tuyệt vời! Bạn đã sẵn sàng chuyển sang bài giảng tiếp theo"
            : "Xem lại tài liệu khóa học để mở rộng kiến thức học tập của bạn.";
        document.getElementById('quiz-result-score').innerText = `Bạn đã trả lời đúng ${response.correctCount}/${quizData.length} câu hỏi`;

        document.getElementById('quiz-correct-answers').innerHTML = response.correctAnswers.map(q => `<p>✅ ${q.description}</p>`).join('');
        document.getElementById('quiz-incorrect-answers').innerHTML = response.incorrectAnswers.map(q => `<p>❌ ${q.description}</p>`).join('');
        document.getElementById('quiz-skipped-answers').innerHTML = response.skippedQuestions.map(q => `<p>⚠️ ${q.description}</p>`).join('');

        document.getElementById('quiz-correct-section').style.display = response.correctAnswers.length > 0 ? 'block' : 'none';
        document.getElementById('quiz-incorrect-section').style.display = response.incorrectAnswers.length > 0 ? 'block' : 'none';
        document.getElementById('quiz-skipped-section').style.display = response.skippedQuestions.length > 0 ? 'block' : 'none';
    } else {
        alert("Không có dữ liệu kết quả! Hãy thử làm lại bài quiz.");
    }

    checkButton.innerText = "Tiếp tục";

}

function nextQuestion() {
    debugger;

    // 🛑 Lọc danh sách câu chưa trả lời
    let remainingQuestions = quizData.filter(q => !q.isAnswered);

    // ✅ Nếu vẫn còn câu hỏi chưa làm, tiếp tục chuyển câu
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++; // ✅ Chuyển sang câu tiếp theo
        renderQuizQuestion();
        return;
    }

    // 🚨 Chỉ khi tất cả câu hỏi đều bị bỏ qua, quay lại câu đầu tiên chưa làm
    if (remainingQuestions.length === quizData.length) {
        console.log("🚨 Người dùng đã bỏ qua tất cả câu hỏi.");
        showSkippedResult();
        return;
    }

    // 🛑 Nếu đang ở câu cuối mà vẫn còn câu chưa làm, tìm câu tiếp theo chưa làm
    let nextSkipped = quizData.findIndex(q => !q.isAnswered && quizData.indexOf(q) > currentQuestionIndex);
    if (nextSkipped !== -1) {
        currentQuestionIndex = nextSkipped; // ✅ Chuyển đến câu tiếp theo chưa làm
        renderQuizQuestion();
        return;
    }

    // 🚀 Nếu không còn câu hỏi nào để làm nữa, hiển thị kết quả quiz
    fetchQuizResultsAndShow();
}

function showSkippedResult() {
    debugger;
    document.getElementById('quiz-panel').style.display = 'none';
    document.getElementById('quiz-result-panel').style.display = 'block';

    // 🛑 Xác định số câu hỏi bị bỏ qua
    let skippedQuestions = quizData.filter(q => !q.isAnswered);

    // 🚀 Nếu toàn bộ câu hỏi bị bỏ qua
    if (skippedQuestions.length === quizData.length) {
        document.getElementById('quiz-result-title').innerText = "Hoàn thành trắc nghiệm để xem kết quả của bạn.";
        document.getElementById('quiz-result-score').innerText = `Bạn đã trả lời đúng 0/${quizData.length} câu hỏi. Bạn đã bỏ qua tất cả.`;
    } else {
        document.getElementById('quiz-result-title').innerText = "Bạn chưa hoàn thành hết bài quiz!";
        document.getElementById('quiz-result-score').innerText = `Bạn đã trả lời đúng ${correctAnswersCount}/${quizData.length} câu hỏi.`;
    }

    let skippedContainer = document.getElementById('quiz-skipped-answers');
    skippedContainer.innerHTML = skippedQuestions.map(q => `<p>⚠️ ${q.description}</p>`).join('');

    document.getElementById('quiz-correct-section').style.display = 'none';
    document.getElementById('quiz-incorrect-section').style.display = 'none';
    document.getElementById('quiz-skipped-section').style.display = skippedQuestions.length > 0 ? 'block' : 'none';
}
function resetQuiz() {
    debugger;
    console.log("🔄 Reset quiz...");

    $.ajax({
        url: "/Course/ResetQuiz",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            QuizId: quizId,
            UserId: 1
        }),
        success: function (response) {
            debugger;
            if (response) {
                console.log("✅ Quiz đã reset thành công!");

                // 🛑 Reset dữ liệu trên giao diện
                userResults = [];
                correctAnswersCount = 0;
                currentQuestionIndex = 0;
                skippedQuestions = [];
                selectedAnswers = {};
                // 🔥 Reset toàn bộ quizData
                quizData.forEach(q => {
                    q.selectedAnswer = null;
                    q.isAnswered = false;
                });
                // 🔥 Reset UI - Xóa nội dung cũ trên giao diện
                document.getElementById('quiz-question').innerHTML = "";
                document.getElementById('quiz-answers').innerHTML = "";
                document.getElementById('quizIndex').innerHTML = "";
                document.getElementById('quizTotal').innerHTML = "";

                // 🛑 Ẩn các thông báo đúng/sai
                document.querySelector(".noti.error").style.display = "none";
                document.querySelector(".noti.success").style.display = "none";
                document.querySelector(".btn-skip").style.display = "block";


                // 🔥 Reset panel kết quả
                document.getElementById('quiz-result-panel').style.display = 'none';
                document.getElementById('quiz-correct-answers').innerHTML = "";
                document.getElementById('quiz-incorrect-answers').innerHTML = "";
                document.getElementById('quiz-skipped-answers').innerHTML = "";

                document.getElementById('quiz-correct-section').style.display = 'none';
                document.getElementById('quiz-incorrect-section').style.display = 'none';
                document.getElementById('quiz-skipped-section').style.display = 'none';




                // 🛑 Hiển thị lại quiz panel để làm lại
                document.getElementById('quiz-panel').style.display = 'block';

                // 🛑 Gọi lại API để lấy câu hỏi mới
                checkQuizProgress();
            } else {
                alert("❌ Lỗi khi reset quiz: " + response.message);
            }
        },
        error: function () {
            alert("❌ Lỗi hệ thống khi reset quiz.");
        }
    });
}

//function showQuizResult(response = null) {
//    debugger;
//    document.getElementById('quiz-panel').style.display = 'none';


//        document.getElementById('quiz-result-panel').style.display = 'block';

//        let checkButton = document.querySelector(".btn-check-answer");

//        if (response) {
//            let totalQuestions = quizData.length;
//            let correctCount = response.correctCount || 0;
//            let incorrectCount = response.incorrectAnswers.length || 0;
//            let skippedCount = response.skippedQuestions.length || 0;

//            console.log(`✅ Đúng: ${correctCount}, ❌ Sai: ${incorrectCount}, ⚠️ Bỏ qua: ${skippedCount}, Tổng: ${totalQuestions}`);

//            // 🛑 Nếu TẤT CẢ câu hỏi đều bị bỏ qua → Chuyển sang `showSkippedResult()`
//            if (correctCount === 0 && incorrectCount === 0 && skippedCount === totalQuestions) {
//                console.log("🚨 Người dùng đã bỏ qua hết câu hỏi. Gọi showSkippedResult()");
//                showSkippedResult(response.skippedQuestions);
//                return;
//            }

//            // ✅ Nếu có câu đúng → Hiển thị kết quả bình thường
//            if (correctCount > 0) {
//                document.getElementById('quiz-result-title').innerText = "Tuyệt vời! Bạn đã sẵn sàng chuyển sang bài giảng tiếp theo";
//            } else {
//                document.getElementById('quiz-result-title').innerText = "Hãy xem lại bài học để cải thiện kết quả!";
//            }

//            document.getElementById('quiz-result-score').innerText = `Bạn đã trả lời đúng ${correctCount}/${totalQuestions} câu hỏi`;

//            // ✅ 1️⃣ Hiển thị câu trả lời đúng
//            let correctSection = document.getElementById('quiz-correct-section');
//            let correctAnswersContainer = document.getElementById('quiz-correct-answers');
//            if (correctCount > 0) {
//                correctSection.style.display = 'block';
//                correctAnswersContainer.innerHTML = response.correctAnswers.map(q => `<p>✅ ${q.description}</p>`).join('');
//            } else {
//                correctSection.style.display = 'none';
//            }

//            // ✅ 2️⃣ Hiển thị câu trả lời sai
//            let incorrectSection = document.getElementById('quiz-incorrect-section');
//            let incorrectAnswersContainer = document.getElementById('quiz-incorrect-answers');
//            if (incorrectCount > 0) {
//                incorrectSection.style.display = 'block';
//                incorrectAnswersContainer.innerHTML = response.incorrectAnswers.map(q => `<p>❌ ${q.description}</p>`).join('');
//            } else {
//                incorrectSection.style.display = 'none';
//            }

//            // ✅ 3️⃣ Hiển thị câu bị bỏ qua (chỉ khi có câu sai/đúng)
//            let skippedSection = document.getElementById('quiz-skipped-section');
//            let skippedAnswersContainer = document.getElementById('quiz-skipped-answers');
//            if (skippedCount > 0 && (correctCount > 0 || incorrectCount > 0)) {
//                skippedSection.style.display = 'block';
//                skippedAnswersContainer.innerHTML = response.skippedQuestions.map(q => `<p>⚠️ ${q.description}</p>`).join('');
//            } else {
//                skippedSection.style.display = 'none';
//            }
//        } else {
//            alert("Không có dữ liệu kết quả! Hãy thử làm lại bài quiz.");
//        }

//        checkButton.innerText = "Tiếp tục";

//}

function enableCheckButton() {
    let checkButton = document.querySelector(".btn-check-answer");
    checkButton.disabled = false; // ✅ Bật nút khi user chọn đáp án
    checkButton.style.opacity = "1"; // hiện nút
}

function autoDownload(url) {
    let a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}



/**
 * 🔴 Ẩn tất cả panel trước khi mở panel mới
 */
function closeAllPanels() {

    document.getElementById('video-panel').style.display = 'none';
    document.getElementById('article-panel').style.display = 'none';
    document.getElementById('quiz-panel').style.display = 'none';
    document.getElementById('article-notice').style.display = 'none';
    document.getElementById('quiz-result-panel').style.display = 'none';

    if (player) {
        player.pause(); // Dừng video khi chuyển bài
    }
}
/**
 * 🔵 Hiển thị Navigation khi hover vào video
 */
function showNavQuiz() {
    document.getElementById('nav-quiz').style.display = 'flex';
}

/**
 * 🔵 Ẩn Navigation khi không hover
 */
function hideNavQuiz() {
    document.getElementById('nav-quiz').style.display = 'none';
}



function toggleChapter(chapterId) {
    var chapterElement = document.getElementById("chapter-" + chapterId);
    chapterElement.style.display = chapterElement.style.display === "none" ? "block" : "none";
}

function toggleFiles(lessonId, event) {
    if (event) event.stopPropagation();
    var fileList = document.getElementById('files-' + lessonId);
    fileList.style.display = fileList.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('click', function (event) {
    var fileLists = document.querySelectorAll('.file-list');
    fileLists.forEach(function (fileList) {
        if (fileList.style.display === 'block' && !fileList.contains(event.target) && !event.target.classList.contains('btn-file')) {
            fileList.style.display = 'none';
        }
    });
});
