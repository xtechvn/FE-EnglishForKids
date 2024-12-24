using EnglishForKids.Controllers.Course.Service;
using EnglishForKids.Controllers.News.Service;
using EnglishForKids.Models;
using EnglishForKids.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Reflection;

namespace EnglishForKids.ViewComponents.Article
{
    public class CourseListViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public CourseListViewComponent(IConfiguration _Configuration, RedisConn _redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            redisService = _redisService;
            _cache = cache;
        }

        /// <summary>       
        /// type_view = 0 : box footer trang chủ | 1: box news
        /// zone_info: là 1 chuỗi json dựa vào đây để hiển thị tin theo cấu hình
        /// </summary>
        /// <returns>Load cac bai viet theo chuyen muc</returns>
        public async Task<IViewComponentResult?> InvokeAsync(CategoryConfigModel _zone_info) //(int category_id,int top,int type_view)
        {
            try
            {
                var cacheKey = "CATEGORY_BOX_VIEW" + _zone_info.category_id + _zone_info.skip + _zone_info.take; //Cache view trang tin home

                if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
                {
                    var obj_cate = new CourseService(configuration, redisService);

                    // Tin theo chuyên mục
                    cached_view = await obj_cate.getListCourse(_zone_info.category_id, _zone_info.skip, _zone_info.take);

                    if (cached_view != null)
                    {
                        // Lưu vào cache với thời gian hết hạn dc set. 
                        _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(Convert.ToInt32(configuration["redis:cate_time_view:second_list_box_news"])));
                    }
                }
                return cached_view != null ? View(_zone_info.view_name, cached_view) : Content("");

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return Content("");
            }
        }
    }
}
