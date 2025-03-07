

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



//document.addEventListener("DOMContentLoaded", function () {
//    let contentPanel = document.querySelector(".block-quiz"); // Phần chứa bài học
//    let zoomOutBtn = document.getElementById("zoom-out-btn"); // Nút mở toàn màn hình
//    let zoomInBtn = document.getElementById("zoom-in-btn"); // Nút mở ngang

//    // ✅ Xử lý mở toàn màn hình (Zoom-Out)
//    zoomOutBtn.addEventListener("click", function () {
//        if (contentPanel.classList.contains("fullscreen")) {
//            contentPanel.classList.remove("fullscreen");
//            zoomOutBtn.classList.remove("active");
//        } else {
//            contentPanel.classList.add("fullscreen");
//            zoomOutBtn.classList.add("active");

//            // Tắt full-width nếu đang bật
//            zoomInBtn.classList.remove("active");
//            contentPanel.classList.remove("fullwidth");
//        }
//    });

//    // ✅ Xử lý mở ngang (Zoom-In)
//    zoomInBtn.addEventListener("click", function () {
//        if (contentPanel.classList.contains("fullwidth")) {
//            contentPanel.classList.remove("fullwidth");
//            zoomInBtn.classList.remove("active");
//        } else {
//            contentPanel.classList.add("fullwidth");
//            zoomInBtn.classList.add("active");

//            // Tắt fullscreen nếu đang bật
//            zoomOutBtn.classList.remove("active");
//            contentPanel.classList.remove("fullscreen");
//        }
//    });
//});


