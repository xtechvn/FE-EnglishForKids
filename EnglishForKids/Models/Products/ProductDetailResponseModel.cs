namespace EnglishForKids.Models.Products
{
    public class ProductDetailResponseModel
    {
        public ProductMainResponseModel product_main { get; set; }
        public List<ProductMongoDbModel> product_sub { get; set; }

    }
    public class ProductMainResponseModel : ProductMongoDbModel
    {
        public float star { get; set; }
        public int product_sold_count { get; set; }
        public int reviews_count { get; set; }

    }
}
