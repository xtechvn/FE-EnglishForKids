$(document).ready(function () {
    $("body").on('click', "#tab-order", function () {
        _account_client.ListOrder()
    });
    $("body").on('click', "#order-detai", function () {

        _account_client.OrderDetail()
    });
    $("body").on('click', "#get-list-order", function () {
        _account_client.ListOrder()
    });
})
var _account_client = {
    ListOrder: function () {
        $("#body_list_order").show();
        $("#body_user").hide();
        $.ajax({
            url: "/AccountClient/ListOrder",
            type: 'post',
            data: {},
            success: function (data) {
                $("#body_list_order").html(data);
            },

        });
    },
    OrderDetail: function (id) {

        $.ajax({
            url: "/AccountClient/OrderDetail",
            type: 'post',
            data: { Id: id},
            success: function (data) {
                $("#body_list_order").html(data);
            },

        });
    },
}