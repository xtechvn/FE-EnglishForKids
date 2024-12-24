$(document).ready(function () {
    account_manage_global.Initialization()
})
var account_manage_global = {
    Initialization: function () {
        $('.content-left-user').addClass('placeholder')
        account_manage_global.DynamicBind()
        account_manage_global.Detail()

    },
    DynamicBind: function () {

    },
    Detail: function () {
        var usr = global_service.CheckLogin()
        if (usr == undefined ||  usr.token == undefined) {
            window.location.href = '/'
        }
        $('.box-quanlytaikhoan .avatar img').attr('src', usr.avatar == undefined ? '/images/img-search.png' : usr.avatar)
        $('.box-quanlytaikhoan .box-name .name').html(usr.name)
        $('.box-quanlytaikhoan .menu-left-user').removeClass('placeholder')
      
    },
}