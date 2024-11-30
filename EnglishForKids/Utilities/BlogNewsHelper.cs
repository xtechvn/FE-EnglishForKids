using EnglishForKids.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace EnglishForKids.Utilities
{
    public static class BlogNewsHelper
    {
        public static CategoryConfigModel GetStaticBlogNews(this IHtmlHelper htmlHelper, string zone_name, IConfiguration configuration)
        {
            // Lấy thông tin của zone từ appsettings.json
            var section = configuration.GetSection($"blognews:{zone_name}");

            if (section != null)
            {
                // Lấy các giá trị cụ thể từ section
                var model = new CategoryConfigModel
                {
                    category_id = section.GetValue<int>("category_id"),
                    take = section.GetValue<int>("top"),
                    view_name = section.GetValue<string>("view_name"),
                    position_name = zone_name
                };
                return model;
                // Tùy chỉnh chuỗi trả về dựa vào các giá trị đã lấy được
                //return $"Category ID: {categoryId}, Top: {top}, Type View: {typeView}";
            }

            return null;

        }
    }
}
