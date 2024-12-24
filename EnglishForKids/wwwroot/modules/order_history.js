$(document).ready(function () {
    order_history.Initialization()
})
var order_history = {
    Data: {
        Index: 1,
        Size:10
    },
    Initialization: function () {
        order_history.DynamicBind()
        order_history.Detail()

    },
    DynamicBind: function () {
        $("body").on('click', ".order-tab", function () {
            var element = $(this)
            $('.list-tab li').removeClass('active')
            element.closest('li').addClass('active')
            order_history.Detail()

        });
        $("body").on('click', ".order-tab", function () {
          
        });
    },
    Detail: function () {
        var usr = global_service.CheckLogin()
        if (usr == undefined || usr.token == undefined) {
            return
        }
        var request = {
            "token": usr.token,
            "status": $('.list-tab .active a').attr('data-id'),
            "page_index": order_history.Data.Index,
            "page_size": order_history.Data.Size
        }
        $.when(
            global_service.POST(API_URL.OrderListing, request)
        ).done(function (result) {
            if (result.is_success && result.data && result.data.total) {
                order_history.RenderDetail(result.data)
                $('.list-tab .active .tab-count').html('(' + global_service.Comma(result.data.total)+')')
            }
            else {
                //debugger
                window.location.href = '/Home/NotFound'
            }
        })
    },
    RenderDetail: function (result) {
        var html = ''

        $(result.data).each(function (index, item) {
            var order_data = result.data_order.filter(obj => {
                return obj.order_id == item.orderid
            })
            var status_name = GLOBAL_CONSTANTS.OrderStatus.filter(obj => {
                return obj.id == item.orderstatus
            })
            var html_products = ''
            $(order_data[0].carts).each(function (index_cart, cart_item) {
                html_products += HTML_CONSTANTS.OrderHistory.ItemProduct
                    .replaceAll('{src}', global_service.CorrectImage(cart_item.product.avatar))
                    .replaceAll('{name}', cart_item.product.name)
                    .replaceAll('{attributes}', order_history.RenderVariationDetail(cart_item))
                    .replaceAll('{price}', global_service.Comma(cart_item.product.amount) + ' đ')
                    .replaceAll('{quanity}', global_service.Comma(cart_item.quanity))
                    .replaceAll('{amount}', global_service.Comma(cart_item.total_amount) + ' đ' )


            });
            html += HTML_CONSTANTS.OrderHistory.Item
                .replaceAll('{order_id}', item.orderid)
                .replaceAll('{order_no}', item.orderno)
                .replaceAll('{status}', status_name[0].name)
                .replaceAll('{confirm_cancel}', item.status < 2 ? '' :'button-disabled')
                .replaceAll('{confirm_display}', item.status == 2 ? '' : 'button-disabled')
                .replaceAll('{total_amount}', global_service.Comma(item.amount) + ' đ')
                .replaceAll('{create_date}', global_service.DateTimeDotNetToString(item.createddate,true))
                .replaceAll('{product_detail}', html_products)

        });
        $('#order-history').html(html)
        $('.content-left-user').removeClass('placeholder')
        $('.menu-left-user').removeClass('placeholder')
    },
    RenderVariationDetail: function (item) {
        var variation_value = ''
        $(item.product.variation_detail).each(function (index_var, variation_item) {
            var attribute = item.product.attributes.filter(obj => {
                return obj._id === variation_item.id
            })
            var attribute_detail = item.product.attributes_detail.filter(obj => {
                return (obj.name === variation_item.name && obj.name === variation_item.name)
            })
            variation_value += attribute[0].name + ':' + attribute_detail[0].name
            if (index_var < ($(item.product.variation_detail).length - 1)) {
                variation_value += ', '
            }
        })
        return variation_value
    }
}