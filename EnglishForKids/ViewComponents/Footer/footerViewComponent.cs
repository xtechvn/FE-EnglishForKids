using EnglishForKids.Service.Redis;
using Microsoft.AspNetCore.Mvc;

namespace EnglishForKids.ViewComponents.Footer
{
    public class FooterViewComponent : ViewComponent
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn _redisService;
        public FooterViewComponent(IConfiguration _Configuration, RedisConn redisService)
        {
            configuration = _Configuration;
            _redisService = redisService;
        }

        /// <summary>
        /// load các menu của web
        /// menu_parent_id: id của menu cha
        /// </summary>
        /// <returns></returns>
        public async Task<IViewComponentResult?> InvokeAsync()
        {
            try
            {
                // Nếu không có trong cache, gọi dịch vụ
               //var objMenu = new NewsService(configuration, _redisService);
              //  var obj_data = await objMenu.getArticleByCategoryId(Convert.ToInt32(configuration["menu:help_parent_id"]));

                return View();
            }
            catch (Exception)
            {
                return Content("");
            }
        }
    }
}
