$(document).ready(function () {

    product_raiting.Initialization()
})
var product_raiting = {
    Initialization: function () {
        sessionStorage.removeItem(STORAGE_NAME.ProductCommentCount)

        product_raiting.Detail()
        product_raiting.DynamicBind()
    },
    DynamicBind: function () {
        $("body").on('click', ".overview__filter", function () {
            var element = $(this)
            $('.overview__filter').removeClass('active')
            element.addClass('active')
            product_raiting.ListingComment()
            product_raiting.Paging(1)
        });
    },
    Detail: function () {
        product_raiting.RaitingCount()

        product_raiting.ListingComment()
    },
    DetailPaging: function (page) {
        product_raiting.Paging(page)
        product_raiting.ListingComment(page)
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#container-comment").offset().top
        }, 500);
    },
    ListingComment: function (page) {
        $('.section-description-product .product-ratings__list .product-comment-list').addClass('placeholder')
        $('.section-description-product .product-ratings__list .product-comment-list').addClass('box-placeholder')
        var request = product_raiting.GetFilter(page)
        $.when(
            global_service.POST(API_URL.ProductReviewComment, request)
        ).done(function (result) {
            if (result == undefined) result=''
            $('.section-description-product .product-ratings__list .product-comment-list').html(result)

            $('.section-description-product .product-ratings__list .product-comment-list').removeClass('placeholder')
            $('.section-description-product .product-ratings__list .product-comment-list').removeClass('box-placeholder')
            $('.section-description-product .product-ratings__list .img-product').each(function (index, value) {
                var element=$(this)
                lightGallery(element[0], {
                    plugins: [lgVideo],
                    videojs: true,
                    speed: 500,
                    thumbnail: true,
                });


            });


        })
    },
    Paging: function (page) {
        var max_page = product_raiting.GetMaxPage()
        var total_count = product_raiting.GetTotalCount()
        if (page > 0 && max_page > 1 && total_count > 1) {
            var request = {
                "function_name": 'product_raiting.DetailPaging',
                "page": page,
                "max_page": max_page,
                "total_count": total_count
            }
            $.when(
                global_service.POST(API_URL.ProductRaitingPaging, request)
            ).done(function (result) {
                if (result != undefined) {
                    $('.section-description-product .wrap-paging').html(result)
                }
            })
        }
        else {
            $('.section-description-product .wrap-paging').html('')

        }

    },
    RaitingCount: function (page) {
        var request = {
            "id": $('.section-details-product').attr('data-code')
        }
        $.when(
            global_service.POST(API_URL.ProductRaitingCount, request)
        ).done(function (result) {
            if (result != undefined && result.is_success == true) {
                $.each(result.data.comment_count_by_star, function (key, value) {
                    $('#overview_filter_' + key + ' .count').html(global_service.Comma(value))

                });
                $('#overview_filter_all .count').html(global_service.Comma(result.data.total_count))
                $('#overview_filter_hascomment .count').html(global_service.Comma(result.data.has_comment_count))
                $('#overview_filter_hasmedia .count').html(global_service.Comma(result.data.has_media_count))
                sessionStorage.setItem(STORAGE_NAME.ProductCommentCount, JSON.stringify(result.data))
                product_raiting.RaitingAvarage(result)
                product_raiting.Paging(1)

            }
        })
    },
    GetMaxPage: function () {
        var max_page = 1
        var value = product_raiting.GetRaitingFilterValue()
        if (value == undefined || value == '') value = 'all'

        var page_count = sessionStorage.getItem(STORAGE_NAME.ProductCommentCount)
        if (page_count != undefined && value != undefined && value.trim() != '') {
            var page_object = JSON.parse(page_count)
            switch (value) {
                case '5': {
                    max_page = page_object.comment_count_by_star[5] / GLOBAL_CONSTANTS.RaitingPageSize
                } break
                case '4': {
                    max_page = page_object.comment_count_by_star[4] / GLOBAL_CONSTANTS.RaitingPageSize

                } break
                case '3': {
                    max_page = page_object.comment_count_by_star[3] / GLOBAL_CONSTANTS.RaitingPageSize

                } break
                case '2': {
                    max_page = page_object.comment_count_by_star[2] / GLOBAL_CONSTANTS.RaitingPageSize

                } break
                case '1': {
                    max_page = page_object.comment_count_by_star[1] / GLOBAL_CONSTANTS.RaitingPageSize

                } break
                case 'all': {
                    max_page = page_object.total_count / GLOBAL_CONSTANTS.RaitingPageSize

                } break
                case 'comment': {
                    max_page = page_object.has_comment_count / GLOBAL_CONSTANTS.RaitingPageSize

                } break
                case 'media': {
                    max_page = page_object.has_media_count / GLOBAL_CONSTANTS.RaitingPageSize

                } break
            }
        }
        if (max_page < 1) max_page = 1
        if (max_page > (parseInt(max_page))) max_page = parseInt(max_page) + 1
        return max_page
    },
    GetTotalCount: function () {

        var total_count = 0
        var value = product_raiting.GetRaitingFilterValue()

        if (value == undefined || value == '') value = 'all'
        var page_count = sessionStorage.getItem(STORAGE_NAME.ProductCommentCount)
        if (page_count != undefined && value.trim() != '') {
            var page_object = JSON.parse(page_count)
            switch (value) {
                case '5': {
                    total_count = page_object.comment_count_by_star[5]
                } break
                case '4': {
                    total_count = page_object.comment_count_by_star[4]

                } break
                case '3': {
                    total_count = page_object.comment_count_by_star[3]

                } break
                case '2': {
                    total_count = page_object.comment_count_by_star[2]

                } break
                case '1': {
                    total_count = page_object.comment_count_by_star[1]

                } break
                case 'all': {
                    total_count = page_object.total_count

                } break
                case 'comment': {
                    total_count = page_object.has_comment_count

                } break
                case 'media': {
                    total_count = page_object.has_media_count

                } break
            }
        }
        if (total_count < 0) total_count = 0

        return total_count
    },
    RaitingAvarage: function (result) {
        var total_star = 0
        var count = 0
        $.each(result.data.comment_count_by_star, function (key, value) {
            $('#overview_filter_' + key + ' .count').html(global_service.Comma(value))
            count += value
            total_star += (key * value)

        });
        var avarage = parseFloat(total_star / count)
        if (isNaN(avarage)) avarage=0
        $('.section-description-product  .overview__rating-score').html(avarage<=0?'0':avarage.toFixed(1))
        var avarage_value = parseInt(avarage)
        $('.section-description-product  .rating-stars__stars i').each(function (index, item) {
            var element = $(this)
            if (index < avarage_value) {
                element.addClass('icon-star')
                element.removeClass('half-star')
                element.removeClass('empty-star')
            }
            else if (index >= avarage_value && index < avarage) {
                element.removeClass('icon-star')
                element.addClass('half-star')
                element.removeClass('empty-star')
            }
            else {
                element.removeClass('icon-star')
                element.removeClass('half-star')
                element.addClass('empty-star')
            }

        });

        var html = ''
        for (var i = 0; i < 5; i++) {
            if (i < avarage_value) {
                html += HTML_CONSTANTS.Detail.Star
            }
            else if (i >= avarage_value && i < avarage) {
                html += HTML_CONSTANTS.Detail.Half_Star

            }
            else {
                html += HTML_CONSTANTS.Detail.Empty_Star

            }
        }
        html += '' + (avarage <= 0 ? '' : avarage.toFixed(1))
        //if (product.product_sold_count == undefined || product.product_sold_count <= 0) {
        //    $('.section-details-product .total-sold').hide()
        //} else {
        //    $('.section-details-product .total-sold').html(global_service.Comma(product.product_sold_count) + ' Đã bán')
        //}
        //if (product.reviews_count == undefined || product.reviews_count <= 0) {
        //    $('.section-details-product .total-sold').hide()
        //} else {
        //    $('.section-details-product .total-review').html(global_service.Comma(product.reviews_count) + ' Đánh giá')
        //}
        $('.info-product .box-review .review').html(html)
        $('.info-product .box-review .total-sold').html(global_service.Comma(result.data.total_sold) + ' Đã bán')
        $('.info-product .box-review .total-review').html(global_service.Comma(result.data.total_count)+' Đánh giá')
    },
    GetFilter: function (page) {
        var request = {
            "id": $('.section-details-product').attr('data-code'),
            "page_index": page,
            "page_size": GLOBAL_CONSTANTS.RaitingPageSize
        }
        var filter_value = product_raiting.GetRaitingFilterValue()
        if (filter_value != undefined) {
            switch (filter_value) {
                case '5':
                case '4':
                case '3':
                case '2':
                case '1': {
                    request.stars = filter_value
                } break
                case 'all': {


                } break
                case 'comment': {
                    request.has_comment = true

                } break
                case 'media': {
                    request.has_media = true

                } break
            }
        }
        return request
    },
    GetRaitingFilterValue: function () {
        var selected_element = undefined

        $('.overview__filters .overview__filter').each(function (index, item) {
            var element = $(this)
            if (element.hasClass('active')) {
                selected_element = element
                return false
            }
        });
        if (selected_element != undefined) return selected_element.attr('data-value')
        else return undefined
    }
}