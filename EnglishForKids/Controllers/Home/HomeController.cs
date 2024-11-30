using Microsoft.AspNetCore.Mvc;

namespace EnglishForKids.Controllers.Home
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration configuration;
        public HomeController(ILogger<HomeController> logger, IServiceProvider serviceProvider, IConfiguration _Configuration)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            configuration = _Configuration;
        }

        public IActionResult Index()
        {
            return View();
        }
        [Route("san-pham")]
        [HttpGet]
        public async Task<IActionResult> Product()
        {
            ViewBag.group_product_parent_id = -1;
            return View("~/Views/Product/GroupProductList.cshtml");
        }

        [Route("lien-he")]
        [HttpGet]
        public async Task<IActionResult> Contact()
        {
            return View();
        }

        [Route("gioi-thieu")]
        [HttpGet]
        public async Task<IActionResult> Intro()
        {
            return View();
        }

        [HttpPost]
        public IActionResult loadHeaderComponent()
        {
            try
            {
                // Gọi ViewComponent trực tiếp và trả về kết quả
                return ViewComponent("Header");
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                _logger.LogError(ex, "Error loading header component");
                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
            }
        }
        [HttpPost]
        public IActionResult loadFooterComponent()
        {
            try
            {
                // Gọi ViewComponent trực tiếp và trả về kết quả
                return ViewComponent("Footer");
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                _logger.LogError(ex, "Error loading header component");
                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
            }
        }
        /// <summary>

        /// Load danh sách nhóm 4 sản phẩm vị trí top
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult loadGroupProductComponent()
        {
            try
            {
                // Gọi ViewComponent trực tiếp và trả về kết quả
                return ViewComponent("GroupProduct", new { view_name = "~/Views/Shared/Components/GroupProduct/GroupProductTop.cshtml", group_product_parent_id = Convert.ToInt32(configuration["menu:group_product_parent_id"]) });
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                _logger.LogError(ex, "Error loading GroupProduct");
                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
            }
        }
        /// Load danh sách danh sách mục sản phẩm vị trí left
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult loadGroupProductLeftComponent(int group_product_parent_id)
        {
            try
            {                
                return ViewComponent("GroupProduct", new { view_name = "~/Views/Shared/Components/GroupProduct/GroupProductLeft.cshtml", group_product_parent_id = group_product_parent_id });
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                _logger.LogError(ex, "Error loading loadGroupProductLeftComponent");
                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
            }
        }

        // Load nhóm sản phẩm nổi bật
        [HttpPost]
        public IActionResult loadProductTopComponent(int group_product_id, int page_index, int page_size,string view_name )
        {
            try
            {
                // Gọi ViewComponent trực tiếp và trả về kết quả
                return ViewComponent("ProductList", new { _group_product_id = group_product_id, _page_index = page_index, _page_size = page_size, view_name = view_name });
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                _logger.LogError(ex, "Error loading GroupProduct");
                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
            }
        }


    }
}