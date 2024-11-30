using EnglishForKids.Controllers.Product.Service;
using EnglishForKids.Models.Products;
using EnglishForKids.Service.Redis;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace EnglishForKids.ViewComponents.Product
{
    public class ProductHistoryViewComponent: ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn _redisService;
        private readonly IMemoryCache _cache; // Inject IMemoryCache
        private readonly ProductsService productsService; // Inject IMemoryCache
        public ProductHistoryViewComponent(IConfiguration _Configuration, RedisConn redisService, IMemoryCache cache)
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
        public async Task<IViewComponentResult?> InvokeAsync(string j_data)
        {
            try
            {                

                // Nếu không có trong cache, gọi dịch vụ
                var cacheKey = "product_list_history"; // Đặt khóa cho cache
                if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
                {
                    var objMenu = new ProductsService(configuration, _redisService);
                    cached_view = JsonConvert.DeserializeObject<List<ProductHistoryModel>>(j_data);
                    if (cached_view != null)
                    {
                        // Lưu vào cache với thời gian hết hạn 
                        _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(20));
                    }
                }
                return View("~/Views/Shared/Product/ProductHistoryViewComponent", cached_view);
            }
            catch (Exception)
            {
                return Content("");
            }
        }
    }
}
