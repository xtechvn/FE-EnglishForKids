$(document).ready(function () {
    home_product.Initialization()
})
var home_product = {
    Initialization: function () {
        if ($('.list-product-sale .swiper-wrapper').length > 0) {
            //--Product Sale Slide:
            global_service.LoadHomeProductGrid($('.list-product-sale .swiper-wrapper'), GLOBAL_CONSTANTS.GroupProduct.FlashSale, GLOBAL_CONSTANTS.Size)
            const swiperFlashsale = new Swiper('.section-flashsale .product-slide', {
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
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
            //-- Discount Grid:
            global_service.LoadHomeProductGrid($('#product-discount .list-product'), GLOBAL_CONSTANTS.GroupProduct.Discount, GLOBAL_CONSTANTS.GridSize)
            //-- Bear Grid:
            global_service.LoadHomeProductGrid($('#bear-collection .list-product'), GLOBAL_CONSTANTS.GroupProduct.BEAR_COLLECTION, GLOBAL_CONSTANTS.GridSize)
            //-- Intelligence Grid:
            global_service.LoadHomeProductGrid($('#intelligence-collection .list-product'), GLOBAL_CONSTANTS.GroupProduct.INTELLECTUAL_DEVELOPMENT, GLOBAL_CONSTANTS.GridSize)
        }
        $('.xemthem').hide()
    },
    ProductSaleList: function () {
    },
    //LoadHomeProductSlide: function (element, group_id, size) {
    //    element.addClass('placeholder')
    //    element.addClass('box-placeholder')
    //    element.css('width','100%')
    //    element.css('height','255px')
    //    var request = {
    //        "group_id": group_id,
    //        "page_index": 1,
    //        "page_size": size
    //    }
    //    $.when(
    //        global_service.POST(API_URL.ProductList, request)
    //    ).done(function (result) {
          
    //        var html = ''
    //        if (result.is_success) {

    //            $(result.data).each(function (index, item) {
    //                var img_src = item.avatar
    //                if (!img_src.includes(API_URL.StaticDomain)
    //                    && !img_src.includes("data:image")
    //                    && !img_src.includes("http"))
    //                    img_src = API_URL.StaticDomain + item.avatar
    //                html += HTML_CONSTANTS.Home.SlideProductItem
    //                    .replaceAll('{url}', '/san-pham/' + global_service.RemoveUnicode(item.name).replaceAll(' ', '-') + '--' + item._id)
    //                    .replaceAll('{avt}', img_src)
    //                    .replaceAll('{name}', item.name)
    //                    .replaceAll('{amount}', item.amount > 0 ? global_service.Comma(item.amount) + ' đ' : 'Giá liên hệ')
    //                    //.replaceAll('{review_point}', (item.rating == null || item.rating == undefined || item.rating <= 0) ? '5' : item.rating)
    //                    .replaceAll('{review_point}', '5')
    //                    .replaceAll('{review_count}', '')
    //                    .replaceAll('{old_price_style}', '')
    //                    .replaceAll('{price}', (item.amount == null || item.amount == undefined || item.amount <= 0) ? global_service.Comma(item.amount) + ' đ' : '')
    //            });
    //        }
    //        element.html(html)
    //        element.removeClass('placeholder')
    //        element.removeClass('box-placeholder')
    //        element.css('height', 'auto')
    //    })
    //},

}