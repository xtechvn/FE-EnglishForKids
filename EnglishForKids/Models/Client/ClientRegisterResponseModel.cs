using EnglishForKids.Models.Client;

namespace LIB.Models.APIRequest
{
    public class ClientRegisterResponseModel
    {
       public string msg { get; set; }
       public ClientLoginResponseModel data { get; set; }
    }
}
