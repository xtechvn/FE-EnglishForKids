var global_search = {
    DetailPaging: function (page) {
        global_search.RenderDetail(page)
        global_search.Paging(page)
      
    },
    RenderDetail: function (page) {
        var group_id = $('.danhmuc').closest('.box-filter').find('.active').attr('data-group-id')
        if (group_id == undefined || group_id.trim() == '') group_id = ''
        var brands = $('.thuonghieu').closest('.box-filter').find('.active').attr('data-brand-id')
        if (brands == undefined || brands.trim() == '') brands = ''
        var request = {
            "keyword": $('#kw').val(),
            "token": '',
            "stars": $('.list-filter-star .list-star').attr('data-star'),
            "group_product_id": group_id,
            "brands": brands,
            "page_index": page,
            page_size:12
        }
        $.when(
            global_service.POST(API_URL.ProductSearchListingPaging, request)
        ).done(function (result) {
            if (result != undefined) {
                $('.product-category .list-product').html(result)
            }
        })
    },
    Paging: function (page) {
        var max_page = global_search.GetMaxPage()
        var total_count = global_search.GetTotalCount()
        if (page > 0 && max_page > 1 && total_count > 1) {
            var request = {
                "function_name": 'global_search.DetailPaging',
                "page": page,
                "max_page": max_page,
                "total_count": total_count
            }
            $.when(
                global_service.POST(API_URL.ProductRaitingPaging, request)
            ).done(function (result) {
                if (result != undefined) {
                    $('.product-category .wrap-paging').html(result)
                }
            })
        }
        else {
            $('.product-category .wrap-paging').html('')

        }

    },
    GetMaxPage: function () {
        var max_page = 1
        var total_count = 0
        if (isNaN(parseInt($('.wrap-paging').attr('data-count'))) || parseInt($('.wrap-paging').attr('data-count')) <= 0) total_count = 0
        else total_count = parseInt($('.wrap-paging').attr('data-count'))
        if (total_count > 0) {
            max_page = parseInt((total_count / 12))
        }
        return max_page
    },
    GetTotalCount: function () {

        var total_count = 0
        if (isNaN(parseInt($('.wrap-paging').attr('data-count'))) || parseInt($('.wrap-paging').attr('data-count')) <= 0) total_count = 0
        else total_count = parseInt($('.wrap-paging').attr('data-count'))

        return total_count
    },
}