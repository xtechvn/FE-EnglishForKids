using EnglishForKids.Models;

namespace EnglishForKids.ViewModels
{
    public class CourseViewModel
    {
        public Int32 category_id { get; set; }      
        public List<CategoryCourseModel> obj_article_list { get; set; }
        public int total_items { get; set; } // tông số toàn bộ bản ghi để phân trang
    }
}
