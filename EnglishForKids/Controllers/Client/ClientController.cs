using EnglishForKids.Controllers.Client.Business;
using EnglishForKids.Models.Client;
using EnglishForKids.Utilities.Lib;
using EnglishForKids_Service.Models.Address;
using EnglishForKids_Service.Models.Client;
using EnglishForKids_Service.Models.Location;
using LIB.Models.APIRequest;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace EnglishForKids.Controllers.Client
{
    public class ClientController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ClientServices _clientServices; 
        private readonly AddressClientServices _addressClientServices; 
        private readonly LocationServices _locationServices; 
        public ClientController(IConfiguration configuration) {

            _configuration=configuration;
            _clientServices = new ClientServices(configuration);
            _addressClientServices = new AddressClientServices(configuration);
            _locationServices = new LocationServices(configuration);
        }
        [HttpGet]
        [Route("token")]
        public async Task<IActionResult> Token()
        {
            var result = await _clientServices.GetToken();
            return new JsonResult(new
            {
                data = result
            });
        }
        public async Task<IActionResult> Login(ClientLoginRequestModel request)
        {
            var result = await _clientServices.Login(request);
            if (result != null)
            {
                result.ip = HttpContext.Connection.RemoteIpAddress == null ? "Unknown" : HttpContext.Connection.RemoteIpAddress.ToString();
            }
            return Ok(new
            {
                is_success = result != null,
                data = result
            });
        }

        public async Task<IActionResult> Register(ClientRegisterRequestModel request)
        {
            var result = await _clientServices.Register(request);

            return Ok(new
            {
                is_success = (result != null && result.data!=null),
                data = result
            });
        } 
       
        public ActionResult Address()
        {
            return View();

        }
        public ActionResult AddressPopup()
        {
            return View();
        }
        public async Task<IActionResult> AddressList(ClientAddressGeneralRequestModel request)
        {
            var result = await _addressClientServices.Listing(request);

            return Ok(new
            {
                is_success = (result != null && result.list!=null && result.list.Count>0),
                data = result
            });
        }  
        public async Task<IActionResult> AddressDetail(ClientAddressDetailRequestModel request)
        {
            var result = await _addressClientServices.Detail(request);

            return Ok(new
            {
                is_success = (result != null &&  result.id>0),
                data = result
            });
        }
        public async Task<IActionResult> Province(LocationRequestModel request)
        {
            var result = await _locationServices.Province(request);

            return Ok(new
            {
                is_success = (result != null && result.Count > 0),
                data = result
            });
        }
        public async Task<IActionResult> District(LocationRequestModel request)
        {
            var result = await _locationServices.District(request);

            return Ok(new
            {
                is_success = (result != null && result.Count > 0),
                data = result
            });
        }
        public async Task<IActionResult> Ward(LocationRequestModel request)
        {
            var result = await _locationServices.Ward(request);

            return Ok(new
            {
                is_success = (result != null && result.Count > 0),
                data = result
            });
        } 
        public async Task<IActionResult> SubmitAddress(AddressUpdateRequestModel request)
        {
            var result = await _addressClientServices.CreateOrUpdate(request);

            return Ok(new
            {
                is_success = result!=null,
                data=result
            });
        }
        public async Task<IActionResult> DefaultAddress(ClientAddressGeneralRequestModel request)
        {
            var result = await _addressClientServices.DefaultAddress(request);

            return Ok(new
            {
                is_success = (result != null),
                data = result
            });
        }
        public async Task<IActionResult> ForgotPassword(ClientForgotPasswordRequestModel request)
        {
            var result = await _addressClientServices.ForgotPassword(request);

            return Ok(new
            {
                is_success = result,
                msg= "Email hướng dẫn đổi mật khẩu sẽ được gửi đến địa chỉ email mà bạn đã nhập. <br /> vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn."
            });
        }
        public async Task<ActionResult> ChangePassword(string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token) || token.Trim() == "")
                {
                    return Redirect("/Home/Notfound");
                }
                string forgot = EncodeHelpers.Decode(token.Replace("-" , "+").Replace("_" , "/"), _configuration["API:SecretKey"]);
                if(forgot == null || forgot.Trim() == "")
                {
                    return Redirect("/Home/Notfound");
                }
                var model = JsonConvert.DeserializeObject<ClientForgotPasswordTokenModel>(forgot);
                if(model == null|| model.account_client_id <= 0 || model.exprire_time<DateTime.Now || model.created_time>DateTime.Now)
                {
                    return Redirect("/Home/Notfound");
                }
                if (model == null || model.account_client_id <= 0 || model.exprire_time < DateTime.Now || model.created_time > DateTime.Now)
                {
                    return Redirect("/Home/Notfound");
                }
                var validate = await _addressClientServices.ValidateForgotPassword(new ClientForgotPasswordRequestModel() { name = token });
                if (!validate)
                {
                    return Redirect("/Home/Notfound");

                }
                ViewBag.Token = token;
                return View();
            }
            catch
            {

            }
            return Redirect("/Home/Notfound");


        }
        public async Task<IActionResult> ConfirmChangePassword(ClientChangePasswordRequestModel request)
        {
            bool result = false;
            if (string.IsNullOrEmpty(request.token) || request.token.Trim() == "")
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            string forgot = EncodeHelpers.Decode(request.token.Replace("-", "+").Replace("_", "/"), _configuration["API:SecretKey"]);
            if (forgot == null || forgot.Trim() == "")
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            var model = JsonConvert.DeserializeObject<ClientForgotPasswordTokenModel>(forgot);
            if (model == null || model.account_client_id <= 0 || model.exprire_time < DateTime.Now || model.created_time > DateTime.Now)
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });
            }
            var validate = await _addressClientServices.ValidateForgotPassword(new ClientForgotPasswordRequestModel() { name = request.token });
            if (!validate)
            {
                return Ok(new
                {
                    is_success = result,
                    msg = "Đổi mật khẩu thất bại, vui lòng kiểm tra lại thông tin hoặc liên hệ với bộ phận CSKH"

                });

            }
            request.id = model.account_client_id;
            result = await _addressClientServices.ChangePassword(request);

            return Ok(new
            {
                is_success = result,
                msg="Đổi mật khẩu thành công, vui lòng đăng nhập lại"
            });
        }
    }
}
