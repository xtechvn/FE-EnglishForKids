using EnglishForKids.Utilities.Lib;
using EnglishForKids_Service.Models;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Net.Http;
using Microsoft.AspNetCore.Identity;
using System.Reflection;
using EnglishForKids.Models.Client;
using EnglishForKids.Utilities.Contants;
using LIB.Models.APIRequest;
using EnglishForKids.Contants;

namespace EnglishForKids.Controllers.Client.Business
{
    public class ClientServices :APIService
    {
        private readonly IConfiguration _configuration;
        public ClientServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }
        public async Task<ClientLoginResponseModel> Login(ClientLoginRequestModel request)
        {
            try
            {
                request.password=EncodeHelpers.MD5Hash(request.password);
                string token = EncodeHelpers.Encode(JsonConvert.SerializeObject(request), _configuration["API:SecretKey"].ToString());
                var result = await POST(_configuration["API:Login"], new
                {
                    token
                });
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ClientLoginResponseModel>(jsonData["data"].ToString());
                }
            }
            catch (Exception ex)
            {
            }
            return null;

        }
        public async Task<ClientRegisterResponseModel> Register(ClientRegisterRequestModel request)
        {
            try
            {
                request.password = EncodeHelpers.MD5Hash(request.password);
                request.confirm_password = EncodeHelpers.MD5Hash(request.confirm_password);
                string token = EncodeHelpers.Encode(JsonConvert.SerializeObject(request), _configuration["API:SecretKey"].ToString());
                var result = await POST(_configuration["API:Register"], new
                {
                    token
                });
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());
                return JsonConvert.DeserializeObject<ClientRegisterResponseModel>(result); ;

            }
            catch
            {
            }
            return null;

        }
    }
}
