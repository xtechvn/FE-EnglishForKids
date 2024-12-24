$(document).ready(function () {
    var Path = window.location.href;
    var GetUrl = _support.extractValues(Path);
    var IdPath = (GetUrl != null && GetUrl.length == 2) ? _support.extractValues(Path)[1] : null;

    if (/^\d+$/.test(IdPath) && Path.match('/chinh-sach/')) {
        $.ajax({
            url: "/Support/GetCategoryById",
            type: 'post',
            data: { id: IdPath },
            success: function (data) {
                NamePath = data.name;
                if (NamePath != null) {
                    _support.GetBodyArticle(IdPath, NamePath);
                }
            }
        })
    }
    else if ((Path.match('/chinh-sach/') || Path.match('/cham-soc-khach-hang'))) {
        _support.GetMenuPolicy().then(() => {
            var IdDefault = $('#IDdefaultOption').text();
            var UrlDefault = $('#NamedefaultOption').text();
            _support.GetBodyArticle(IdDefault, UrlDefault);
        });
    }
    else if (Path.match('/questions/')) {
        _support.GetBodyQuestion(IdPath);
    }


    $("#search-input").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            _support.SearchQuestion();
        }
    });

    var lst_IdCate = "";
    $.ajax({
        url: "/Support/GetCategories",
        type: 'post',
        data: null,
        success: function (rs) {
            rs.forEach(item => {
                if (lst_IdCate) {
                    lst_IdCate = lst_IdCate + "," + item.id;
                }
                else {
                    lst_IdCate = lst_IdCate + item.id;
                }
            });
            lst_IdCate = lst_IdCate + ",28";//Add id of Common Question to ListId
            sessionStorage.setItem("list_idCate", lst_IdCate);
        },

    });


    window.onpopstate = function (event) {
        var currentPath = window.location.href;
        IdPath = _support.extractValues(currentPath)[1];
        if (/^\d+$/.test(IdPath) && IdPath != null) {


            if (currentPath.match('/chinh-sach/')) {
                $.ajax({
                    url: "/Support/GetCategoryById",
                    type: 'post',
                    data: { id: IdPath },
                    success: function (data) {
                        var NamePath = !data ? null : data.name;
                        _support.GetMenuPolicy().then(() => {
                            _support.GetBodyArticle(IdPath, NamePath);
                        });

                    }
                })

            }
            else if (currentPath.match('/questions/')) {
                _support.GetBodyQuestion(IdPath);
            }

        }
    };

   
})

