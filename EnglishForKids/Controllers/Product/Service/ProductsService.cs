using EnglishForKids.Contants;
using EnglishForKids.Models;
using EnglishForKids.Models.Products;
using EnglishForKids.Service.Redis;
using EnglishForKids.Utilities;
using HuloToys_Front_End.Utilities.Lib;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace EnglishForKids.Controllers.Product.Service
{
    public class ProductsService : APIService
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        public ProductsService(IConfiguration _configuration, RedisConn _redisService) : base(_configuration)
        {
            configuration = _configuration;
            redisService = _redisService;
        }

        /// <summary>
        /// Load danh sách menu, category, ngành hàng
        /// </summary>
        /// <param name="parent_id"></param>
        /// <returns>
        public async Task<ProductListResponseModel?> getProductListByGroupProductId(int group_product_id, int page_index, int page_size)
        {
            try
            {
                var connect_api_us = new ConnectApi(configuration, redisService);
                var input_request = new Dictionary<string, int>
                {
                    {"group_id",group_product_id },
                    {"page_index",page_index},
                    {"page_size",page_size}
                };
                var response_api = await connect_api_us.CreateHttpRequest("/api/product/get-list.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    string data = JsonParent[0]["data"].ToString();
                    int total = Convert.ToInt32(JsonParent[0]["total"]);
                    var model = new ProductListResponseModel
                    {
                        items = JsonConvert.DeserializeObject<List<ProductMongoDbModel>>(data),
                        count = total,
                        page_index = page_index,
                        page_size = page_size
                    };
                    return model;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["telegram_log_error_fe:Token"], configuration["telegram_log_error_fe:GroupId"], "getListMenuHelp " + ex.Message);
                return null;
            }
        }
        public async Task<ProductDetailResponseModel> GetProductDetail(ProductDetailRequestModel request)
        {
            try
            {
                string response_api = string.Empty;
                var connect_api_us = new ConnectApi(configuration, redisService);
                var input_request = new Dictionary<string, string>
                {
                    {"product_id",request.id }
                };

                response_api = await connect_api_us.CreateHttpRequest(configuration["API:get_product_detail"].ToString(), input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    var product = JsonConvert.DeserializeObject<ProductDetailResponseModel>(JsonParent[0]["data"].ToString());
                    return product;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Utilities.LogHelper.InsertLogTelegramByUrl(configuration["telegram_log_error_fe:Token"], configuration["telegram_log_error_fe:GroupId"], "GetProductDetail " + ex.Message);
                return null;
            }
        }
        public async Task<ProductListResponseModel> GetProductList(ProductListRequestModel request)
        {
            try
            {
                var result = await POST(configuration["API:get_product_list"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ProductListResponseModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        
        public async Task<List<ProductMongoDbModel>> Search(string keyword)
        {
            try
            {
                string response_api = string.Empty;
                var connect_api_us = new ConnectApi(configuration, redisService);
                var input_request = new Dictionary<string, string>
                {
                    {"keyword",keyword }
                };

                response_api = await connect_api_us.CreateHttpRequest("/api/product/search.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS) && JsonParent[0]["data"]!=null)
                {
                    var product_list = JsonConvert.DeserializeObject<List<ProductMongoDbModel>>(JsonParent[0]["data"].ToString());
                    return product_list;
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }
    }
}
