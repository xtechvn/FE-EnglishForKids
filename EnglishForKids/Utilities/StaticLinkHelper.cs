using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;

namespace EnglishForKids.Utilities
{
    public static class StaticLinkHelper
    {
        public static string GetStaticUrlCourse(this IHtmlHelper htmlHelper, string Title, long course_id)
        {
            Title = CommonHelper.RemoveUnicode(CommonHelper.CheckMaxLength(Title.Trim(), 100));
            Title = CommonHelper.RemoveSpecialCharacters(CommonHelper.CheckMaxLength(Title.Trim(), 100));
            Title = Title.Replace(" ", "-").ToLower();
            return ("/khoa-hoc/" + Title + "-" + course_id + ".html");
        }
        public static string GetStaticUrlNews(this IHtmlHelper htmlHelper, string Title, long article_id)
        {
            Title = CommonHelper.RemoveUnicode(CommonHelper.CheckMaxLength(Title.Trim(), 100));
            Title = CommonHelper.RemoveSpecialCharacters(CommonHelper.CheckMaxLength(Title.Trim(), 100));
            Title = Title.Replace(" ", "-").ToLower();
            return ("/" + Title + "-" + article_id + ".html");
        }
        public static string GetStaticUrlProduct(this IHtmlHelper htmlHelper, string name, string id)
        {
            name = CommonHelper.RemoveUnicode(CommonHelper.CheckMaxLength(name.Trim(), 100));
            name = CommonHelper.RemoveSpecialCharacters(CommonHelper.CheckMaxLength(name.Trim(), 100));
            name = name.Replace(" ", "-").ToLower();
            return ("/san-pham/"+  name + "-" + id + ".html");

        }
        public static string GetStaticUrlGroupProduct(this IHtmlHelper htmlHelper, string name, int group_product_id)
        {
            name = CommonHelper.RemoveUnicode(CommonHelper.CheckMaxLength(name.Trim(), 100));
            name = CommonHelper.RemoveSpecialCharacters(CommonHelper.CheckMaxLength(name.Trim(), 100));
            name = name.Replace(" ", "-").ToLower();
            return ("/nganh-hang/" + name + "/" + group_product_id);
        }
        public static string GetStaticUrlCategory(this IHtmlHelper htmlHelper, string name, long cate_id)
        {
            name = CommonHelper.RemoveUnicode(CommonHelper.CheckMaxLength(name.Trim(), 100));
            name = CommonHelper.RemoveSpecialCharacters(CommonHelper.CheckMaxLength(name.Trim(), 100));
            name = name.Replace(" ", "-").ToLower();
            return ("/tin-tuc" + "/" + name + "/" + cate_id );
        }
        public static string GetStaticUrlImage(this IHtmlHelper htmlHelper, string path_link_image, IConfiguration _configuration)
        {
            string domain_static = _configuration["common:link_static_img"];
            if (path_link_image.IndexOf(domain_static) ==-1 )
            {
                return domain_static + path_link_image;
            }
            else
            {
                return path_link_image;
              
            }
          
        }
    }
}
