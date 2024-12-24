using Models.MongoDb;

namespace EnglishForKids_Service.Models.Orders
{
    public class OrderHistoryResponseModel
    {
        public List<OrderESHistoryResponseModel> data { get; set; }
        public List<OrderDetailMongoDbModel> data_order { get; set; }

        public int page_index { get; set; }
        public int page_size { get; set; }
        public long total { get; set; }
    }
}
