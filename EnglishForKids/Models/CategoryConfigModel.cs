namespace EnglishForKids.Models
{
    public class CategoryConfigModel
    {
        public int category_id { get; set; }
        public int skip { get; set; }
        public int take { get; set; }
        public string view_name { get; set; }
        public string position_name { get; set; }

    }
}