var _support =
{
    GetMenuPolicy: function () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/Support/GetCategories",
                type: 'post',
                data: null,
                success: function (data) {
                    if (data != null) {
                        // Tạo HTML bằng template literals
                        const html = data.map(item => `
                        <li class="Option-load" id="Selected-${item.id}" onclick="_support.GetBodyArticle('${item.id}','${item.name}')">
                            <a>${item.name}</a>
                        </li>
                    `).join('');

                        // Cập nhật DOM
                        $(".list-faq").html(`
                        <div id="IDdefaultOption" style="display:none">${data[0].id}</div>
                        <div id="NamedefaultOption" style="display:none">${data[0].name}</div>
                        ${html}
                    `);

                        resolve();
                    } else {
                        reject('Data is null');
                    }
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    },
    GetMenuByID: function (id) {
        $.ajax({
            url: "/Support/GetCategoryById",
            type: 'post',
            data: { id: id },
            success: function (data) {
                return data;
            }
        })
    }
    ,
    GetBodyArticle: function (id, urlname) {
        var SelectedElement = document.getElementById("Selected-" + id);
        $(".Option-load").removeClass('active');
        SelectedElement.classList.add('active');
        $.ajax({
            url: "/Support/GetListByCategoryID",
            type: 'post',
            data: { id: id},
            success: function (data) {
                var currentPath = window.location.href;
                var PathNext = "/chinh-sach/" + global_service.convertVietnameseToUnsign(urlname) + "-" + id;
                if (!currentPath.includes(PathNext) ) {
                    window.history.pushState('string', '', "/chinh-sach/" + global_service.convertVietnameseToUnsign(urlname) + "-" + id) 
                }
                $(".content-policy").html('');
                if (data.length > 0) {
                    $(".content-policy").append(`<h2 style="margin-bottom:20px">${urlname}</h2>`);
                    data.forEach(item => {

                        $(".content-policy").append(`
                    <div class="item">
                    <h3 class="title-faq title${item.id}" onclick="_support.DisplayHiddenContent('${item.id}')">${item.title}</h3>
                    <div class="answer content${item.id}" style="margin-left:20px;margin-bottom:20px">
                        ${item.body}
                    </div>
                </div>`);
                    });
                }
                else {
                    $(".content-policy").append(`
                    <h3 style="color:#3B56B4">Chưa có nội dung !</h3>`)
                }
            },

        });
    },
    DisplayHiddenContent: function (id) {
        let contentpolicy = $('.content' + id)
        let titlepolicy = $('.title' + id)
        if (!contentpolicy.hasClass('Hide-ContentPolicy') && !titlepolicy.hasClass('active')) {
            contentpolicy.addClass('Hide-ContentPolicy');
            titlepolicy.addClass('active');
        }
        else {
            contentpolicy.removeClass('Hide-ContentPolicy');
            titlepolicy.removeClass('active');
        }

    },
    GetBodyQuestion: function (id) {
        $.ajax({
            url: "/Support/GetBodyArticle",
            type: 'post',
            data: { id: id },
            success: function (data) {
                var currentPath = window.location.href;
                var PathNext = '/questions/' + global_service.convertVietnameseToUnsign(data.title) + '-' + id;
                if (!currentPath.includes(PathNext))
                {
                    window.history.pushState('string', '', "/questions/" + global_service.convertVietnameseToUnsign(data.title) + "-" + id)
                }
                if (data != null) {
                    $('.result-search').html('');
                    $(".content-policy").html('');
                    $(".left-content").html('');
                    $(".left-content").append(`
                    <ul class="list-faq" style="min-width:250px">

                        <li class="active">
                            <a >${data.title}</a>
                        </li>

                    </ul>`);
                    $(".content-policy").append(`<h2 id="title_policy" >${data.title}</h2>`)
                    $(".content-policy").append(`<div style="margin-top:10px">${data.lead}</h1>`)
                    $(".content-policy").append(`<div style="margin-top:10px">${data.body}</h1>`)
                }
            },

        });
    },

    SearchQuestion: function () {
        $('.result-search').html('');
        $('.result-search').html(`<h2>Đang tìm kiếm...</h2>`);
        var lst_Id = sessionStorage.getItem("list_idCate");
        var title = $('#search-input').val();
        var obj =
        {
            "title": title,
            "parent_cate_faq_id": lst_Id
        }
        $('.content-policy').html('');
        $('.left-content').html('');
        if (title == '') {
            window.location.href = '/cham-soc-khach-hang';
        }
        else {
            $.ajax({
                url: "/Support/FindAllArticleByTitle",
                type: 'post',
                data: { requestObj: obj },
                success: function (data) {
                    $('.result-search').html('');
                    let count = 0;
                    //dem ban ghi
                    if (data) {
                        data.forEach(item => {
                            count++;
                        });
                    }
                    if (count > 0) {
                        let notif = `<h2>có "${count} kết quả" tìm kiếm</h2>`;
                        $('.result-search').html(notif);

                        data.forEach(item => {
                            let html = `<p style="margin-top:15px" class="Option-load" onclick="_support.GetBodyQuestion('${item.id}')">${item.title}</p>`;
                            $('.result-search').append(html);
                        });
                    }
                    else {
                        $('.result-search').html(`<h2>Không tìm thấy kết quả tìm kiếm</h2>`);
                    }
                },

            });
        }
    },
    extractValues: function (str) {
        // Loại bỏ tất cả các ký tự đặc biệt ngoại trừ dấu gạch nối
        const cleanedStr = str.replace(/[^a-zA-Z0-9-]/g, '');

        // Tìm vị trí của dấu gạch ngang cuối cùng
        const lastDashIndex = cleanedStr.lastIndexOf('-');

        // Nếu không tìm thấy dấu gạch ngang, trả về null
        if (lastDashIndex === -1) {
            return null;
        }

        // Lấy phần chuỗi trước và sau dấu gạch ngang cuối cùng
        const part1 = cleanedStr.substring(0, lastDashIndex);
        const part2 = cleanedStr.substring(lastDashIndex + 1);

        return [part1, part2];
    },
    GotoSearchBox: function () {
        localStorage.setItem("focus", "aaa");
        window.location.href = '/cham-soc-khach-hang';
    },

    FocusOnSearch: function ()
    {
        if (localStorage.getItem("focus"))
        {
            $("#search-input").focus();
            localStorage.removeItem("focus");
        }
    },
}


