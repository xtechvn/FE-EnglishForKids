
var player;
var audioPlayer;
var currentLessonIndex = 0;
var lessons = [];
var debounceTimeout = null;
let currentQuestionIndex = 0;
let selectedAnswers = {};
let quizData = [];
let correctAnswersCount = 0;
let userResults = [];
let skippedQuestions = [];
let currentLessonId = null;
let currentQuizId = null;





document.addEventListener('DOMContentLoaded', function () {


    // Khởi tạo Plyr cho Video
    player = new Plyr('#lesson-video', {
        controls: ['play-large', 'restart', 'rewind', 'play', 'fast-forward',
            'progress', 'current-time', 'duration', 'mute', 'volume',
            'settings', 'fullscreen'],
        settings: ['captions', 'quality', 'speed'],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        ratio: '16:9'
    });



    // Khởi tạo Plyr với nhiều chức năng hơn
    audioPlayer = new Plyr('#lesson-audio', {
        controls: [
            'play',            // Nút Play/Pause
            'progress',        // Thanh tiến trình
            'current-time',    // Thời gian hiện tại
            'duration',        // Tổng thời gian
            'mute',            // Tắt tiếng
            'volume',          // Điều chỉnh âm lượng
            'speed',           // Tùy chỉnh tốc độ phát
            'loop'        // Lặp lại audio

        ],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] }, // Tùy chọn tốc độ phát
        loop: { active: false }, // Mặc định không lặp lại
        keyboard: { focused: true, global: true }, // Dùng phím tắt
        hideControls: false, // Không ẩn điều khiển khi không tương tác
    });

    // Chèn icon giữa thanh tiến trình
    const progressBar = document.querySelector('.plyr__progress');
    const audioIconOverlay = document.createElement('div');
    audioIconOverlay.classList.add('audio-icon-overlay');
    audioIconOverlay.innerHTML = '🎵'; // Thay icon tại đây nếu muốn
    progressBar.appendChild(audioIconOverlay);

    const videoContainer = document.querySelector('.video-container');
    const audioContainer = document.querySelector('.audio-container');

    videoContainer.style.height = "598px";

    // Lưu trạng thái thời gian phát video
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

    let savedLessonId = localStorage.getItem('currentLessonId');
    let savedQuizId = localStorage.getItem('currentQuizId');

    if (lessons.length > 0) {
        let savedLesson = lessons.find(lesson => lesson.getAttribute("data-lesson-id") === savedLessonId);
        let savedQuiz = lessons.find(lesson => lesson.getAttribute("data-quiz-id") === savedQuizId);

        if (savedQuiz) {
            handleLessonClick(savedQuiz);
        } else if (savedLesson) {
            handleLessonClick(savedLesson);
        } else {
            handleLessonClick(lessons[0]);
        }
    }

    document.querySelector('.nav-prev').addEventListener('click', () => navigateLesson(-1));
    document.querySelector('.nav-next').addEventListener('click', () => navigateLesson(1));
});

/**
 * 🟡 Phát video hoặc audio khi chọn bài học
 */
