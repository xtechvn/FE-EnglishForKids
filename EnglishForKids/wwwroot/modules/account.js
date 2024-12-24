$(document).ready(function () {
    account.Initialization()
})
var account = {
    Initialization: function () {
        if ($('#forgot-password-change').length > 0) {
            account.DynamicBindChangePassword()
        }
        else {
            account.RenderHTML()
            account.DynamicBind()
        }
      
		//window.onload = function () {
  //   google.accounts.id.initialize({
  //   client_id: THIRDPARTY_CONSTANTS.GSI.ClientID,
  //       callback: this.GoogleSignIn
  //    });
  //          google.accounts.id.prompt();
  //      }
        //FB.init({
        //    appId: THIRDPARTY_CONSTANTS.Facebook.AppId,
        //    xfbml: true,
        //    version: THIRDPARTY_CONSTANTS.Facebook.Version
        //});  
    },
    DynamicBindChangePassword: function () {
        var notification_empty ='Vui lòng không để trống'
        var notification_diffirent ='Mật khẩu và Xác nhận mật khẩu phải giống nhau'
        $("body").on('click', "#change-password-confirm", function () {
            var request = {
                "token": $('#forgot-password-change').attr('data-token'),
                "password": $('#forgot-password-change .new-password input').val(),
                "confirm_password": $('#forgot-password-change .confirm-new-password input').val()
            }
            if (request.password == null || request.password.trim() == '') {
                $('.new-password .err').html(notification_empty)
                $('.new-password .err').show()
                return
            }
            if (request.confirm_password == null || request.confirm_password.trim() == '') {
                $('.confirm-new-password .err').html(notification_empty)
                $('.confirm-new-password .err').show()
                return
            }
            if (request.password != request.confirm_password) {
                $('.confirm-new-password .err').html(notification_diffirent)
                $('.confirm-new-password .err').show()
                return
            }
            $.when(
                global_service.POST(API_URL.ChangePassword, request)
            ).done(function (res) {
                if (res.is_success == true) {
                    $('#success h4').html(res.msg)
                    $('#success').addClass('overlay-active')
                    $('#change-password-confirm input').val('')
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000);
                }
                else {
                    $('.confirm-new-password .err').html(res.msg)
                    $('.confirm-new-password .err').show()
                }
            })
        });
        $("body").on('keyup', "#change-password-confirm input", function () {
            $('.confirm-new-password .err').hide()
            $('.new-password .err').hide()
        });
    },
    RenderHTML: function () {
        $('.err').hide()
        var usr = global_service.CheckLogin()
        if (usr) {
            if (usr.token == null || usr.token == undefined) {
                account.Logout()
            }
            $('#client-account-name').html(usr.name +' '/*+ `<a href="javascript:;" id="account-logout"> [ Đăng xuất ]</a>`*/)
            $('#client-account-name').closest('a').attr('href', '/order')
            $('.right-mainheader .client-login').removeAttr('data-id')
            $('.right-mainheader .client-login').addClass('client-logged')
            $('.right-mainheader .client-login').removeClass('client-login')

        }
        $('#dangky .email input').addClass('no-requirement')
    },
    DynamicBind: function () {
        $("body").on('focusout', "#dangnhap input, #dangky input", function () {
            var element = $(this)

            if (element.hasClass('no-requirement') && (element.val() == undefined || element.val().trim() == '')) {
                element.closest('.form-group').find('.err').show()
            }

        });
        $("body").on('focusin', "#dangnhap input, #dangky input", function () {
            var element = $(this)
            element.closest('.form-group').find('.err').hide()
            element.closest('.form-group').find('.err').html(NOTIFICATION_MESSAGE.EmptyField)
        });
        $("body").on('click', "#btn-client-login", function () {
            account.Login()
        });
        $("body").on('click', "#account-logout", function () {
            account.Logout()
        });
        $("body").on('click', "#logout-action", function () {
            $('#dangxuat').addClass('overlay-active')
        });
        $("body").on('click', "#btn-client-register", function () {
            account.Register()
        });
        $("body").on('click', ".ghinho", function () {
            var element = $(this)
            if (element.find('input').is(':checked')) {
                element.find('input').prop('checked', false);
            } else {
                element.find('input').prop('checked', true);
            }
        });

        $("body").on('click', ".btn-login-gg", function () {
            document.querySelector('.g_id_signin div[role=button]').click();

        });
        $("body").on('click', ".btn-login-fb", function () {
            FB.getLoginStatus(function (response) {
                FacebookLogin();

            });
        });
        $("body").on('keyup', "#forgot-password-email", function () {
            $("#forgot-password-email").closest('.box-email').find('.err').hide()

        });
        $("body").on('click', ".forgot-pass", function () {
            $('#quenmk').addClass('overlay-active')
        });
        $("body").on('click', "#forgot-password-btn", function () {
            account.ConfirmForgotPassword()

        });
    },
    Login: function () {
        var element = $('#btn-client-login')
        if (account.ValidateLogin()) {
            $(':input[type="submit"]').prop('disabled', true);
            element.html('Vui lòng chờ ....')
            element.prop("disabled", true);
            var request = {
                "user_name": $('#dangnhap .user input').val(),
                "password": $('#dangnhap .password input').val(),
                "remember_me": $('#dangnhap .checkbox').is(":checked"),
                "token": '',
                "type": 1
            }
            $.when(
                global_service.POST(API_URL.Login, request)
            ).done(function (res) {
                if (res.is_success) {
                    if ($('#dangnhap .checkbox').is(":checked")) {
                        localStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
                    } else {
                        sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
                    }
                    window.location.reload()
                }
                else {
                    $(':input[type="submit"]').prop('disabled', false);

                    $('#dangnhap .user input').closest('.form-group').find('.err').show()
                    $('#dangnhap .user input').closest('.form-group').find('.err').html(NOTIFICATION_MESSAGE.LoginIncorrect)
                    element.html('Đăng nhập')
                    element.prop("disabled", false);

                }

            })
          
        }
    },
    Logout: function () {
        localStorage.removeItem(STORAGE_NAME.Login)
        sessionStorage.removeItem(STORAGE_NAME.Login)
        window.location.href='/'
    },
    Register: function () {
        var element = $('#btn-client-register')
        if (account.ValidateRegister()) {
            element.html('Vui lòng chờ ....')
            $(':input[type="submit"]').prop('disabled', true);
            $('.err-gg-account').hide()
            var token = $('#register-detail').attr('data-token') == undefined ? '' : $('#register-detail').attr('data-token')
            var request = {
                "user_name": $('#dangky .user input').val(),
                "email": $('#dangky .email input').val(),
                "phone": $('#dangky .tel input').val(),
                "password": $('#dangky .register-password input').val(),
                "confirm_password": $('#dangky .confirm-password input').val(),
                "is_receive_email": $('#dangky .checkbox').is(":checked"),
                "token": token,
                "type": parseInt($('#register-detail').attr('data-type'))
            }
            $.when(
                global_service.POST(API_URL.Register, request)
            ).done(function (res) {
                if (res.is_success) {
                    $('.client-login-popup').removeClass('overlay-active')
                    $('#success').addClass('overlay-active')
                    setTimeout(() => {
                        if ($('#dangnhap .checkbox').is(":checked")) {
                            localStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data.data))
                        } else {
                            sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data.data))
                        }
                        window.location.reload()
                    }, 2000);
                }
                else {
                    $(':input[type="submit"]').prop('disabled', false);
                    if (res.data.msg.toLowerCase().includes('email')) {
                        $('#dangky .email input').closest('.form-group').find('.err').show()
                        $('#dangky .email input').closest('.form-group').find('.err').html(res.data.msg)
                    } else {
                        $('#dangky .user input').closest('.form-group').find('.err').show()
                        $('#dangky .user input').closest('.form-group').find('.err').html(res.data.msg)
                    }
                   
                    element.html('Đăng ký')

                }

            })
        }
    },
    ValidateLogin: function () {
        var success = true
        var element = $('#dangnhap .user input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.form-group').find('.err').show()
            success = false

        }
        //if (!success) return success
        element = $('#dangnhap .password input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.form-group').find('.err').show()
            success = false

        }
        //if (!success) return success

        return success
    },
    ValidateRegister: function () {
        var password_length = 6

        var success = true
        var element = $('#dangky .user input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.form-group').find('.err').show()
            success = false

        }
        //if (!success) return success
        element = $('#dangky .email input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.form-group').find('.err').show()
            success = false

        }
        else if (element.val() != undefined && element.val().trim() != '') {
            var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
            if (!pattern.test(element.val())) {
                element.closest('.form-group').find('.err').html(NOTIFICATION_MESSAGE.EmailInCorrect)
                element.closest('.form-group').find('.err').show()
                success = false
            }
        }
        //if (!success) return success

        element = $('#dangky .tel input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.form-group').find('.err').show()
            success = false

        }
        else if (element.val() != undefined && element.val().trim() != '') {
            var pattern = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
            if (!pattern.test(element.val())) {
                element.closest('.form-group').find('.err').html(NOTIFICATION_MESSAGE.PhoneNotCorrect)
                element.closest('.form-group').find('.err').show()
                success = false
            }
        }
        //if (!success) return success

        element = $('#dangky .register-password input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.form-group').find('.err').show()
            success = false
        }
        else if (element.val().length < password_length) {
            element.closest('.form-group').find('.err').html(NOTIFICATION_MESSAGE.PasswordTooShort.replace('{count}', password_length))
            element.closest('.form-group').find('.err').show()
            success = false
        }
        //if (!success) return success

        element = $('#dangky .confirm-password input')
        if (element.val() == undefined || element.val().trim() == '') {
            element.closest('.form-group').find('.err').show()
            success = false
        }
        else if (element.val() != $('#dangky .password input').val()) {
            element.closest('.form-group').find('.err').html(NOTIFICATION_MESSAGE.PasswordConfirmNotEqual)
            element.closest('.form-group').find('.err').show()
            success = false
        }
        //if (!success) return success
        return success
    },
   

    GoogleSignOut: function () {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    },

    ThirdPartyRegister: function (email, password, token, name, type) {
        $('.client-login-popup').removeClass('overlay-active')
        $('#dangky').addClass('overlay-active')
        $('#dangky .user input').val(name)
        $('#dangky .email input').val(email)
        $('#dangky .register-password input').val('')
        $('#dangky .confirm-password input').val('')
        $('#register-detail').attr('data-type', type)
        $('#register-detail').attr('data-token', token)

        $('#dangky .scroll-form').prepend(HTML_CONSTANTS.GoogleAccountNotRegistered)
    },
    ThirdPartyLogin: function (email, password, token,name,type) {
        var request = {
            "user_name": email,
            "password": password,
            "remember_me": true,
            "token":token,
            "type": type
        }
        $.when(
            global_service.POST(API_URL.Login, request)
        ).done(function (res) {
            if (res.is_success) {
                if ($('#dangnhap .checkbox').is(":checked")) {
                    localStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
                } else {
                    sessionStorage.setItem(STORAGE_NAME.Login, JSON.stringify(res.data))
                }
                window.location.reload()
            }
            else  {
                account.ThirdPartyRegister(email, password, token, name, type)
            }

        })
    },
    ConfirmForgotPassword: function () {
        var validate = account.ValidateForgotPassword()
        if (validate) {
            var request = {
                "name": $("#forgot-password-email").val()
            }
            $.when(
                global_service.POST(API_URL.ClientForgotPassword, request)
            ).done(function (res) {
                $('#quenmk').removeClass('overlay-active')
                $('#dangnhap').removeClass('overlay-active')
                $('#success h4').html(res.msg)
                $('#success').addClass('overlay-active')
                $('#forgot-password-email').val('')

            })
        }
    },
    ValidateForgotPassword: function () {
        var validate=true
        var email = $("#forgot-password-email").val();
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        validate = emailPattern.test(email)
        if (!validate) {
            $("#forgot-password-email").closest('.box-email').find('.err').show()
        }
        return validate
    }
}
window.GoogleSignIn = (response) => {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    var google_user = global_service.DecodeGSIToken(response.credential);
    //console.log("ID: " + google_user.sub);
    //console.log('Full Name: ' + google_user.name);
    //console.log('Given Name: ' + google_user.given_name);
    //console.log('Family Name: ' + google_user.family_name);
    //console.log("Image URL: " + google_user.picture);
    //console.log("Email: " + google_user.email);

    //var profile = googleUser.getBasicProfile();
    //var id_token = googleUser.getAuthResponse().id_token;
    //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //console.log('Token: ' + id_token);
    //console.log('Name: ' + profile.getName());
    //console.log('Image URL: ' + profile.getImageUrl());
    //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    
    account.ThirdPartyLogin(google_user.email, '', google_user.sub, google_user.name, 2);
  
}


//function FacebookLogin() {
//    FB.login(function (response) {
//        if (response.authResponse) {
//            FB.api('/me', function (response) {
//                account.ThirdPartyLogin(response.email, '', response.id,response.name, 3);

//            });
//        } else {
//            console.log('User cancelled login or did not fully authorize.');
//        }
//    }, { scope: 'email' });
//}