using EnglishForKids.Controllers.Home.Service;
using EnglishForKids.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace EnglishForKids.ViewComponents.GroupProduct
{
    public class GroupProductViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn _redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        public GroupProductViewComponent(IConfiguration _Configuration, RedisConn redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            _redisService = redisService;
            _cache = cache;
        }

        /// <summary>
        // Nhóm san pham vị trí giữa trang
        /// </summary> group_product_parent_id: là id menu cha
        /// <returns>view_name: tên view trong shared/components</returns>
        public async Task<IViewComponentResult?> InvokeAsync(int group_product_parent_id, string view_name)
        {
            try
            {
                // Nếu không có trong cache, gọi dịch vụ
                var cacheKey = "group_product_" + group_product_parent_id; // Đặt khóa cho cache
                if (!_cache.TryGetValue(cacheKey, out var cached_data_view)) // Kiểm tra xem có trong cache không
                {
                    var objMenu = new MenuService(configuration, _redisService);
                    cached_data_view = await objMenu.getListMenu(group_product_parent_id); //(Convert.ToInt32(configuration["menu:group_product_parent_id"]));
                    if (cached_data_view != null)
                    {
                        // Lưu vào cache với thời gian hết hạn 60 giây
                        _cache.Set(cacheKey, cached_data_view, TimeSpan.FromSeconds(60));
                    }
                }
                return View(view_name,cached_data_view);
            }
            catch (Exception)
            {
                return Content("");
            }
        }
    }
}
