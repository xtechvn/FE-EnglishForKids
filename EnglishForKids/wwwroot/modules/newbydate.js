$(document).ready(function () {
    _load_new_date.loadnew()

})
var _new_html = '<a href="{link}">{title}</a>';

var _load_new_date = {
    loadnew: function () {
        $.ajax({
            url: "/News/GetNewsByDate",
            type: 'post',
            data: {},
            success: function (result) {
                if (result.status == 0 && result.data != null) {
                    $('#New_newDate').html(_new_html.replace('{link}', "/News/NewsDetails/" + result.data.id).replace('{title}', result.data.title))
                }
            },

        });
    }
}
