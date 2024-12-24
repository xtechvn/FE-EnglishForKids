using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnglishForKids_Service.Models.Client
{
    public class ClientChangePasswordRequestModel
    {
        public string token { get; set; }
        public long id { get; set; }
        public string password { get; set; }
        public string confirm_password { get; set; }
    }
}
