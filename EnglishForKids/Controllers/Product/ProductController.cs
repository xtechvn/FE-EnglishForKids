//using EnglishForKids.Controllers.Product.Service;
//using EnglishForKids.Models.Products;
//using EnglishForKids.Service.Redis;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Caching.Memory;

//namespace EnglishForKids.Controllers.Product
//{
//    public class ProductController : Controller
//    {
//        private readonly IConfiguration configuration;
//        private readonly RedisConn redisService;
//        private readonly ProductsService productsService;
//        private readonly IMemoryCache _cache; // Inject IMemoryCache

//        public ProductController(IConfiguration _configuration, RedisConn _redisService, IMemoryCache cache)
//        {
//            configuration = _configuration;
//            redisService = _redisService;
//            productsService=new ProductsService(_configuration, redisService);
//            _cache = cache;
//        }

//        /// <summary>
//        ///Sản phẩm nổi bật
//        /// </summary>
//        /// <returns></returns>
//        [HttpPost]
//        public IActionResult loadProductTopComponent(long group_product_id)
//        {
//            try
//            {  
//                return ViewComponent("ProductList");
//            }
//            catch (Exception ex)
//            {
//                // Ghi log lỗi nếu cần             
//                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
//            }
//        }
//        [HttpGet("san-pham/{title}-{product_code}.html")]
//        public async Task<ActionResult> Detail(string title, string product_code)
//        {
//            var request = new ProductDetailRequestModel
//            {
//                id = product_code
//            };
//            var obj_detail = await productsService.GetProductDetail(request);
//            ViewBag.ProductCode = product_code;
//            return View(obj_detail);

//        }

//        [HttpGet("nganh-hang/{group_product_name}/{group_product_id}")]
//        public async Task<ActionResult> getListGroupProduct(string group_product_name, int group_product_id)
//        {
//            try
//            {                

//                ViewBag.group_product_parent_id = group_product_id;
//                return View("~/Views/Product/GroupProductList.cshtml");
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi                
//            }
//        }
//        /// <summary>
//        /// Load thông tin sản phẩm
//        /// </summary>
//        /// <param name="request"></param>
//        /// <returns></returns>
//        //public async Task<IActionResult> ProductDetail(ProductDetailRequestModel request)
//        //{
            
//        //    // Nếu không có trong cache, gọi dịch vụ
//        //    var cacheKey = "product_detail_" + request.id; // Đặt khóa cho cache
//        //    if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
//        //    {
//        //        cached_view = await productsService.GetProductDetail(request);
//        //        if (cached_view != null)
//        //        {
//        //            // Lưu vào cache với thời gian hết hạn 
//        //            _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(60));
//        //        }
//        //    }
//        //    return View(cached_view);
//        //}
       
//        /// <summary>
//        /// Load các biến thể
//        /// </summary>
//        /// <param name="request"></param>
//        /// <returns></returns>
//        public async Task<IActionResult> GetProductDetail(ProductDetailRequestModel request)
//        {
//            if (request != null)
//            {
//                // Nếu không có trong cache, gọi dịch vụ
//                var cacheKey = "product_detail_" + request.id; // Đặt khóa cho cache
//                if (!_cache.TryGetValue(cacheKey, out var cached_view)) // Kiểm tra xem có trong cache không
//                {
//                    cached_view = await productsService.GetProductDetail(request);
//                    if (cached_view != null)
//                    {
//                        // Lưu vào cache với thời gian hết hạn 
//                        _cache.Set(cacheKey, cached_view, TimeSpan.FromSeconds(20));
//                    }
//                }

//                return Ok(new
//                {
//                    is_success = cached_view != null,
//                    data = cached_view
//                });
//            }
//            else
//            {
//                return Ok(new
//                {
//                    is_success = false,
//                    data = ""
//                });
//            }
//        }

//        [HttpGet("/san-pham/tim-kiem")]
//        public async Task<IActionResult> search(string p)
//        {
//            // Nếu không có trong cache, gọi dịch vụ
//            ViewBag.keyword = string.IsNullOrEmpty(p) ? "": p;
//            var data_result = await productsService.Search(p);

//            return View(data_result);
//        }

//        [HttpPost("render-product-history.json")]
//        public async Task<IActionResult> renderProductHistory(string j_data)
//        {
//            try
//            {               
//                return ViewComponent("ProductHistory", j_data);
//            }
//            catch (Exception ex)
//            {              
//                return Content("");
//            }
//        }

//    }
//}
