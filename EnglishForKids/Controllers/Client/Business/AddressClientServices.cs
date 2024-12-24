using EnglishForKids.Utilities.Lib;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using EnglishForKids.Utilities.Contants;
using EnglishForKids_Service.Models.Client;
using EnglishForKids_Service.Models.Address;
using EnglishForKids.Contants;

namespace EnglishForKids.Controllers.Client.Business
{
    public class AddressClientServices : APIService
    {
        private readonly IConfiguration _configuration;
        public AddressClientServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }
      
        public async Task<ClientAddressListResponseModel> Listing(ClientAddressGeneralRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:address_client_list"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<ClientAddressListResponseModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<AddressClientESModel> Detail(ClientAddressDetailRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:address_client_detail"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<AddressClientESModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<string> CreateOrUpdate(AddressUpdateRequestModel request)
        {
            try
            {
                var url = _configuration["API:address_create"];
                
                var result = await POST(url, request);
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
        public async Task<AddressClientFEModel> DefaultAddress(ClientAddressGeneralRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:address_client_default"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<AddressClientFEModel>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<bool> ForgotPassword(ClientForgotPasswordRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:client_forgot_password"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return true;
                }
            }
            catch
            {
            }
            return false;

        }
        public async Task<bool> ChangePassword(ClientChangePasswordRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:client_change_password"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return true;
                }
            }
            catch
            {
            }
            return false;

        }
        public async Task<bool> ValidateForgotPassword(ClientForgotPasswordRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:client_validate_forgot_password"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return true;
                }
            }
            catch
            {
            }
            return false;

        }
    }
}
