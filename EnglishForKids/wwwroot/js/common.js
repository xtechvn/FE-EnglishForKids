const swiperBanner = new Swiper('.swiper-banner', {
    loop: true,
    pagination: {
        el: '.swiper-banner .swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-banner .swiper-button-next',
        prevEl: '.swiper-banner .swiper-button-prev',
    },

});
const swiperADS = new Swiper('.banner-cat', {
    loop: false,
    pagination: false,
    navigation: false,
    slidesPerView: 1.5,
    spaceBetween: 15,
    breakpoints: {
        540: {
            slidesPerView: 1.5,
        },
        768: {
            slidesPerView: 2.5,
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 24,
        }
    },

});

const swiperAds = new Swiper('.swiper-banner-ads', {
    loop: false,
    pagination: false,
    navigation: false,
    slidesPerView: 1,
    spaceBetween: 8,
    breakpoints: {
        540: {
            slidesPerView: 1,
        },
        992: {
            slidesPerView: 2,
        }
    }
});

const swiperClient = new Swiper('.swiper-client', {
    loop: false,
    pagination: false,
    navigation: false,
    slidesPerView: 3,
    spaceBetween: 8,
    breakpoints: {
        540: {
            slidesPerView: 3,
        },
        768: {
            slidesPerView: 4.5,
        },
        992: {
            slidesPerView: 6.5,
        }
    }
});
const swiperFlash = new Swiper('.section-flashsale .product-slide', {
    loop: false,
    pagination: false,
    navigation: false,
    spaceBetween: 15,
    slidesPerView: 1.5,
    breakpoints: {
        540: {
            slidesPerView: 2.5,
        },
        768: {
            slidesPerView: 3.5,
        },
        1024: {
            slidesPerView: 4.5,
        },
        1400: {
            slidesPerView: 5,
        }
    },
    navigation: {
        nextEl: '.section-flashsale .swiper-button-next',
        prevEl: '.section-flashsale .swiper-button-prev',
    },
});
$(function () {
    $('.btn-filter').on('click', function () {
        $('#productList').addClass('show-filter');
    });
    $('#closeFilter').on('click', function () {
        $('#productList').removeClass('show-filter');
    });
    $('.list-tab-menu .sub-menu').on('click', function () {
        $(this).toggleClass('active');
    });
    // stiky menu
    var stickyElements = $('.sticky');
    if (stickyElements.length > 0) {
        Stickyfill.add(stickyElements);
    }
    $("<div id='menu_before'></div>").insertBefore(".header");
    $(window).scroll(function () {
        var top_start = $("#menu_before").position().top + 0;
        if ($(window).scrollTop() > top_start) {
            $('.header').addClass('pin');
        } else if ($(window).scrollTop() <= top_start) {

            $('.header').removeClass('pin');
        }
    });
});

// gallery
var swiperSmallThumb = new Swiper(".thumb-small", {
    spaceBetween: 15,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
    navigation: {
        nextEl: '.thumb-small .swiper-button-next',
        prevEl: '.thumb-small .swiper-button-prev',
    },
});
var swiperBigThumb = new Swiper(".thumb-big", {
    spaceBetween: 15,
    navigation: false,
    thumbs: {
        swiper: swiperSmallThumb,
    },
});

$(function () {
    $("#datepicker").datepicker();

});
function scrollTop() {
    if ($(window).scrollTop() > 500) {
        $(".backToTopBtn").addClass("active");
    } else {
        $(".backToTopBtn").removeClass("active");
    }
}
$(function () {
    scrollTop();
    $(window).on("scroll", scrollTop);

    $(".backToTopBtn").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1);
        return false;
    });
});

// hỗ trợ
$(document).ready(function () {
    console.log("common.js đã tải...");

    // 🛠 Gán sự kiện Pop-up ngay khi trang load
    $(document).on("click", ".open-popup-link", function (e) {
        e.preventDefault();
        var targetPopup = $(this).attr("href") || $(this).data("id");
        //console.log("Mở Pop-up:", targetPopup);

        if ($(targetPopup).length === 0) {
            console.error("Không tìm thấy phần tử Pop-up:", targetPopup);
            return;
        }

        $.magnificPopup.open({
            items: { src: targetPopup },
            type: 'inline',
            midClick: true,
            mainClass: 'mfp-with-zoom',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            removalDelay: 300
        });
    });

    // 🛠 Xử lý sự kiện đăng nhập mở Pop-up
    $(document).on("click", ".client-login", function (e) {
        e.preventDefault();
        var targetPopup = $(this).attr("data-id");
        console.log("Mở Pop-up:", targetPopup);

        $.magnificPopup.open({
            items: { src: targetPopup },
            type: 'inline'
        });
    });

    // 🛠 Gọi lại sự kiện Pop-up sau khi header AJAX load xong
    $(document).ajaxComplete(function (event, xhr, settings) {
        if (settings.url.includes("/home/loadHeaderComponent")) {
            //console.log("Header đã load xong từ AJAX.");
            header.reinitializePopup();
            header.RenderHeaderLogin();
        }
    });
});


