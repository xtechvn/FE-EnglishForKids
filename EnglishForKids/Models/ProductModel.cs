namespace EnglishForKids.Models
{
    public class ProductModel
    {
        public string _id { get; set; }
        public string code { get; set; }
        public double price { get; set; }
        public double profit { get; set; }
        public double amount { get; set; }
        public int quanity_of_stock { get; set; }
        public double discount { get; set; }
        public List<string> images { get; set; }
        public string avatar { get; set; }
        public List<string> videos { get; set; }
        public string name { get; set; }
        public string group_product_id { get; set; }
        public string description { get; set; }     
        public int preorder_status { get; set; }
        public float star { get; set; }
        public int condition_of_product { get; set; }
        public string sku { get; set; }
        public DateTime created_date { get; set; }
        public DateTime updated_last { get; set; }
        public double? amount_max { get; set; }
        public double? amount_min { get; set; }
        public string label_price { get; set; }

        public string parent_product_id { get; set; }
        public int status { get; set; }

    }
}
