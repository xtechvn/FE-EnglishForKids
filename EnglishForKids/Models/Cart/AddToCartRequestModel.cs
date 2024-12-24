using EnglishForKids.Models.Products;

namespace EnglishForKids.Models.Cart
{
    public class AddToCartRequestModel
    {
        public string product_id { get; set; }
        public string token { get; set; }
        public int quanity { get; set; }
    }

}
