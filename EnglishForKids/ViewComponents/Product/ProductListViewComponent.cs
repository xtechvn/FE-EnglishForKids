using EnglishForKids.Controllers.Home.Service;
using EnglishForKids.Controllers.Product.Service;
using EnglishForKids.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace EnglishForKids.ViewComponents.Product
{
    public class ProductListViewComponent: ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn _redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        private readonly ProductsService productsService; // Inject IMemoryCache
        public ProductListViewComponent(IConfiguration _Configuration, RedisConn redisService, IMemoryCache cache)
        {
            configuration = _Configuration;
            _redisService = redisService;
            _cache = cache;
            productsService = new ProductsService(_Configuration, redisService);
        }

        /// <summary>
        // load ra data sản phẩm theo nhóm
        /// </summary>
        /// <returns>group_product_id: id của nhóm</returns>
        public async Task<IViewComponentResult?> InvokeAsync(int _group_product_id, int _page_index, int _page_size, string view_name)
        {
            ViewBag.Static = configuration["common:link_static_img"];

            try
            {
                // Nếu không có trong cache, gọi dịch vụ
                var cacheKey = "product_list_" + _group_product_id + "_" + _page_index + _page_size; // Đặt khóa cho cache
                if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
                {
                    var objMenu = new ProductsService(configuration, _redisService);                   
                    cached_view = await productsService.getProductListByGroupProductId(_group_product_id, _page_index, _page_size);
                    if (cached_view != null)
                    {
                        // Lưu vào cache với thời gian hết hạn 
                        _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(20));
                    }
                }
                return View(view_name, cached_view);
            }
            catch (Exception)
            {
                return Content("");
            }
        }
    }
}
