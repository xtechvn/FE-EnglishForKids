$(document).ready(function () {
    var Comment_Saved = sessionStorage.getItem("Saved_Input");
    if (Comment_Saved != null && Comment_Saved != '') {
        _feedback.CreateFeedbackAfterLogin();
    }
});


var _feedback =
{
    CreateFeedback: function () {
        sessionStorage.setItem("CreateFeedbackAction", 1);//Dùng để xác nhận hành động tạo feedback khi hành động đăng nhập chen ngang
        let comment = $('#comment-text').val();
        if (!comment) {
            var Invalid_Noti = document.getElementById("invalid-comment");
            Invalid_Noti.style.display = 'block';
            return;
        }
        else if (global_service.CheckLogin()) {
            var Invalid_Noti = document.getElementById("invalid-comment");
            Invalid_Noti.style.display = 'none';
            let Id = global_service.CheckLogin().token;
            $('.btn-Send').addClass('disabled');
            var obj =
            {
                "token": Id,
                "Content": comment
            }
            $.ajax({
                url: "/Support/CreateFeedback",
                type: 'post',
                data: { obj: obj },
                success: function (data) {
                    document.getElementById("Comment_success").classList.add('overlay-active');
                    
                    sessionStorage.setItem("Saved_Input", '');
                    sessionStorage.setItem("CreateFeedbackAction", 0);
                    $('.btn-Send').removeClass('disabled');
                    $('#comment-text').val('');
                    setTimeout(() => {
                        document.getElementById("Comment_success").classList.remove('overlay-active');
                    }, 3000);
                },
                error: function (xhr, status, error) {
                    sessionStorage.setItem("CreateFeedbackAction", 0);
                    location.reload();
                }
            });
        }
        else {
            $('.client-login').click();
            var Invalid_Noti = document.getElementById("invalid-comment");
            Invalid_Noti.style.display = 'none';
            var LoginForm = $('#dangnhap');
            var RegisterForm = $('#dangky');
            RegisterForm.removeClass('overlay-active');
            LoginForm.addClass('overlay-active');
            return;
        }
    },
    //tạo feedback trong trường hợp đã nhập nội dung sau đăng nhập(với điều kiện là phải nhấn vào nút gửi)
    CreateFeedbackAfterLogin: function () {
        let comment = sessionStorage.getItem("Saved_Input");
        const currentPath = window.location.pathname;
        let Id = global_service.CheckLogin().token;
        let CreateAction = sessionStorage.getItem("CreateFeedbackAction");
        if (comment && Id && CreateAction == 1 && currentPath.startsWith('/dong-gop-y-kien')) {
            var obj =
            {
                "token": Id,
                "Content": comment
            }
            $.ajax({
                url: "/Support/CreateFeedback",
                type: 'post',
                data: { obj: obj },
                success: function (data) {
                    document.getElementById("Comment_success").classList.add('overlay-active');
                    sessionStorage.setItem("Saved_Input", '');
                    sessionStorage.setItem("CreateFeedbackAction", 0);
                    setTimeout(() => {
                        document.getElementById("Comment_success").classList.remove('overlay-active');
                    }, 3000);
                },
                error: function (xhr, status, error) {
                    sessionStorage.setItem("CreateFeedbackAction", 0);
                    location.reload();
                }
            });
        }
        else
        {
            sessionStorage.setItem("Saved_Input", '');
            sessionStorage.setItem("CreateFeedbackAction", 0);
        }
    },
    //Lưu trữ content khi sự kiện textchange xảy ra
    SaveText: function () {
        let Comment_input = $('#comment-text').val();
        sessionStorage.setItem("Saved_Input", Comment_input);
    }
    ,
    CreateEmailPromotion: function () {
        let email_input = $('#Email-text').val();
        var obj =
        {
            "AccountClientId": '',
            "Content": '',
            "Email": email_input
        }
        if (email_input == null || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_input)) {
            document.getElementById("PromotionNoti").style.display = "block";
            document.getElementById("PromotionNoti").textContent = "Xin vui lòng nhập đúng định dạng Email!";
            setTimeout(() => {
                document.getElementById("PromotionNoti").style.display = 'none';
            }, 3000);
        }
        else {
            $.ajax({
                url: "/Support/CreateEmailPromotion",
                type: 'post',
                data: { obj: obj },
                success: function (data) {
                    document.getElementById("PromotionNoti").style.display = "block";
                    $('#Email-text').val('');
                    document.getElementById("PromotionNoti").textContent = "Chúng tôi đã nhận được Email của bạn!";
                    setTimeout(() => {
                        document.getElementById("PromotionNoti").style.display = 'none';
                    }, 3000);
                },

            });
        }
    }
}