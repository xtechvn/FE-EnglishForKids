$(document).ready(function() {
    _newdetail.Initialization()

})
let category_id = 10;
var _newdetail = {
    Initialization: function () {
        _newdetail.getNewsMostViewedArticle(1, 10, 1);
        //_newdetail.NewsCategory();
        var categoryIdSession = sessionStorage.getItem('NewsCategoryId');
        var id = parseFloat(categoryIdSession);
        $('.cat-tag').removeClass('active');
        $('.tag_' + id).addClass('active');
    

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
    NewsCategory: function () {
        var requestObj = {

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
                $("#body-data-new").html(data);

            },

        });
    },
    getNewsByTag: function (id, url) {
        sessionStorage.setItem('NewsCategoryId', Number(id));
        window.location.href = "/" + url;
    },
}