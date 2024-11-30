namespace EnglishForKids.Models
{
    public class CategoryArticleModel
    {       
        public long id { get; set; }      
        public string title { get; set; }
        public string lead { get; set; }       
        public int status { get; set; } 
        public string image_169 { get; set; } = null!;       
        public string image_43 { get; set; } = null!;
        public string image_11 { get; set; } = null!;       
        public DateTime publish_date { get; set; }    
        public int? pageview { get; set; }      
        public string list_category_id { get; set; }  
        public string list_category_name { get; set; }
    }
}
