$(document).ready(function () {
    cart.Initialization()
})
var cart = {
    Data: {
        cancel_token: false
    },
    Initialization: function () {
        cart.DynamicBind()
        cart.CartItem()
        $('.select-delivery .list-option').fadeOut()
        $('.select-bank .list-option').fadeOut()
        $('.voucher ').hide()
        cart.OrderAddress()

    },
    DynamicBind: function () {
        $("body").on('click', ".right-cart .delivery", function () {
            $('#hinhthucgiaohang').addClass('overlay-active')
        });
        $("body").on('click', "#hinhthucgiaohang .item li", function () {
            var element = $(this)
            if (element.hasClass('disabled')) {
                return
            }
            $('#hinhthucgiaohang .item li').removeClass('active')
            $('#hinhthucgiaohang .item li').removeClass('active-delivery')
            element.addClass('active')
            element.addClass('active-delivery')
        });
        $("body").on('click', "#hinhthucgiaohang .btn-save", function () {
            $('#hinhthucgiaohang').removeClass('overlay-active')

            cart.RenderSelectionDelivery()
        });
        $("body").on('click', ".section-cart .table-addtocart .remove-product", function () {
            var element = $(this)
            cart.RemoveCartItem(element.closest('.product').attr('data-cart-id'))

        });
        $("body").on('click', "#lightbox-delete-cart .btn-save", function () {
            cart.ConfirmRemoveCartItem()

        });
        $("body").on('click', ".box-checkbox-all", function () {
            var element = $(this)
            var checkbox = element.closest('.box-checkbox').find('input')
            if (!checkbox.is(":checked")) {
                $('.table-addtocart .box-checkbox').each(function (index_var, variation_item) {
                    var element_product = $(this)
                    element_product.find('input').prop('checked', true)
                })
            } else {
                $('.table-addtocart .box-checkbox').each(function (index_var, variation_item) {
                    var element_product = $(this)
                    element_product.find('input').prop('checked', false)
                })
            }
            cart.ReRenderAmount()
        });
        $("body").on('click', ".box-checkbox-label,.delivery .list-option label,.pay .list-option label", function () {
            var element = $(this)
            element.closest('.box-checkbox').find('input').click()
            var check_all = true
            $('.table-addtocart .box-checkbox').each(function (index_var, variation_item) {
                var element_checkbox = $(this)
                if (!element_checkbox.find('input').is(":checked")) {
                    check_all = false
                    return false
                }
            })
            if (check_all) {
                $('.box-checkbox-all').closest('.box-checkbox').find('input').prop('checked', true)
            } else {
                $('.box-checkbox-all').closest('.box-checkbox').find('input').prop('checked', false)

            }
            var value = element.closest('.box-checkbox').find('.option-name').text()
            element.closest('.select-option').find('.tt').text(value)
            if (!element.closest('.list-option').is(':hidden')) {
                element.closest('.list-option').fadeOut()
            }
        });
        $("body").on('click', ".box-checkbox, .number-input button, .checkbox-cart", function () {
            cart.ReRenderAmount()
        });
        $("body").on('click', ".btn-confirm-cart", function () {
            cart.ConfirmCart()
        });
        $("body").on('keyup', ".product-quantity input", function () {
            $('.btn-confirm-cart').addClass('button-disabled')
            $('.btn-confirm-cart').addClass('placeholder')

            var element = $(this)
            setTimeout(() => {
                cart.ChangeCartQuanity(element.closest('.product'))
                cart.ReRenderAmount()

            }, 1000);

        });
        $("body").on('click', ".product-quantity button", function () {
            $('.btn-confirm-cart').addClass('button-disabled')
            $('.btn-confirm-cart').addClass('placeholder')

            var element = $(this)
            setTimeout(() => {
                cart.ChangeCartQuanity(element.closest('.product'))
                cart.LoadShippingFee()
                cart.ReRenderAmount()

            }, 1000);
        });
        $("body").on('click', "#lightbox-delete-cart .btn-back", function () {
            $('#lightbox-delete-cart').removeClass('overlay-active')


        });
        $("body").on('click', ".right-cart .select-bank", function () {
            $('#phuongthucthanhtoan').addClass('overlay-active')
        });
        $("body").on('click', "#phuongthucthanhtoan .btn-save", function () {
            $('#phuongthucthanhtoan').removeClass('overlay-active')
            $('.right-cart .pay .select-bank .tt').html($('input[name="payment_type"]:checked').closest('.box-radio').find('label').text())
        });
       
    },
    OrderAddress: function () {
        cart.RenderDefaultAddress();
        var request = {

        }
        $.when(
            global_service.POST(API_URL.AddressPopup, request)
        ).done(function (result) {
            $('body').append(result)
            address_client.Initialization()
            address_client.DynamicConfirmAddress(function (data) {
                cart.ConfirmCartAddress(data)
            })

        })
    },
    RenderDefaultAddress: function () {
        var usr = global_service.CheckLogin()
        if (usr == undefined || usr.token == undefined) {
            return
        }
        var request = {
            "token": usr.token
        }
        $.when(
            global_service.POST(API_URL.DefaultAddress, request)
        ).done(function (result) {
            if (result.is_success) {
                cart.ConfirmCartAddress(result.data)

            }
        })
    },
    ConfirmCartAddress: function (data) {
        if (data != undefined && data.id != undefined) {
            $('#address-receivername').attr('data-id', (data.id == null || data.id == undefined || data.id == '' ? '-1' : data.id))
            $('#address-receivername').html(data.receivername)
            $('#address-phone').html(data.phone)
            $('#address').html(address_client.RenderDetailAddress(data))
            sessionStorage.setItem(STORAGE_NAME.CartAddress, JSON.stringify(data))
            cart.LoadShippingFee()
        }
    },
    CartItem: function () {
        var usr = global_service.CheckLogin()
        if (usr) {
            var request = {
                "token": usr.token
            }
            $.when(
                global_service.POST(API_URL.CartList, request)
            ).done(function (result) {
                if (result.is_success && result.data && result.data.length > 0) {
                    cart.RenderCartItem(result.data)
                    cart.RenderBuyNowSelection()
                }
                else {
                    $('#main').html(HTML_CONSTANTS.Cart.Empty)

                }

            })

        } else {
            $('#main').html(HTML_CONSTANTS.Cart.Empty)
            $('.mainheader .client-login').click()
        }


    },
    RenderCartItem: function (list) {
        var html = ''
        var total_amount = 0

        //-- Table Product
        $(list).each(function (index, item) {
            var html_item = HTML_CONSTANTS.Cart.Product
                .replaceAll('{id}', item._id)
                .replaceAll('{product_id}', item.product._id)
                .replaceAll('{amount}', item.product.amount)
                .replaceAll('{name}', item.product.name)
                .replaceAll('{amount_display}', global_service.Comma(item.product.amount))
                .replaceAll('{quanity}', global_service.Comma(item.quanity))
                .replaceAll('{total_amount}', global_service.Comma(item.total_amount))
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
                    variation_value += ', <br />'
                }
            })
            var img_src = item.product.avatar
            if (!img_src.includes(API_URL.StaticDomain)
                && !img_src.includes("data:image")
                && !img_src.includes("http"))
                img_src = API_URL.StaticDomain + item.product.avatar

            html_item = html_item
                .replaceAll('{attribute}', variation_value)
                .replaceAll('{src}', img_src)

            html += html_item
            total_amount += item.total_amount
        });
        $('.section-cart .table-addtocart').html(html)
        //$('.total-shipping-fee').hide()


        //-- Remove placeholder:
        $('.section-cart').removeClass('placeholder')
        //--Render Amount:
        cart.ReRenderAmount()
        cart.RenderCartNumberOfProduct()
    },
    RenderBuyNowSelection: function () {
        var buy_now_item = sessionStorage.getItem(STORAGE_NAME.BuyNowItem)
        if (buy_now_item) {
            var buy_now = JSON.parse(buy_now_item)
            $('.table-addtocart .product').each(function (index, item) {
                var element = $(this)
                if (element.attr('data-product-id') == buy_now.product_id) {
                    element.find('.checkbox-cart').prop('checked', true)
                    cart.ReRenderAmount()
                    return false
                }
            })
            sessionStorage.removeItem(STORAGE_NAME.BuyNowItem)
        }

    },
    RenderCartNumberOfProduct: function () {
        $('.total-sp').html('(' + $('.table-addtocart .product').length + ' sản phẩm) ')

    },
    ReRenderAmount: function (loading_shipping = true) {
        var total_amount_cart = 0

        $('.table-addtocart .product').each(function (index, item) {
            var element = $(this)
            var amount = parseFloat(element.attr('data-amount'))
            var quanity = parseInt(element.find('.quantity').val())
            var total_amount_product = amount * quanity
            element.find('.product-line-price').html(global_service.Comma(total_amount_product) + ' đ')
            if (element.find('.checkbox-cart').is(":checked")) {
                total_amount_cart += total_amount_product
            }

        })
        $('.total-amount .pr').html(global_service.Comma(total_amount_cart) + ' đ')
        var shipping_fee = $('.total-cart .total-shipping-fee .pr').attr('data-price')
        if (shipping_fee != undefined && shipping_fee.trim() != '') {
            var shipping_fee_number = parseInt(shipping_fee)
            if (!isNaN(shipping_fee_number) && shipping_fee_number > 0) total_amount_cart += shipping_fee_number
        }
        $('.total-final-amount .pr').html(global_service.Comma(total_amount_cart) + ' đ')
        if (total_amount_cart > 0) {
            if (loading_shipping) {
                cart.LoadShippingFee()
            }
            $('.btn-confirm-cart').removeClass('button-disabled')

        } else {
            $('.btn-confirm-cart').addClass('button-disabled')

        }
    },
    RemoveCartItem: function (data_id) {
        $('#lightbox-delete-cart').addClass('overlay-active')
        $('#lightbox-delete-cart').attr('data-cart-id', data_id)

    },
    ConfirmRemoveCartItem: function () {
        var data_id = $('#lightbox-delete-cart').attr('data-cart-id')
        $('.table-addtocart .product').each(function (index, item) {
            var element = $(this)
            if (element.attr('data-cart-id') == data_id) {
                element.remove()
                return false
            }
        })
        if ($('.table-addtocart .product').length <= 0) {
            $('#main').html(HTML_CONSTANTS.Cart.Empty)

        }
        var request = {
            "id": data_id
        }
        $.when(
            global_service.POST(API_URL.CartDelete, request)
        ).done(function (result) {
            sessionStorage.removeItem(STORAGE_NAME.CartCount)
            global_service.LoadCartCount()
            cart.RenderCartNumberOfProduct()
            cart.ReRenderAmount()

        })
        $('#lightbox-delete-cart').removeClass('overlay-active')



    },

    ConfirmCart: function () {
        if ($('#address-receivername').attr('data-id') == null || $('#address-receivername').attr('data-id') == undefined || $('#address-receivername').attr('data-id').trim() == '') {
            $('#lightbox-cannot-add-cart .info-order .notification-content').html('Vui lòng thêm/chọn địa chỉ trước khi tiếp tục')
            $('#lightbox-cannot-add-cart .title-box').html('Chưa chọn địa chỉ giao hàng')
            $('#lightbox-cannot-add-cart').addClass('overlay-active')
            cart.HideNotification()
            return
        }
        var usr = global_service.CheckLogin()
        if (usr) {
            var carts = []
            $('.table-addtocart .product').each(function (index, item) {
                var element = $(this)
                if (element.find('.checkbox-cart').is(':checked')) {
                    var cart = {
                        "id": element.attr('data-cart-id'),
                        "amount": element.attr('data-amount'),
                        "quanity": parseInt(element.find('.quantity').val())
                    }
                    carts.push(cart)
                }
            })
            var delivery_detail = {

            }
            var default_address_json = sessionStorage.getItem(STORAGE_NAME.CartAddress)
            if (default_address_json) {
                var default_address = JSON.parse(default_address_json)
                var selected = $('#hinhthucgiaohang .active-delivery').first()
                var carrier_id = selected.closest('.item').attr('data-carrier-id')
                var shipping_type = selected.attr('data-shipping-type')

                delivery_detail = {
                    "from_province_id": 1,
                    "to_province_id": default_address.provinceid,
                    "shipping_type": shipping_type,
                    "carrier_id": carrier_id,
                    "carts": []
                }
                $('.shopping-cart .table-addtocart .product').each(function (index, item) {
                    var element_cart = $(this)
                    if (element_cart.find('.checkbox-cart').is(':checked')) {
                        delivery_detail.carts.push({
                            "id": element_cart.attr('data-cart-id'),
                            "product_id": element_cart.attr('data-product-id'),
                            "quanity": parseInt(element_cart.find('.number-input').find('.quantity').val())
                        })
                    }

                })
            }

            if (carts.length > 0) {

                var request = {
                    "carts": carts,
                    "token": usr.token,
                    "payment_type": $('input[name="payment_type"]:checked').val(),
                    "address": JSON.parse(sessionStorage.getItem(STORAGE_NAME.CartAddress)),
                    "address_id": $('#address-receivername').attr('data-id'),
                    "delivery_detail": delivery_detail
                }
                $.when(
                    global_service.POST(API_URL.CartConfirm, request)
                ).done(function (result) {
                    if (result.is_success && result.data != undefined) {
                        request.result = result.data
                        sessionStorage.setItem(STORAGE_NAME.Order, JSON.stringify(request))
                        sessionStorage.removeItem(STORAGE_NAME.CartCount)
                        global_service.LoadCartCount()

                        window.location.href = '/order/payment/' + result.data.id

                    }
                    else {
                        $('#lightbox-cannot-add-cart .info-order .notification-content').html('Có lỗi xảy ra trong quá trình xác nhận thông tin')
                        $('#lightbox-cannot-add-cart').addClass('overlay-active')
                        $('.btn-confirm-cart').removeClass('button-disabled')
                        cart.HideNotification()


                    }

                })
            }


        } else {
            $('.mainheader .client-login').click()
            $('.btn-confirm-cart').removeClass('button-disabled')
            return
        }

    },
    ChangeCartQuanity: function (element) {

        var product_id = element.attr('data-product-id')
        if (product_id == undefined || product_id.trim() == '') return
        var usr = global_service.CheckLogin()
        if (usr) {
            var request = {
                "product_id": product_id,
                "quanity": parseInt(element.find('.product-quantity').find('input').val()),
                "token": usr.token
            }
            $.when(
                global_service.POST(API_URL.CartChangeQuanity, request)
            ).done(function (result) {
                $('.btn-confirm-cart').removeClass('placeholder')


            })
        }
        else {
            $('.btn-confirm-cart').removeClass('placeholder')


            return
        }

    },
    CheckCartProductDetail: function (carts) {
        var request = {
            "carts": carts
        }
        $.when(
            global_service.POST(API_URL.CartChangeQuanity, request)
        ).done(function (result) {

        })
    },
    HideNotification: function () {
        setTimeout(function () {
            $('#lightbox-cannot-add-cart').removeClass('overlay-active')


        }, 3000);
    },
    LoadShippingFee: function () {
        $('#hinhthucgiaohang .item').each(function (index, item) {
            var element = $(this)
            var carrier_id = element.attr('data-carrier-id')
            var default_address = sessionStorage.getItem(STORAGE_NAME.CartAddress)
            if (default_address) {
                var data_address = JSON.parse(default_address)
                element.find('li').each(function (index, item) {
                    var element_li = $(this)
                    var shipping_type = element_li.attr('data-shipping-type')
                    var request = {
                        "from_province_id": 1,
                        "to_province_id": data_address.provinceid,
                        "shipping_type": shipping_type,
                        "carrier_id": carrier_id,
                        "carts": []
                    }
                    $('.shopping-cart .table-addtocart .product').each(function (index, item) {
                        var element_cart = $(this)
                        if (element_cart.find('.checkbox-cart').is(':checked')) {
                            request.carts.push({
                                "id": element_cart.attr('data-cart-id'),
                                "product_id": element_cart.attr('data-product-id'),
                                "quanity": parseInt(element_cart.find('.number-input').find('.quantity').val())
                            })
                        }

                    })
                    var result = global_service.POSTSynchorus(API_URL.CartGetShippingFee, request)
                    if (result.is_success && result.data != undefined && result.data.total_shipping_fee != undefined && result.data.total_shipping_fee >= 0) {
                        element_li.find('.price').html(global_service.Comma(result.data.total_shipping_fee) + 'đ')
                        element_li.attr('data-price', result.data.total_shipping_fee)
                        element_li.removeClass('disabled')
                        element_li.css('color', '')
                        element_li.find('.name').css('color', '')
                        element_li.find('.des').css('color', '')

                    } else {
                        element_li.attr('data-price', '0')
                        if (element_li.attr('data-shipping-type') != undefined && element_li.attr('data-shipping-type').trim() == '2') {
                            element_li.find('.price').html('0 đ')
                        } else {
                            element_li.addClass('disabled')
                            element_li.css('color', 'lightgray')
                            element_li.find('.name').css('color', 'lightgray')
                            element_li.find('.des').css('color', 'lightgray')
                            element_li.find('.price').html('Không khả dụng')
                        }
                    }
                    element_li.find('.price').removeClass('placeholder')

                })

            } else {
                $('#hinhthucgiaohang .item li').each(function (index, item) {
                    var element_li = $(this)
                    element_li.attr('data-price', '0')
                    if (element_li.attr('data-shipping-type') != undefined && element_li.attr('data-shipping-type').trim() == '2') {
                        element_li.find('.price').html('0 đ')
                    } else {
                        element_li.addClass('disabled')
                        element_li.css('color', 'lightgray')
                        element_li.find('.name').css('color', 'lightgray')
                        element_li.find('.des').css('color', 'lightgray')
                        element_li.find('.price').html('Không khả dụng')
                    }

                    element_li.closest('.item').find('h3').removeClass('active')
                    element_li.closest('.item').find('.answer').hide()
                })

            }

        })
        var activated = false
        $('#hinhthucgiaohang li').each(function (index, item) {
            var element_li = $(this)
            if (!element_li.hasClass('disabled') && !activated) {
                activated = true
                element_li.addClass('active-delivery')
                element_li.addClass('active')
                element_li.closest('.item').find('h3').addClass('active')
                element_li.closest('.item').find('.answer').show()

            } else {
                element_li.removeClass('active-delivery')
                element_li.removeClass('active')
                element_li.closest('.item').find('h3').removeClass('active')
                element_li.closest('.item').find('.answer').hide()
            }

        })
        cart.RenderSelectionDelivery()

    },
    RenderSelectionDelivery: function (element) {
        var selected = $('#hinhthucgiaohang .active-delivery').first()
        if (selected == undefined || selected.attr('data-shipping-type') == undefined
            || selected.closest('.item').length <= 0) {
            $('.total-cart .total-shipping-fee .pr').html(global_service.Comma(0) + ' đ')
            $('.total-cart .total-shipping-fee .pr').attr('data-price', 0)
            cart.ReRenderAmount(false)
            return
        }
        if (selected.attr('data-shipping-type').trim() == '2') {
            $('#delivery-carrier').hide()
        }
        else {
            $('#delivery-carrier').show()

        }
        $('#delivery-shippingtype .select-delivery .tt').text(selected.find('.name').html())
        $('#delivery-carrier .select-delivery .tt').text(selected.closest('.item').find('h3').html())
        var total_price = parseInt(selected.attr('data-price'))
        $('.total-cart .total-shipping-fee .pr').attr('data-price', total_price)
        $('.total-cart .total-shipping-fee .pr').html(global_service.Comma(total_price) + ' đ')
        cart.ReRenderAmount(false)

    }
}