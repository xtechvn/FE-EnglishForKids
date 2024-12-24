$(document).ready(function () {
	
    product_detail.Initialization()
})
var product_detail = {
    Initialization: function () {
        //--Init:
        $('.coupon-list').remove()
        $('.write-review').remove()
        $('#product-alike').remove()


        $('#thanhcong').removeClass('overlay-active')
        product_detail.ShowLoading()
        sessionStorage.removeItem(STORAGE_NAME.ProductDetail)

        sessionStorage.removeItem(STORAGE_NAME.SubProduct)
        product_detail.Detail()
        product_detail.DynamicBind()
        global_service.LoadHomeProductGrid($('#combo-discount .list-product'), GLOBAL_CONSTANTS.GroupProduct.FlashSale, GLOBAL_CONSTANTS.Size)
        $('#thanhcong .lightbox-description').html('Thêm sản phẩm vào giỏ hàng thành công')
        $('#thanhcong .btn-close').addClass('btn-go-to-cart')
        $('#thanhcong .btn-close').removeClass('btn-close')
        $('#thanhcong .btn-go-to-cart').html('Xem giỏ hàng')
        $('#thanhcong .btn-go-to-cart').hide()
        $('#thanhcong .popup').css('width', '500px')
        $('#thanhcong .popup').css('margin-top', '15%')
        $('#thanhcong .popup').css('text-align', '-webkit-center')
       
    },
    DynamicBind: function () {
        $("body").on('click', ".attribute-detail", function () {
            var element = $(this)
            if (!element.hasClass('disabled')) {
                element.closest('ul').find('li').removeClass('active')
                element.addClass('active')
            }
            var product = product_detail.GetProductDetailSession()
            if (product != undefined) {
                product_detail.RenderChangedAttributeSelected(product)

            } else {
                window.location.reload()
            }
        });
        $("body").on('click', ".attribute-detail", function () {
            product_detail.RenderBuyNowButton()
        });
        $("body").on('click', ".add-cart", function () {
            product_detail.AddToCart()

        });
        $("body").on('click', ".buy-now", function () {
            product_detail.BuyNow()

        });
        $("body").on('click', ".btn-go-to-cart", function () {
            window.location.href='/cart'

        });
    },
    Detail: function () {
        var code = $('.section-details-product').attr('data-code')
        if (code == undefined || code.trim() == '')
            window.location.href = '/error'
        var request = {
            "id": code
        }
        $.when(
            global_service.POST(API_URL.ProductDetail, request)
        ).done(function (result) {
            
            if (result.is_success && result.data && result.data.product_main) {
                sessionStorage.setItem(STORAGE_NAME.ProductDetail, JSON.stringify(result.data))
                sessionStorage.setItem(STORAGE_NAME.SubProduct, JSON.stringify(result.data.product_sub))
                product_detail.RenderDetail(result.data.product_main, result.data.product_sub)
            }
            else {
                window.location.href ='/Home/NotFound' 
            }
        })
    },
    RenderDetail: function (product, product_sub) {

        var html = ''
        var html_thumb = ''
        var img_src = product.avatar
        $(product.videos).each(function (index, item) {
            img_src = global_service.CorrectImage(item)
            html += HTML_CONSTANTS.Detail.Videos
                .replaceAll('{src}', img_src)
            html_thumb += HTML_CONSTANTS.Detail.ThumbnailVideos
                .replaceAll('{src}', img_src)
        });

        img_src = global_service.CorrectImage(product.avatar)
        // gallery
        html += HTML_CONSTANTS.Detail.Images
            .replaceAll('{src}', img_src)
        html_thumb += HTML_CONSTANTS.Detail.ThumbnailImages
            .replaceAll('{src}', img_src)

        $(product.images).each(function (index, item) {

            img_src = global_service.CorrectImage(item)
            html += HTML_CONSTANTS.Detail.Images
                .replaceAll('{src}', img_src)
            html_thumb += HTML_CONSTANTS.Detail.ThumbnailImages
                .replaceAll('{src}', img_src)

        });
        $('.thumb-big .swiper-wrapper').html(html)
        $('.thumb-small .swiper-wrapper').html(html_thumb)
        swiperSmallThumb = new Swiper(".thumb-small", {
            spaceBetween: 8,
            slidesPerView: 4,
            freeMode: true,
            watchSlidesProgress: true,
        });
        swiperBigThumb = new Swiper(".thumb-big", {
            spaceBetween: 15,
            navigation: false,
            thumbs: {
                swiper: swiperSmallThumb,
            },

        });
        lightGallery($('.thumb-big .swiper-wrapper')[0], {
            plugins: [lgVideo],
            videojs: true,
            speed: 500,
            thumbnail: true,
        });


        $('.section-details-product .name-product').html(product.name)

        if (product_sub != undefined && product_sub.length > 0) {
            const max_obj = product_sub.reduce(function (prev, current) {
                return (prev && prev.amount > current.amount) ? prev : current
            })
            const min_obj = product_sub.reduce(function (prev, current) {
                return (prev && prev.amount < current.amount) ? prev : current
            })
            if (max_obj.amount <= min_obj.amount)
                $('.section-details-product .price').html(global_service.Comma(min_obj.amount))
            else
                $('.section-details-product .price').html(global_service.Comma(min_obj.amount) + ' - ' + global_service.Comma(max_obj.amount))
        }
        else {
            $('.section-details-product .price').html(global_service.Comma(product.amount))

        }
        if (product.discount > 0) {
            $('#price-old').html(global_service.Comma(product.amount + product.discount))
        } else {
            $('#price-old').closest('.price-old').hide()
        }
        var total_stock = product.quanity_of_stock

        html = ''
        //html += HTML_CONSTANTS.Detail.Tr_Voucher.replaceAll('{span}', '')
        //html += HTML_CONSTANTS.Detail.Tr_Combo.replaceAll('{span}', '')
        html += HTML_CONSTANTS.Detail.Tr_Shipping
        //html += HTML_CONSTANTS.Detail.Tr_Combo.replaceAll('{span}', '')
        if (product_sub != undefined && product_sub.length > 0) {
            $(product.attributes).each(function (index, attribute) {
                var attr_detail = product.attributes_detail.filter(obj => {
                    return obj.attribute_id === attribute._id
                })
                var html_item = ''
                if (attr_detail != undefined && attr_detail.length > 0) {
                    $(attr_detail).each(function (index_detail, attribute_detail) {
                        img_src = global_service.CorrectImage(attribute_detail.img)

                        html_item += HTML_CONSTANTS.Detail.Tr_Attributes_Td_li
                            .replaceAll('{active}', '')
                            .replaceAll('{src}', attribute_detail.img != undefined && attribute_detail.img.trim() != '' ? '<img src="' + img_src + '" />' : '')
                            .replaceAll('{name}', attribute_detail.name)
                    })
                }
                html += HTML_CONSTANTS.Detail.Tr_Attributes
                    .replaceAll('{level}', attribute._id)
                    .replaceAll('{name}', attribute.name)
                    .replaceAll('{li}', html_item)
            });
            total_stock = product_sub.reduce((n, { amount }) => n + amount, 0)
        }
        html += HTML_CONSTANTS.Detail.Tr_Quanity.replaceAll('{stock}', global_service.Comma(total_stock))

        $('.box-info-details tbody').html(html)
        $('.section-description-product .box-des p').html(product.description.replaceAll('\n', '<br />'))

        //--hide voucher (implement later):
        $('#voucher').hide()
        //$('#combo-discount').hide()
        $('#combo-discount .list-product .item-product').each(function (index, item) {
            var element = $(this)
            if (index < 5) return true
            else element.hide()
        })
        product_detail.RenderBuyNowButton()
        product_detail.RenderSavedProductDetailAttributeSelected()
        product_detail.RemoveLoading()
    },
    GetProductDetailSession: function () {
        var json = sessionStorage.getItem(STORAGE_NAME.ProductDetail)
        if (json != undefined && json.trim()!='') {
            return JSON.parse(json)
        }
        return undefined
    },
    GetSubProductSessionByAttributeSelected: function () {
        var json = sessionStorage.getItem(STORAGE_NAME.SubProduct)
        if (json != undefined && json.trim() != '') {
            var list = JSON.parse(json)
            var sub_list = list
            var options = []
            $('.box-info-details tbody .attributes').each(function (index, item) {
                var element = $(this)
                var value = element.find('.box-tag').find('.active').attr('data-id')
                var level = element.attr('data-level')
                options.push({
                    id: level,
                    name: value
                })

            })
            $(options).each(function (index, item) {
                
                sub_list = sub_list.filter(({ variation_detail }) =>
                    variation_detail.some(v => v.id == item.id && v.name==item.name)
                )
                    

            })
            return sub_list[0]
        }
        return undefined
    },
    RenderChangedAttributeSelected: function (product) {
        var options=[]
        $('.box-info-details tbody .attributes').each(function (index, item) {
            var element = $(this)
            var value = element.find('.box-tag').find('.active').attr('data-id')
            var level = element.attr('data-level')
            options.push({
                id: level,
                name: value
            })
        })
        var json = sessionStorage.getItem(STORAGE_NAME.SubProduct)
        if (json != undefined && json.trim() != '') {
            var list = JSON.parse(json)
            var variation = list.filter(obj => {
                return product_detail.Compare2Array(obj.variation_detail, options)
            })
            if (variation != undefined && variation.length > 0) {
                $('.section-details-product .price').html(global_service.Comma(variation[0].amount))
                $('.box-info-details .box-detail-stock .soluong').html(global_service.Comma(variation[0].quanity_of_stock) + ' sản phẩm có sẵn')
            }
        }
       
    },
    RenderBuyNowButton: function () {
        var no_select_all = false
        if ($('.box-info-details tbody .attributes').length <= 0) {

        }
        else {
            $('.box-info-details tbody .attributes').each(function (index, item) {
                var element = $(this)
                var li_active = element.find('.box-tag').find('.active')
                if (li_active.length <= 0) {
                    no_select_all = true
                    return false
                }
            })
        }
        if (no_select_all) {
            $('.add-cart').prop('disabled',true)
            $('.buy-now').prop('disabled', true)
            $('.add-cart').addClass('button-disabled')
            $('.buy-now').addClass('button-disabled')

        } else {
            $('.add-cart').prop('disabled', false)
            $('.buy-now').prop('disabled', false)
            $('.add-cart').removeClass('button-disabled')
            $('.buy-now').removeClass('button-disabled')
        }
    },
    AddToCart: function (buy_now=false) {
        var product = product_detail.GetSubProductSessionByAttributeSelected()
        if (product == undefined) {
            var json = sessionStorage.getItem(STORAGE_NAME.ProductDetail)
            if (json != undefined && json.trim() != '') {
                product = JSON.parse(json).product_main
               
            }
        }
        if (product == undefined) {
            window.location.reload()
        }
        var usr = global_service.CheckLogin()
        var token =''
        if (usr) {
            token = usr.token
            var request = {
                "product_id": product._id,
                "quanity": parseInt($('.box-detail-stock .quantity').val()),
                "token": token
            }
            $.when(
                global_service.POST(API_URL.AddToCart, request)
            ).done(function (result) {
                if (result.is_success && result.data) {
                    sessionStorage.removeItem(STORAGE_NAME.BuyNowItem)
                    global_service.LoadCartCount()
                    product_detail.SuccessAddToCart()
                }
            })
        }
        else {
            product_detail.SaveProductDetailAttributeSelected()
            $('.mainheader .client-login').click()
            return
        }
       
    },
    SuccessAddToCart: function () {
       
        $('#thanhcong').addClass('overlay-active')
        setTimeout(function () {
            $('#thanhcong').removeClass('overlay-active')

        }, 1500);
    },
    BuyNow: function () {
        var product = product_detail.GetSubProductSessionByAttributeSelected()
        if (product == undefined) {
            var json = sessionStorage.getItem(STORAGE_NAME.ProductDetail)
            if (json != undefined && json.trim() != '') {
                product = JSON.parse(json).product_main

            }
        }
        if (product == undefined) {
            window.location.reload()
        }
        var usr = global_service.CheckLogin()
        var token = ''
        if (usr) {
            token = usr.token
            var request = {
                "product_id": product._id,
                "quanity": parseInt($('.box-detail-stock .quantity').val()),
                "token": token
            }
            $.when(
                global_service.POST(API_URL.AddToCart, request)
            ).done(function (result) {
                if (result.is_success && result.data) {
                    sessionStorage.setItem(STORAGE_NAME.BuyNowItem, JSON.stringify(request) )
                    window.location.href ='/cart'
                }
            })
        }
        else {
            $('.mainheader .client-login').click()
            product_detail.SaveProductDetailAttributeSelected()
            return
        }
      
    },
    SaveProductDetailAttributeSelected: function () {
        var selected = {
            attributes: [],
            quanity:1
        }
        $('.box-info-details .attributes').each(function (index_detail, attribute_detail) {
            var tr_attributes = $(this)
            if (tr_attributes.find('.active').length > 0) {
                selected.attributes.push({
                    "level": tr_attributes.attr('data-level'),
                    "data": tr_attributes.find('.active').attr('data-id')
                })
            }
        })
        selected.quanity = $('.quantity').val()
        sessionStorage.setItem(STORAGE_NAME.ProductDetailSelected, JSON.stringify(selected))

    },
    RenderSavedProductDetailAttributeSelected: function () {
        var selected = sessionStorage.getItem(STORAGE_NAME.ProductDetailSelected)
        if (selected) {
            var data = JSON.parse(selected)
            if (data != undefined) {
                if (data.attributes != undefined && data.attributes.length > 0) {
                    $('.box-info-details .attributes').each(function (index_detail, attribute_detail) {
                        var tr_attributes = $(this)
                        var level = tr_attributes.attr('data-level')
                        var selected_value = data.attributes.filter(obj => {
                            return obj.level == level
                        })
                        if (selected_value.length > 0) {
                            tr_attributes.find('li').each(function (index_detail, attribute_detail) {
                                var li_attribute = $(this)
                                if (li_attribute.attr('data-id') == selected_value[0].data) {
                                    li_attribute.trigger('click')
                                    return false
                                }

                            })
                        }
                       
                    })
                }
                if (data.quanity != undefined && data.quanity.trim() != '') {
                    $('.quantity').val(data.quanity)
                }
            }
            sessionStorage.removeItem(STORAGE_NAME.ProductDetailSelected)
        }


    },
    Compare2Array: function (arr1, arr2) {
        const objectsEqual = (o1, o2) =>
            Object.keys(o1).length === Object.keys(o2).length
            && Object.keys(o1).every(p => o1[p] === o2[p]);
        const arraysEqual = (a1, a2) =>
            a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
        return arraysEqual(arr1, arr2)

    },
    ShowLoading: function () {
        $('.section-details-product').addClass('placeholder')
        $('.section-description-product').addClass('placeholder')
        $('.section-category').addClass('placeholder')
        $('.gallery-product .swiper-wrapper').addClass('placeholder')
        $('.gallery-product swiper-slide').addClass('placeholder')
        $('.box-name-product').addClass('placeholder')
        $('.price').addClass('placeholder')
        $('.box-info-details').addClass('placeholder')
        $('.box-action').addClass('placeholder')
        $('.total-sold').html('')
        $('.total-review').html('')
        $('.review').html('')
        $('.total-sold').addClass('placeholder')
        $('.total-review').addClass('placeholder')
        $('.review').addClass('placeholder')

        $('.info-product .box-price .price-old').hide()

    },
    RemoveLoading: function () {
        $('.section-details-product').removeClass('placeholder')
        $('.section-description-product').removeClass('placeholder')
        $('.section-category').removeClass('placeholder')
        $('.gallery-product .swiper-wrapper').removeClass('placeholder')
        $('.gallery-product swiper-slide').removeClass('placeholder')
        $('.box-name-product').removeClass('placeholder')
        $('.price').removeClass('placeholder')
        $('.box-info-details').removeClass('placeholder')
        $('.box-action').removeClass('placeholder')
        $('.total-sold').removeClass('placeholder')
        $('.total-review').removeClass('placeholder')
        $('.review').removeClass('placeholder')
    }
}

