$(document).ready(function () {
    _new.Initialization();
    _home_product.Initialization();
    $("#text_input").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            _new.GetFindArticleByTitle();
        }
    });   
})
let category_id = 22;
let category_id_menu = 22;
var _new = {
    Initialization: function () {
        var categoryIdSession = sessionStorage.getItem('NewsCategoryId');
        if (categoryIdSession) {
            _new.getNewsByTag(1, 10, categoryIdSession);
            /*_new.getNewsPinned1(1, 1, categoryIdSession);*/

        } else {
            _new.getNewsByTag(1, 10, category_id_menu);
            /*_new.getNewsPinned1(1, 1, 10);*/

        }

        _new.NewsCategory(category_id_menu);
        _new.getNewsMostViewedArticle(1, 3, category_id_menu);
        
    },
 
 
    NewsCategory: function (category_id) {
        var requestObj = {
            category_id: category_id,
        };
        $.ajax({
            url: "/News/NewsCategory",
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {
                $("#news-category").html(data);
            },
           
        });
    },
    getNewsPinned1: function (page, size, category_id) {
        $('#article-1').show();
        var requestObj = {
            skip: page,
            take: size,
            category_id: category_id,
            Pinned: 1
        };
        $.ajax({
            url: "/News/NewsPinned",           
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {
               
                $("#article").html(data);
                
            },
           
        });
    },
    getNewsByTag: function (page, size, category_id, page_url) {
        $('#article-1').show();
        $('#article-2').show();
        $('#article-3').show();
        _new.getNewsPinned1(page == 1 ? 0 : page, size, category_id);
        category_id = category_id;
  
        var requestObj = {
            skip: page,
            take: size,
            category_id: category_id
        };
        sessionStorage.setItem('NewsCategoryId', Number(category_id));
        var id = parseFloat(category_id);
        $.ajax({
            url: "/News/NewsByTag",           
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {
               
                $("#section-article-paginate").html(data);
                $('.list-news-top').show();
                $('.cat-tag').removeClass('active');
                $('.tag_' + id).addClass('active');
                $(".paging_" + page).addClass("active")
                if (page_url != null && page_url!="")
                window.history.pushState('string', '', page_url)
                $(window).scrollTop(0);
            },
           
        });
    },

    getNewsMostViewedArticle: function (page, size, category_id) {
        var requestObj = {
            skip: page,
            take: size,
            category_id: category_id
        };
        $.ajax({
            url: "/News/NewsMostViewedArticle",
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {

                $("#Most_Viewed_Article").html(data);
            },

        });
    },
    getNewsBySale: function (page, size, category_id) {
        var requestObj = {
            skip: page,
            take: size,
            category_id: category_id
        };
        $.ajax({
            url: "/News/NewsMostViewedArticle",
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {
                $("#list_new_Sale").html(data);
            },

        });
    },
    paging: function (page) {
        var categoryIdSession = sessionStorage.getItem('NewsCategoryId');
        _new.getNewsByTag(page, 10, parseFloat(categoryIdSession))
        _new.getNewsPinned1(page, 10, parseFloat(categoryIdSession));
    },
    prev: function (min) {
        var page = $('.pagination .active').attr('data-page');
        if (page != min) {
            page = parseFloat(page) - 1;
            var categoryIdSession = sessionStorage.getItem('NewsCategoryId');
            _new.getNewsByTag(page, 10, parseFloat(categoryIdSession))
            _new.getNewsPinned1(page, 10, parseFloat(categoryIdSession));
        }
       
    },
    next: function (max) {
        var page = $('.pagination .active').attr('data-page');
        if (page != max) {
            page = parseFloat(page) + 1;
            var categoryIdSession = sessionStorage.getItem('NewsCategoryId');
            _new.getNewsByTag(page, 10, parseFloat(categoryIdSession))
            _new.getNewsPinned1(page, 10, parseFloat(categoryIdSession));
        }
       
    },
    GetFindArticleByTitle: function () {
        $('#article-1').hide();
        $('#article-2').hide();
        $('#article-3').hide();
        $('.list-news-top').hide();
        $('#section-article-paginate').hide();
        var requestObj = {
            title: $('#text_input').val(),
            parent_cate_faq_id: category_id
        };
        $.ajax({
            url: "/News/GetFindArticleByTitle",
            type: 'post',
            data: { requestObj: requestObj },
            success: function (data) {
                $('#section-article-paginate').show();
                $("#section-article-paginate").html(data);
               
            },

        });
    },
}
var _home_product = {
    Initialization: function () {
        //--Product Sale Slide:
        _home_product.LoadHomeProductSlide($('.list-product-sale .swiper_wrapper'), GLOBAL_CONSTANTS.GroupProduct.FlashSale, GLOBAL_CONSTANTS.Size)
  
    },
    ProductSaleList: function () {
    },
    LoadHomeProductSlide: function (element, group_id, size) {
        var request = {
            "group_id": group_id,
            "page_index": 1,
            "page_size": size
        }
        $.when(
            global_service.POST(API_URL.ProductList, request)
        ).done(function (result) {
            element.addClass('placeholder')
            element.addClass('box-placeholder')
            var html = ''
            if (result.is_success) {

                $(result.data).each(function (index, item) {
                    html += HTML_CONSTANTS.Home.SlideProductItem
                        .replaceAll('{url}', '/product/detail/' + item.product_code)
                        .replaceAll('{avt}', item.image_thumb)
                        .replaceAll('{name}', item.product_name)
                        .replaceAll('{amount}', item.amount_vnd > 0 ? global_service.Comma(item.amount_vnd) + ' đ' : 'Giá liên hệ')
                        .replaceAll('{review_point}', (item.rating == null || item.rating == undefined || item.rating <= 0) ? '5' : item.rating)
                        .replaceAll('{review_count}', (item.reviews_count == null || item.reviews_count == undefined || item.reviews_count <= 0) ? '(1)' : '(' + item.reviews_count + ')')
                        .replaceAll('{old_price_style}', (item.price_vnd == null || item.price_vnd == undefined || item.price_vnd <= 0) ? '' : '')
                        .replaceAll('{price}', (item.price_vnd == null || item.price_vnd == undefined || item.price_vnd <= 0) ? global_service.Comma(item.amount_vnd) + ' đ' : '')
                });
            }
            element.html(html)
            element.removeClass('placeholder')
            element.removeClass('box-placeholder')

        })
    },
   

}