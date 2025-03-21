$(document).ready(function () {

    var category_id = parseInt($(".category_id").data("categoryid"));

    const query_string = window.location.search;
    // Khởi tạo URLSearchParams để xử lý query string
    const url_params = new URLSearchParams(query_string);
    // Lấy giá trị của tham số 'page'
    const page = url_params.get('page') == null ? 1 : url_params.get('page');
    // Load tin trên trang chủ NEWS
    news.bin_news_home(category_id, page );

    //if (category_id <= 0) {         
    //    // Bin theo tin mới nhất của các chuyên mục
    //    news.bin_news_top(category_id, "top_story", page);
    //    news.bin_news_left(category_id, "top_left", page);
    //} else {
    //    news.bin_news_top(category_id, "category_top", page);
    //    news.bin_news_left(category_id, "category_left", page);
    //}    
})

var news = {
    bin_news_home: function (category_id, page) {
        
        $.ajax({
            
            dataType: 'html',
            type: 'POST',
            url: '/courses/home/get-course-list.json',
            data: { category_id: -1, page: page, view_name: "~/Views/Shared/Components/Courses/Home.cshtml" },
            success: function (data) {
                $('.list-news-home').html(data);
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error); // Thay đổi từ 'failure' sang 'error'
            }
        });

    },   


    //bin_news_top: function (category_id, position_name, page) {
        
    //    $.ajax({
    //        dataType: 'html',
    //        type: 'POST',
    //        url: 'article/get-list.json',
    //        data: { category_id: category_id, position_name: position_name, page: page },
    //        success: function (data) {
    //            $('.list-news-top').html(data);
    //        },
    //        error: function (xhr, status, error) {
    //            console.log("Error: " + error); // Thay đổi từ 'failure' sang 'error'
    //        }
    //    });

    //},   
    //bin_news_left: function (category_id, position_name, page) {
          
    //    $.ajax({
    //        dataType: 'html',
    //        type: 'POST',
    //        url: 'article/get-list.json',
    //        data: { category_id: category_id, position_name: position_name, page: page },
    //        success: function (data) {
                
    //            $('.list-news-top-left').html(data);
    //        },
    //        error: function (xhr, status, error) {
    //            console.log("Error: " + error); // Thay đổi từ 'failure' sang 'error'
    //        }
    //    });

    //}
}

$(document).on('click', '.course-link', function (e) {
    debugger
    e.preventDefault();
    let userId = global_service.GetAccountClientId();

    var isFree = $(this).data('is-free');
    var link = $(this).data('link');
    var courseId = $(this).data('id');

    if (isFree === true || isFree === 'true') {
        var usr = global_service.CheckLogin();

        if (!usr) {
            $('.mainheader .client-login').click();

            sessionStorage.setItem('RedirectAfterLoginCourseFree', JSON.stringify({
                courseId: courseId,
                link: link
            }));

            return false;
        }
    }

    window.location.href = link;
    return false;
});

// Xử lý click nút "Thêm vào giỏ hàng"
$("body").on("click", ".add-to-cart", function () {
    var user = global_service.CheckLogin();

    if (!user) {
        // Chưa login => Hiện popup đăng nhập
        $('.mainheader .client-login').click();
        return false;
    }

    // Đã login => Thêm vào giỏ hàng
    handleAddToCart();
});

// Xử lý click nút "Mua ngay"
$("body").on("click", ".buy-now", function () {
    var user = global_service.CheckLogin();

    if (!user) {
        // Chưa login => Hiện popup đăng nhập
        $('.mainheader .client-login').click();
        return false;
    }

    // Đã login => Mua ngay
    handleBuyNow();
});

