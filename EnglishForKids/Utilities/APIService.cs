using EnglishForKids.Contants;
using EnglishForKids.Service.Redis;
using EnglishForKids.Utilities;
using EnglishForKids.Models.Authentication;
using EnglishForKids_Service.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using Utilities.Contants;

namespace EnglishForKids.Utilities.Lib
{
    public class APIService
    {
        private readonly IConfiguration _configuration;
        private HttpClient _HttpClient;
        private const string CONST_TOKEN_PARAM = "token";
        private readonly string _ApiSecretKey;
        private readonly RedisConn _redisService;
        private int cache_db_index=6;
        private string USER_NAME="test";
        private string PASSWORD="password";
        private string API_GET_TOKEN="/api/auth/login";
        private string TOKEN="";

        public APIService(IConfiguration configuration)
        {
            _configuration = configuration;
            _HttpClient = new HttpClient(new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (message, certificate2, arg3, arg4) => true
            })
            {
                BaseAddress = new Uri(configuration["api_data:domain"])
            };
            _ApiSecretKey = configuration["API:SecretKey"];
            API_GET_TOKEN = configuration["API:GetToken"];
            USER_NAME = configuration["API:username"];
            PASSWORD = configuration["API:password"];
            cache_db_index = Convert.ToInt32(configuration["Redis:Database:db_common"]);
            _redisService = new RedisConn(configuration);
            _redisService.Connect();
        }

        public async Task<string> POST(string endpoint, object request)
        {
            try
            {   
                if(TOKEN==null || TOKEN.Trim()=="" ) TOKEN = await GetToken();
                string token = EncodeHelpers.Encode(JsonConvert.SerializeObject(request), _ApiSecretKey);
                var request_message = new HttpRequestMessage(HttpMethod.Post, endpoint);
                request_message.Headers.Add("Authorization", "Bearer " + TOKEN);
                var content = new StringContent("{\"token\":\""+token+"\"}", Encoding.UTF8, "application/json");
                request_message.Content = content;
                var response = await _HttpClient.SendAsync(request_message);
                return await response.Content.ReadAsStringAsync();
            }
            catch
            {
                return null;
            }
        }
        public async Task<string> GetToken()
        {
            try
            {
                var cache_name = CacheType.FE_TOKEN;
                try
                {
                    var j_data = await _redisService.GetAsync(cache_name, cache_db_index);
                    if (j_data != null && j_data.Trim() != "")
                    {
                        APITokenCacheModel result = JsonConvert.DeserializeObject<APITokenCacheModel>(j_data);
                        if (result != null && result.token != null && result.token.Trim() != "" && result.expires > DateTime.Now)
                        {
                            return result.token.Trim();
                        }
                    }
                }
                catch
                {

                }

                var request = new UserLoginModel()
                {
                    Username = USER_NAME,
                    Password = EncodeHelpers.MD5Hash(PASSWORD)
                };
                var request_message = new HttpRequestMessage(HttpMethod.Post, API_GET_TOKEN);
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
                        LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "GetToken - APIService:" + json["msg"].ToString());
                        return null;
                    }
                    string token = json["token"].ToString();
                    try
                    {
                        if (token != null && token.Trim() != "")
                        {
                            APITokenCacheModel result = new APITokenCacheModel()
                            {
                                token = token,
                                expires = DateTime.Now.AddHours(23)
                            };
                            _redisService.Set(cache_name, JsonConvert.SerializeObject(result), cache_db_index);
                        }
                    }
                    catch
                    {

                    }
                    return token;

                }
            }
            catch(Exception ex)
            {
                LogHelper.InsertLogTelegramByUrl(_configuration["BotSetting:bot_token"], _configuration["BotSetting:bot_group_id"], "GetToken - APIService:" + ex.ToString());

            }
            return null;

        }


    }
}