function playLesson(url, type) {
    if (!url) return;

    if (type === 'mp4') {
        document.querySelector('.video-container').style.display = 'block';
        document.querySelector('.audio-container').style.display = 'none';
        player.source = { type: 'video', sources: [{ src: url, type: 'video/mp4' }] };

    }
    else if (type === 'mp3') {
        document.querySelector('.video-container').style.display = 'none';
        document.querySelector('.audio-container').style.display = 'block';
        audioPlayer.source = { type: 'audio', sources: [{ src: url, type: 'audio/mpeg' }] };

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

    // 🛑 Nếu không còn bài học nào tiếp theo, hiển thị panel hoàn thành nhưng KHÔNG chặn việc chọn bài giảng khác
    if (newIndex >= lessons.length) {
        console.log("🎉 Đã hoàn thành tất cả bài học! Hiển thị panel hoàn thành.");

        // Ẩn tất cả các panel bài giảng
        document.getElementById('video-panel').style.display = 'none';
        document.getElementById('audio-panel').style.display = 'none';
        document.getElementById('article-panel').style.display = 'none';
        document.getElementById('quiz-panel').style.display = 'none';
        document.getElementById('quiz-result-panel').style.display = 'none';

        // Hiển thị panel hoàn thành (không thay đổi .left-quiz để không chặn chọn bài khác)
        let completionPanel = document.getElementById('completion-panel');
        if (!completionPanel) {
            let panel = document.createElement("div");
            panel.id = "completion-panel";
            panel.innerHTML = `
                          <div class="completion-panel">
                    <h2>🎉 Bạn đã hoàn thành khóa học!</h2>
                    <p>Cảm ơn bạn đã tham gia. Bạn giỏi lắm!</p>
                    
                 <a href="/khoa-hoc" class="btn-find-more">🔍 Tìm thêm khóa học</a>

                </div>
            `;
            document.querySelector('.left-quiz').appendChild(panel);
        } else {
            completionPanel.style.display = 'block';
        }

        return;
    }

    // Nếu còn bài học tiếp theo, cập nhật chỉ mục và hiển thị bài học mới
    if (newIndex >= 0 && newIndex < lessons.length) {
        currentLessonIndex = newIndex;
        handleLessonClick(lessons[currentLessonIndex]);
    }
}

function handleLessonClick(element) {
    debugger;
    // 🛑 Nếu đang hiển thị panel hoàn thành, ẩn nó đi khi chọn lại bài giảng
    let completionPanel = document.getElementById('completion-panel');
    if (completionPanel) {
        completionPanel.style.display = 'none';
    }
    // Lấy ID của bài học mới
    let lessonId = element.getAttribute("data-lesson-id"); // 👈 Thêm data-lesson-id vào HTML nếu chưa có
    let type = element.getAttribute("data-type");
    let quizId2 = element.getAttribute("data-quiz-id"); // 📌 Lấy ID Quiz (nếu có)
    let lessonTitle = element.getAttribute("data-lesson-title"); // Lấy tiêu đề bài học
    let videoUrl = element.getAttribute("data-video-url") || "";
    let audioUrl = element.getAttribute("data-audio-url") || "";
    let articleContent = element.getAttribute("data-article-content");
    let articleFiles = JSON.parse(element.getAttribute("data-article-files") || "[]");
    $('.btn-skip').show();
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





    // ✅ Xác định Chapter chứa bài giảng
    let chapterElement = element.closest(".lesson"); // Tìm phần tử cha là Chapter
    if (chapterElement) {
        // ✅ Mở Chapter chứa bài giảng này
        let chapterList = chapterElement.querySelector(".list-lesson");
        if (chapterList) {
            chapterList.style.display = "block"; // Hiển thị chapter chứa bài học
        }
    }

    // Cập nhật trạng thái bài học đang được chọn (hover effect)
    lessons.forEach(lesson => lesson.classList.remove('active'));
    element.classList.add('active');

    if (type === "video") {
        document.getElementById('video-panel').style.display = 'block';
        playLesson(videoUrl, 'mp4');
    }
    else if (type === "audio") {
        document.getElementById('audio-panel').style.display = 'block';
        playLesson(audioUrl, 'mp3');
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
        $('#quiz-panel').show();
        $('#quiz-result-panel').hide();
        quizData = JSON.parse(element.getAttribute("data-quiz-data") || "[]");
        courseId = element.getAttribute("data-course-id");
        quizId = element.getAttribute("data-quiz-id");

        currentQuestionIndex = 0;
        correctAnswersCount = 0;
        selectedAnswers = {};

        // 🛑 Reset UI để tránh hiển thị dữ liệu cũ
        $('#quiz-question, #quiz-answers, #quizIndex, #quizTotal').empty();
        $(".noti.error, .noti.success").hide();

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
        data: JSON.stringify({ QuizId: quizId, UserId: 1 }),
        success: function (response) {
            debugger;

            if (response.completed) {
                showQuizResult(response);
                return;
            }

            if (response.allQuestions?.length > 0) {
                quizData = response.allQuestions; // Giữ nguyên thứ tự từ API
            }

            // Tìm câu đầu tiên chưa làm hoặc sai
            let firstUnansweredIndex = -1;
            for (let i = 0; i < quizData.length; i++) {
                if (!response.correctAnswers.some(r => r.questionId === quizData[i].questionId) ||
                    response.incorrectAnswers.some(r => r.questionId === quizData[i].questionId)) {
                    firstUnansweredIndex = i;
                    break;
                }
            }

            currentQuestionIndex = firstUnansweredIndex !== -1 ? firstUnansweredIndex : (response.nextQuestionIndex ?? 0);
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

    $(".noti.error, .noti.success").hide();
    checkButton.style.display = "block";

    // console.log("📌 Kiểm tra currentQuestionIndex trước render:", currentQuestionIndex);

    if (!quizData || quizData.length === 0 || currentQuestionIndex >= quizData.length) {
        console.log("🚨 Không có câu hỏi nào để hiển thị. Hiển thị kết quả quiz.");
        showQuizResult();
        return;
    }


    let question = quizData[currentQuestionIndex];

    //  console.log(`📝 Hiển thị câu hỏi ${question.questionId}`);

    // ✅ Hiển thị số thứ tự đúng
    quizTotal.innerHTML = `Câu hỏi ${currentQuestionIndex + 1}/${quizData.length}`;
    quizIndex.innerHTML = `Câu hỏi ${currentQuestionIndex + 1}`;
    quizQuestion.innerHTML = question.description;
    // Xóa nhanh phần tử cũ thay vì `innerHTML = ""`
    while (quizAnswers.firstChild) {
        quizAnswers.removeChild(quizAnswers.firstChild);
    }

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

    // console.log(question);
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
                successMessage.querySelector("p").innerText = question.answers.find(a => a.answerId === selectedAnswerId)?.note || "Câu trả lời chưa chính xác!";
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
function showQuizResult(response) {
    $('#quiz-panel').hide();
    $('#quiz-result-panel').show();
    $('#quiz-result-title').text(response.completed
        ? "Tuyệt vời! Bạn đã hoàn thành bài quiz."
        : "Hãy xem lại tài liệu nhé.");

    $('#quiz-result-score').text(`Bạn đã trả lời đúng ${response.correctCount}/${quizData.length} câu hỏi.`);
    $('#quiz-correct-answers').html(response.correctAnswers.map(q => `<p>✅ ${q.description}</p>`).join(''));
    $('#quiz-incorrect-answers').html(response.incorrectAnswers.map(q => `<p>❌ ${q.description}</p>`).join(''));
    $('#quiz-skipped-answers').html(response.skippedQuestions.map(q => `<p>⚠️ ${q.description}</p>`).join(''));

    $('#quiz-correct-section').toggle(response.correctAnswers.length > 0);
    $('#quiz-incorrect-section').toggle(response.incorrectAnswers.length > 0);
    $('#quiz-skipped-section').toggle(response.skippedQuestions.length > 0);
}

function nextQuestion() {
    debugger;

    // 🔥 Xác định danh sách câu hỏi chưa làm (bỏ qua)
    let skippedQuestions = quizData.filter(q => !q.isAnswered);

    // 🔥 Xác định danh sách câu hỏi đã làm nhưng sai
    let incorrectQuestions = quizData.filter(q => q.isAnswered && q.selectedAnswer !== q.answers.find(a => a.isCorrect)?.answerId);

    // 🔥 Tổng số câu hỏi chưa hoàn thành đúng
    let totalRemaining = skippedQuestions.length + incorrectQuestions.length;

    // ✅ Nếu còn câu chưa làm, chuyển tiếp
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        renderQuizQuestion();
        return;
    }

    // 🚨 Nếu câu cuối cùng bị bỏ qua hoặc sai, cần kiểm tra lại
    if (totalRemaining > 0) {
        console.log("🚨 Có câu hỏi chưa hoàn thành đúng, hiển thị kết quả.");
        fetchQuizResultsAndShow();
        return;
    }

    // 🚀 Nếu tất cả đã làm xong, hiển thị kết quả quiz
    console.log("✅ Tất cả câu hỏi đã làm xong, hiển thị kết quả quiz.");
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
    let fileExtension = url.split('.').pop().toLowerCase(); // Lấy phần mở rộng của file

    // Nếu là file video hoặc audio, mở trong tab mới
    if (["mp4", "mp3", "wav", "ogg"].includes(fileExtension)) {
        window.open(url, '_blank'); // Mở trong tab mới
    } else {
        // Nếu không phải video/audio, thực hiện auto download
        let a = document.createElement("a");
        a.href = url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}




/**
 * 🔴 Ẩn tất cả panel trước khi mở panel mới
 */
function closeAllPanels() {

    document.getElementById('video-panel').style.display = 'none';
    document.getElementById('audio-panel').style.display = 'none';

    document.getElementById('article-panel').style.display = 'none';
    document.getElementById('quiz-panel').style.display = 'none';
    document.getElementById('article-notice').style.display = 'none';
    document.getElementById('quiz-result-panel').style.display = 'none';

    if (player) {
        player.pause(); // Dừng video khi chuyển bài
        audioPlayer.pause();
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

    // Kiểm tra nếu chương đang ẩn thì mở nó
    var isHidden = chapterElement.style.display === "none";
    chapterElement.style.display = isHidden ? "block" : "none";

    // Nếu là chương cuối cùng và đang được mở, cuộn xuống để hiển thị
    if (isHidden) {
        var allChapters = document.querySelectorAll('.list-lesson');
        var lastChapter = allChapters[allChapters.length - 1]; // Lấy chương cuối cùng

        if (chapterElement === lastChapter) {
            setTimeout(() => {
                chapterElement.scrollIntoView({ behavior: "smooth", block: "end" });
            }, 200); // Delay 200ms để đảm bảo nội dung đã render
        }
    }
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


document.querySelectorAll(".file-download").forEach(function (fileLink) {
    fileLink.addEventListener("click", function (event) {
        event.preventDefault();
        let fileUrl = this.getAttribute("data-url");
        handleFileDownload(fileUrl);
    });
});
function handleFileDownload(url) {
    let fileExtension = url.split('.').pop().toLowerCase(); // Lấy phần mở rộng của file

    if (["mp4", "mp3", "wav", "ogg"].includes(fileExtension)) {
        // Nếu là video hoặc audio, mở tab mới
        window.open(url, '_blank');
    } else {
        // Nếu là file khác, tự động tải xuống
        let a = document.createElement("a");
        a.href = url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}