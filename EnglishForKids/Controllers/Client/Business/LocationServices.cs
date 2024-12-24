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
using EnglishForKids_Service.Models.Location;
using EnglishForKids.Contants;

namespace EnglishForKids.Controllers.Client.Business
{
    public class LocationServices : APIService
    {
        private readonly IConfiguration _configuration;
        public LocationServices(IConfiguration configuration) :base(configuration) {
            _configuration = configuration;
        }
        public async Task<List<Province>> Province(LocationRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:location_province"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<Province>>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<List<District>> District(LocationRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:location_district"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<District>>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
        public async Task<List<Ward>> Ward(LocationRequestModel request)
        {
            try
            {
                var result = await POST(_configuration["API:location_ward"], request);
                var jsonData = JObject.Parse(result);
                var status = int.Parse(jsonData["status"].ToString());

                if (status == (int)ResponseType.SUCCESS)
                {
                    return JsonConvert.DeserializeObject<List<Ward>>(jsonData["data"].ToString());
                }
            }
            catch
            {
            }
            return null;

        }
    }
}
