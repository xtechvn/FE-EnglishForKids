var _wrapperImage = $("#video-content");
var _attachfile = $("#lightgallery");
$(document).ready(function () {
    
});







// Khởi tạo Magnific Popup
$('.lesson-icon').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade', // Hiệu ứng fade
    removalDelay: 300, // Thời gian chuyển động
    preloader: false, // Tắt preloader
    fixedContentPos: true, // Đảm bảo popup giữ nguyên vị trí
    iframe: {
        patterns: {
            youtube: {
                index: 'youtube.com/',
                id: 'v=',
                src: '//www.youtube.com/embed/%id%?autoplay=1'
            },
            vimeo: {
                index: 'vimeo.com/',
                id: '/',
                src: '//player.vimeo.com/video/%id%?autoplay=1'
            },
            default: {
                src: '%id%' // Đường dẫn trực tiếp (direct link)
            }
        }
    },
    callbacks: {
        open: function () {
            console.log("Popup đã mở");
        },
        close: function () {
            console.log("Popup đã đóng");
        }
    }
});

// Sự kiện click vào icon
$(document).on("click", ".lesson-icon", function (event) {
    event.preventDefault();

    const fileUrl = $(this).data("url"); // Lấy URL của file/video
    const fileExtension = fileUrl.split('.').pop().toLowerCase(); // Lấy phần mở rộng file

    if (fileExtension === "mp4") {
        // Mở video dạng MP4
        $.magnificPopup.open({
            items: {
                src: fileUrl
            },
            type: 'iframe'
        });
    } else if (fileExtension === "pdf") {
        // Mở PDF
        window.open(fileUrl, "_blank");
    } else {
        console.error("File không hỗ trợ hoặc không tồn tại!");
    }
});