document.addEventListener('DOMContentLoaded', function () {
    debugger
    player = videojs('lesson-video', {
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
        responsive: true,
        fluid: false, // Đảm bảo không bị thay đổi chiều cao động
        height: 572.200, // Chiều cao cố định
        controlBar: {
            children: [
                'playToggle',
                'volumePanel',
                'currentTimeDisplay',
                'timeDivider',
                'durationDisplay',
                'progressControl',
                'playbackRateMenuButton',
                'fullscreenToggle'
            ]
        }
    });
    // ✅ Lắng nghe sự kiện Play/Pause để cập nhật icon
    player.on('play', updatePlayPauseIcon);
    player.on('pause', updatePlayPauseIcon);

    lessons = Array.from(document.querySelectorAll('.right-quiz .item'));

    if (lessons.length > 0) {
        handleLessonClick(lessons[0]);
    }
    // Thêm sự kiện cho nút prev và next
    document.querySelector('.nav-prev').addEventListener('click', function () {
        navigateLesson(-1);
    });
    document.querySelector('.nav-next').addEventListener('click', function () {
        navigateLesson(1);
    });
});

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
                fileLink.innerHTML = `<a href="${file.path}" download>📂 ${file.path}</a>`;
                fileLink.addEventListener("click", function (event) {
                    event.preventDefault();
                    autoDownload(file.path);
                });
                articleFilesContainer.appendChild(fileLink);
            });

            if (articleResource) {
                articleResource.href = articleFiles[0].path;  // Đảm bảo key đúng là "path"
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
                fileLink.innerHTML = `<a href="${file.path}" download class="file-download">${file.path}</a>`;
                fileLink.addEventListener("click", function (event) {
                    event.preventDefault();
                    autoDownload(file.path);
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
    debugger
    $.ajax({
        url: "/Course/GetQuizResults",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            QuizId: quizId,  // Quiz cha
            UserId: 1
        }),
        success: function (response) {
            debugger
            if (response.status && response.completed) {
                showQuizResult(response);
            } else {
                // 🛑 Nếu đã làm rồi, lấy index câu tiếp theo
                if (response.nextQuestionIndex !== null) {
                    currentQuestionIndex = response.nextQuestionIndex;
                } else {
                    currentQuestionIndex = 0;
                }
                userResults = response.correctAnswers;
                renderQuizQuestion();
            }
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
    checkButton.style.display = "block"; // Hiển thị nút kiểm tra

    console.log("📌 Kiểm tra currentQuestionIndex trước render:", currentQuestionIndex);

    // 🛑 Nếu tất cả câu hỏi đã được làm, hiển thị kết quả
    if (currentQuestionIndex >= quizData.length) {
        showQuizResult();
        return;
    }

    let question = quizData[currentQuestionIndex];

    // ✅ Kiểm tra xem câu hỏi này đã được làm chưa
    let answeredQuestion = userResults.find(r => r.questionId === question.questionId);

    // 🔥 Nếu câu này đã làm, bỏ qua và chuyển sang câu tiếp theo
    while (answeredQuestion && currentQuestionIndex < quizData.length) {
        console.log(`⏭ Bỏ qua câu hỏi ${question.questionId} vì đã làm trước đó`);
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            question = quizData[currentQuestionIndex];
            answeredQuestion = userResults.find(r => r.questionId === question.questionId);
        } else {
            showQuizResult();
            return;
        }
    }

    console.log(`📝 Hiển thị câu hỏi ${question.questionId}`);

    quizTotal.innerHTML = `Câu hỏi ${currentQuestionIndex + 1}/${quizData.length}`;
    quizIndex.innerHTML = `Câu hỏi ${currentQuestionIndex + 1}`;
    quizQuestion.innerHTML = question.description;
    quizAnswers.innerHTML = "";

    question.answers.forEach((answer) => {
        let answerHTML = `
            <div class="item item3">
                <div class="box-radio">
                    <input type="radio" id="radio-${answer.answerId}" name="quiz-answer" class="radio" value="${answer.answerId}" onclick="enableCheckButton()" />
                    <label for="radio-${answer.answerId}"></label>
                </div>
                <div class="txt">${answer.description}</div>
            </div>
        `;
        quizAnswers.innerHTML += answerHTML;
    });

    checkButton.disabled = true; // 🛑 Mặc định disable nút kiểm tra
    checkButton.innerText = "Kiểm tra đáp án"; // Reset nội dung nút
    checkButton.style.opacity = "0.6"; // Làm mờ nút
    checkButton.onclick = checkAnswer; // Đặt lại sự kiện
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
                if (currentQuestionIndex + 1 < quizData.length) {
                    checkButton.innerText = "Tiếp tục để sang câu hỏi tiếp theo";
                    checkButton.style.opacity = "1"; // hiện nút
                    checkButton.disabled = false; // Bật lại nút để có thể nhấn tiếp tục
                    checkButton.onclick = nextQuestion;
                } else {
                    checkButton.innerText = "Xem kết quả";
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

    // 🛑 Thêm delay để đảm bảo dữ liệu được cập nhật sau khi chuyển bài
    setTimeout(() => {
        document.getElementById('quiz-result-panel').style.display = 'block';

        let checkButton = document.querySelector(".btn-check-answer");

        if (response) {
            document.getElementById('quiz-result-title').innerText = response.completed
                ? "Tuyệt vời! Bạn đã sẵn sàng chuyển sang bài giảng tiếp theo"
                : "Xem lại tài liệu khóa học để mở rộng kiến thức học tập của bạn.";
            document.getElementById('quiz-result-score').innerText = `Bạn đã trả lời đúng ${response.correctCount}/${quizData.length} câu hỏi`;

            document.getElementById('quiz-correct-answers').innerHTML = response.correctAnswers.map(q => `<p>${q.description}</p>`).join('');

            if (response.incorrectAnswers.length > 0) {
                document.getElementById('quiz-incorrect-section').style.display = 'block';
                document.getElementById('quiz-incorrect-answers').innerHTML = response.incorrectAnswers.map(q => `<p>${q.description}</p>`).join('');
            } else {
                document.getElementById('quiz-incorrect-section').style.display = 'none';
            }
        } else {
            alert("Không có dữ liệu kết quả! Hãy thử làm lại bài quiz.");
        }

        checkButton.innerText = "Tiếp tục";
    }, 200); // 🔥 Tránh lỗi chập chờn bằng cách delay 200ms
}


function nextQuestion() {
    debugger;

    let question = quizData[currentQuestionIndex];

    // 🛑 Kiểm tra nếu câu này chưa có trong skippedQuestions thì mới thêm vào
    if (!skippedQuestions.some(q => q.questionId === question.questionId)) {
        skippedQuestions.push(question);
    }

    currentQuestionIndex++;

    if (currentQuestionIndex >= quizData.length) {
        showSkippedResult();
    } else {
        let errorMessage = document.querySelector(".noti.error");
        let successMessage = document.querySelector(".noti.success");
        errorMessage.style.display = "none";
        successMessage.style.display = "none";
        renderQuizQuestion();
    }
}
function showSkippedResult() {
    debugger;
    document.getElementById('quiz-panel').style.display = 'none';
    document.getElementById('quiz-result-panel').style.display = 'block';

    document.getElementById('quiz-result-title').innerText = "Hoàn thành trắc nghiệm để xem kết quả của bạn.";
    document.getElementById('quiz-result-score').innerText = `Bạn đã trả lời đúng 0/${quizData.length} câu hỏi. Bạn đã bỏ qua ${skippedQuestions.length}.`;

    // 🛑 Ẩn tất cả các phần khác
    document.getElementById('quiz-correct-answers').style.display = 'none';
    document.getElementById('quiz-incorrect-section').style.display = 'none';
    document.getElementById('quiz-correct-section').style.display = 'none';

    let skippedContainer = document.getElementById('quiz-skipped-answers');

    // 🚀 **Xóa nội dung cũ trước khi render mới**
    skippedContainer.innerHTML = "";

    // 🛑 Hiển thị chỉ phần câu hỏi bị bỏ qua
    if (skippedQuestions.length > 0) {
        let skippedHTML = skippedQuestions.map(q => `<p>${q.description}</p>`).join('');
        skippedContainer.innerHTML = skippedHTML;
        document.getElementById('quiz-skipped-section').style.display = 'block';
    } else {
        document.getElementById('quiz-skipped-section').style.display = 'none';
    }
}

function resetQuiz() {
    debugger;
    console.log("🔄 Reset quiz...");

    $.ajax({
        url: "/Course/ResetQuiz",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            QuizId: quizId,  // Quiz cha
            UserId: 1
        }),
        success: function (response) {
            debugger
            if (response) {
                console.log("✅ Quiz đã reset thành công!");

                // 🛑 Reset dữ liệu trên giao diện
                userResults = [];
                correctAnswersCount = 0;
                currentQuestionIndex = 0;
                skippedQuestions = [];  // 🔥 Xóa danh sách câu bị bỏ qua
                selectedAnswers = {};   // 🔥 Xóa danh sách câu trả lời đã chọn

                // 🛑 Ẩn màn hình kết quả & hiển thị lại màn hình quiz
                document.getElementById('quiz-result-panel').style.display = 'none';
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
 * 🟡 Phát video khi chọn bài học
 */
function playLesson(videoUrl) {
    debugger
    if (!videoUrl) return;

    if (player) {
        player.pause(); // Dừng video cũ nếu đang phát
        player.src({ src: videoUrl, type: 'video/mp4' });
        player.load();
        player.play();
        document.querySelector('.video-container').scrollIntoView({ behavior: 'smooth' });
        // 🔹 Cập nhật icon Play/Pause
        updatePlayPauseIcon();
    }
}
/**
 * ✅ Cập nhật icon Play/Pause
 */
function updatePlayPauseIcon() {
    let playButton = document.querySelector('.vjs-play-control');
    if (player.paused()) {
        playButton.classList.add('paused');
    } else {
        playButton.classList.remove('paused');
    }
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
