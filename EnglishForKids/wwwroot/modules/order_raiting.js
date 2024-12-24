$(document).ready(function () {

})
var order_raiting = {
    Initialization: function () {
    },
    InitializationPopup: function (order_detail) {
        $('#danhgia').removeClass('overlay-active')
        order_raiting.DynamicBind()
        sessionStorage.setItem(STORAGE_NAME.OrderDetail, JSON.stringify(order_detail))
        order_raiting.RenderPopupReview(order_detail)
    },
    DynamicBind: function () {
        $("body").on('click', "#danhgia .btn-cancel", function () {
            $('#danhgia').removeClass('overlay-active')
            var json_str = sessionStorage.getItem(STORAGE_NAME.OrderDetail)
            if (json_str) {
                order_raiting.RenderPopupReview(JSON.parse(json_str))
            }
        });
        $("body").on('click', "#danhgia .btn-review", function () {
            $('#danhgia').addClass('overlay-active')
        });
        $("body").on('click', "#danhgia .star-number", function () {
            var element = $(this)
            order_raiting.RenderStar(element)
        });
        $('body').on('change', '.image_input', function () {
            var element = $(this)
            order_raiting.RenderReviewMedia(element)


        });
        $("body").on('click', "#danhgia .review-img .del", function () {
            var element = $(this)
            var parent_element = element.closest('.review-item')
            element.closest('.review-img').remove()
            order_raiting.RenderUploadImageCount(parent_element)

        });
        $("body").on('click', "#danhgia .review-video .del", function () {
            var element = $(this)
            var parent_element = element.closest('.review-item')
            element.closest('.review-video').remove()
            order_raiting.RenderUploadImageCount(parent_element)

        });
        $("body").on('click', "#danhgia .btn-confirm", function () {
            order_raiting.Confirm()
        });
    },
    RenderPopupReview: function (order_detail) {
        if (order_detail != undefined) {
            var html=''
            $(order_detail.data_order.carts).each(function (index, item) {
                html += HTML_CONSTANTS.OrderDetailRaiting.Item
                    .replaceAll('{img}', global_service.CorrectImage(item.product.avatar))
                    .replaceAll('{name}', item.product.name)
                    .replaceAll('{variation_detail}', order_raiting.RenderVariationDetail(item.product))
                    .replaceAll('{product_id}', item.product._id)

            })
            $('#danhgia .list-product-rate').html(html)
        }
    },
    RenderVariationDetail: function (product) {
        var html_sub_attr=''
        $(product.variation_detail).each(function (index_variation_attributes, variation_attributes_item) {
            var attribute = product.attributes.filter(obj => {
                return obj._id == variation_attributes_item.id
            })
            var attribute_detail = product.attributes_detail.filter(obj => {
                return (obj.attribute_id == variation_attributes_item.id && obj.name == variation_attributes_item.name)
            })
            if (attribute != null && attribute.length > 0 && attribute[0].img != null && attribute[0].img != undefined && attribute[0].img.trim() != '') {
                sub_attr_img.push(attribute[0].img)
            }
            if (attribute_detail != null && attribute_detail.length > 0 && attribute_detail[0].img != null && attribute_detail[0].img != undefined && attribute_detail[0].img.trim() != '') {
                sub_attr_img.push(attribute_detail[0].img)
            }
            if (attribute != null && attribute.length > 0 && attribute_detail != null && attribute_detail.length > 0)
                html_sub_attr += '' + attribute[0].name + ': ' + attribute_detail[0].name
            if (index_variation_attributes < ($(product.attributes_detail).length - 1)) {
                html_sub_attr += '<br /> '
            }

        })
        return html_sub_attr
    },
    RenderStar: function (element) {
        var parent = element.closest('.rate')
        parent.removeClass('one')
        parent.removeClass('two')
        parent.removeClass('three')
        parent.removeClass('four')
        parent.removeClass('five')
        var class_name = element.attr('data-class')
        var label_by_star = 'Tuyệt vời'
        var star=1
        switch (class_name) {
            case 'one': {
                label_by_star = 'Tệ'
                star = 1
            } break;
            case 'two': {
                label_by_star = 'Không hài lòng'
                star = 2
            } break;
            case 'three': {
                label_by_star = 'Bình thường'
                star = 3
            } break;
            case 'four': {
                label_by_star = 'Hài lòng'
                star = 4
            } break;
            case 'five': {
                label_by_star = 'Tuyệt vời'
                star = 5
            } break;
        }
        parent.addClass(class_name)
        parent.find('.star-label').html(label_by_star)
        parent.closest('.star').attr('data-value', star)
        debugger
    },
    RenderReviewMedia: function (element) {
        var parent_element = element.closest('.review-item').find('.wrap-img-upload')
        element.closest('.review-item').find('.error').hide()
        var max_item = GLOBAL_CONSTANTS.OrderReviewCreate.MaxImage

        switch (element.attr('data-type')) {
            case 'images': {
                 max_item = GLOBAL_CONSTANTS.OrderReviewCreate.MaxImage
                if (parent_element.find('.review-img').length >= max_item) {
                    order_raiting.NotifyFailed(element.closest('.review-item'), 'Số lượng ảnh vượt quá giới hạn')
                    element.val(null)
                }
                else {
                    if ($.inArray(element.val().split('.').pop().toLowerCase(), GLOBAL_CONSTANTS.OrderReviewCreate.ImageExtension) == -1) {
                        order_raiting.NotifyFailed(element.closest('.review-item'), "Vui lòng chỉ upload các định dạng sau: " + GLOBAL_CONSTANTS.OrderReviewCreate.ImageExtension.join(', '));
                        return
                    }
                    if ((parent_element.find('.review-img').length + element[0].files.length) > max_item) {
                        order_raiting.NotifyFailed(element.closest('.review-item'), 'Số lượng ảnh vượt quá giới hạn')
                        element.val(null)
                    }
                    $(element[0].files).each(function (index, item) {
                        var size = item.size;
                        if (size > GLOBAL_CONSTANTS.OrderReviewCreate.MaxImageSize) {
                            order_raiting.NotifyFailed(element.closest('.review-item'), "Dung lượng ảnh vượt quá mức tối đa: " + (parseFloat(GLOBAL_CONSTANTS.OrderReviewCreate.MaxImageSize / 1024 / 1024)) + "MB. Vui lòng tải lên tập tin nhỏ hơn");
                        } else {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                parent_element.prepend(HTML_CONSTANTS.OrderDetailRaiting.ReviewImage.replaceAll('{src}', e.target.result))
                                order_raiting.RenderUploadImageCount(parent_element)
                                element.closest('.review-item').find('.upload-file').hide()
                                parent_element.show()
                            }
                            reader.readAsDataURL(item);
                        }
                      
                    });
                    element.val(null)

                }
            } break
            case 'videos': {
                 max_item = GLOBAL_CONSTANTS.OrderReviewCreate.MaxVideo
                if (parent_element.find('.review-video').length >= max_item) {
                    order_raiting.NotifyFailed(element.closest('.review-item'), 'Số lượng video vượt quá giới hạn')
                    element.val(null)
                }
                else {
                    if ($.inArray(element.val().split('.').pop().toLowerCase(), GLOBAL_CONSTANTS.OrderReviewCreate.VideoExtension) == -1) {
                        order_raiting.NotifyFailed(element.closest('.review-item'), "Vui lòng chỉ upload các định dạng sau: " + GLOBAL_CONSTANTS.OrderReviewCreate.VideoExtension.join(', '));

                        return
                    }
                    $(element[0].files).each(function (index, item) {
                        var size = item.size;
                        if (size > GLOBAL_CONSTANTS.OrderReviewCreate.MaxVideoSize) {
                            order_raiting.NotifyFailed(element.closest('.review-item'), "Dung lượng video vượt quá mức tối đa: " + (parseFloat(GLOBAL_CONSTANTS.OrderReviewCreate.MaxVideoSize / 1024 / 1024)) + "MB. Vui lòng tải lên tập tin nhỏ hơn");

                        }
                        else {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                parent_element.prepend(HTML_CONSTANTS.OrderDetailRaiting.ReviewVideo.replaceAll('{src}', e.target.result).replaceAll('{id}', '-1'))
                                order_raiting.RenderUploadImageCount(parent_element)
                                element.closest('.review-item').find('.upload-file').hide()
                                parent_element.show()
                            }
                            reader.readAsDataURL(item);
                        }
                      
                    });
                    element.val(null)

                }

            } break
        }
    },
    RenderUploadImageCount: function (parent_element) {
        var image_count = parent_element.find('.review-img').length
        var video_count = parent_element.find('.review-video').length
        if ((image_count + video_count) < 1) {
            parent_element.find('.upload-file').show()
            parent_element.find('.wrap-img-upload').hide()
        }
        parent_element.find('.uploadIMG').find('.count').html(parent_element.find('.review-img').length)
        parent_element.find('.uploadVIDEO').find('.count').html(parent_element.find('.review-video').length)
    },
    NotifyFailed: function (parent_element, description) {
        parent_element.find('.error').html(description)
        parent_element.find('.error').show()
    },
    Confirm: function () {
        var token=''
        var usr = global_service.CheckLogin()
        if (usr)  token = usr.token
        $('#danhgia .review-item').each(function (index, item) {
            var element=$(this)
            var request = {
                "order_id": $('#order-detail').val(),
                "product_id": element.attr('data-product-id'),
                "token": token,
                "star": element.find('.star').attr('data-value'),
                "comment": element.find('textarea').val(),
                "img_link":'',
                "video_link":'' ,
            }
            debugger
            var images=[]
            element.find('.review-img').each(function (index, item) {
                var element_image = $(this)
                if (element_image.find('img').length > 0) {
                    //model.images.push(element_image.find('img').attr('src'))
                    var data_src = element_image.find('img').attr('src')
                    if (data_src == null || data_src == undefined || data_src.trim() == '') return true
                    if (order_raiting.CheckIfImageVideoIsLocal(data_src)) {
                        var result = global_service.POSTSynchorus(API_URL.OrderRaitingUploadImage, { data_image: data_src })
                        if (result != undefined && result.data != undefined && result.data.trim() != '') {
                            images.push(result.data)
                        }
                    }
                }
            })
            request.img_link = images.join(',')
            var videos = []
            element.find('.review-video').each(function (index, item) {
                var element_image = $(this)
                //model.videos.push(element_image.find('video').find('source').attr('src'))
                var data_src = element_image.find('video').find('source').attr('src')
                if (data_src == null || data_src == undefined || data_src.trim() == '') return true
                if (order_raiting.CheckIfImageVideoIsLocal(data_src)) {
                    const byteCharacters = atob(data_src.split('base64,')[1]);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "video/mp4" });

                    //// Create a FormData object to send via AJAX
                    var formData = new FormData();
                    formData.append('request', blob, 'video.mp4'); // Append the Blob as a file
                   
                    //var result = global_service.POSTSynchorus(API_URL.OrderRaitingUploadVideo, { request: formData })
                    var result = global_service.POSTFileSynchorus(API_URL.OrderRaitingUploadVideo, formData)

                    if (result != undefined && result.data != undefined && result.data.trim() != '') {
                        videos.push(result.data)
                    } 
                } 

            })
            request.video_link = videos.join(',')
            $.when(
                global_service.POST(API_URL.OrderRaitingSubmmit, request)
            ).done(function (result) {

            })

        })
        $('#danhgia').removeClass('overlay-active')
        $('#thanhcong .content p').html('Đánh giá sản phẩm thành công')
        $('#thanhcong').addClass('overlay-active')
    },
    CheckIfImageVideoIsLocal: function (data) {
        if (data.includes("data:image") || data.includes("data:video") || data.includes("base64,")) {
            return true
        }
        else {
            return false
        }
    },

}