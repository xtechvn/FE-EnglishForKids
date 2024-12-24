using EnglishForKids.Utilities.Lib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using EnglishForKids.Utilities.Contants;
using EnglishForKids.Models.Cart;
using Models.MongoDb;
using Models.APIRequest;
using EnglishForKids.Models.Orders;
using EnglishForKids.Models.NinjaVan;
using EnglishForKids.Contants;

namespace EnglishForKids.Controllers.Client.Business
{
    public class CartServices :APIService
    {
        private readonly IConfiguration _configuration;
        public CartServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }
       
       
        public async Task<int> AddToCart(AddToCartRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:add_to_cart"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return Convert.ToInt32(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return -1;

        } 
        public async Task<string> ChangeQuanity(AddToCartRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:cart_quanity_change"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return jsonData["data"].ToString();
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<int> GetCartCount(CartGeneralRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:cart_count"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return Convert.ToInt32(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return 0;

        }
        public async Task<List<CartItemMongoDbModel>> GetList(CartGeneralRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:cart_get_list"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<CartItemMongoDbModel>>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        } 
        public async Task<int> Delete(CartDeleteRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:cart_delete"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                return status;
               
            }
            catch
            {
            }
            return -1;

        } 
        public async Task<int> DeleteByOrder(CartDeleteRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:cart_delete_by_order"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                return status;
               
            }
            catch
            {
            }
            return -1;

        } 
      
        public async Task<CartCheckProductResponseModel> CheckProduct(CartCheckProductRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:order_confirm"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                return JsonConvert.DeserializeObject<CartCheckProductResponseModel>(result);
            }
            catch
            {
            }
            return null;

        }
        public async Task<ShippingFeeResponseModel> ShippingFee(ShippingFeeRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:get_shipping_fee"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                if (status == 0)
                {
                    return JsonConvert.DeserializeObject<ShippingFeeResponseModel>(jsonData["data"].ToString());

                }
            }
            catch
            {
            }
            return null;

        }
    }
}
