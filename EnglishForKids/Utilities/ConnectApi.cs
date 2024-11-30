using EnglishForKids.Contants;
using EnglishForKids.Models;
using EnglishForKids.Service.Redis;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.AccessControl;
using System.Text;

namespace EnglishForKids.Utilities
{
    public class ConnectApi
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;

        private HttpClient _HttpClient;

        public ConnectApi(IConfiguration _configuration, RedisConn _redisService)
        {
            redisService = _redisService;
            configuration = _configuration;
            _HttpClient = new HttpClient(new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, certificate2, arg3, arg4) => true
            })
            {
                BaseAddress = new Uri(configuration["api_data:domain"])
            };
        }
        /// <summary>
        /// <param name="endpoint">url tới api</param>
        /// <param name="input_request">Là các param input truyền vào các endpoint được mã  hóa token</param>
        /// <returns></returns>
        public async Task<string> CreateHttpRequest(string endpoint, object input_request)
        {
            try
            {
                string access_token = string.Empty;
                //  string token_bearer = await getToken();
                string key_user_name_cache = configuration["api_data:username"];       
                // Lấy access token từ cache
                var data_access_token = await redisService.GetAsync(key_user_name_cache, Convert.ToInt32(configuration["redis:Database:db_common"]));

                if (!string.IsNullOrEmpty(data_access_token))
                {
                    // kiểm tra còn hạn hay không
                    var token_handler = new JwtSecurityTokenHandler();
                    var jwt_token = token_handler.ReadToken(data_access_token.ToString()) as JwtSecurityToken;
                    if (jwt_token != null)
                    {
                        var expirationTime = jwt_token.ValidTo; // Thời gian hết hạn của token (UTC)
                        if (expirationTime < DateTime.UtcNow)
                        {
                            // Token đã hết hạn. Refresh token                        
                            access_token = await getToken();
                            // set cache
                            redisService.Set(key_user_name_cache, access_token, Convert.ToInt32(configuration["redis:Database:db_common"]));
                        }
                        else
                        {
                            access_token = data_access_token;
                        }
                    }
                }
                else
                {
                    // Chưa được khởi tạo. hoặc redis ko có
                    access_token = await getToken();
                    // set cache
                    redisService.Set(key_user_name_cache, access_token, Convert.ToInt32(configuration["redis:Database:db_common"]));
                }

                if (access_token != string.Empty)
                {
                    string token = CommonHelper.Encode(JsonConvert.SerializeObject(input_request), configuration["api_data:secret_key"]);
                    var request_message = new HttpRequestMessage(HttpMethod.Post, endpoint);
                    request_message.Headers.Add("Authorization", "Bearer " + access_token);
                    var content = new StringContent("{\"token\":\"" + token + "\"}", Encoding.UTF8, "application/json");
                    request_message.Content = content;
                    var response = await _HttpClient.SendAsync(request_message);
                    return await response.Content.ReadAsStringAsync();
                }
                else
                {
                    LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], "token_bearer Empty");
                    return string.Empty;
                }
            }
           catch (Exception ex)
            {
               string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return string.Empty;
            }
        }

        public async Task<string?> getToken()
        {
            try
            {
                var request = new ApiAccountModel()
                {
                    username = configuration["api_data:username"],
                    password = configuration["api_data:password"]
                };
                var request_message = new HttpRequestMessage(HttpMethod.Post, "api/auth/login");
                var content = new StringContent(JsonConvert.SerializeObject(request), null, "application/json");
                request_message.Content = content;
                var response = await _HttpClient.SendAsync(request_message);
                response.EnsureSuccessStatusCode();
                if (response.IsSuccessStatusCode)
                {
                    var json = JObject.Parse(await response.Content.ReadAsStringAsync());
                    var status = int.Parse(json["status"].ToString());
                    if (status != (int)ResponseType.SUCCESS)
                    {
                        LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], "GetToken - APIService:" + json["msg"].ToString());
                    }
                    else
                    {
                        return json["token"].ToString();
                    }
                }
                return string.Empty;
            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
                return string.Empty;
            }
        }
    }
}
