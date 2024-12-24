using EnglishForKids_Service.Models.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.APIRequest
{
    public class CartCheckProductResponseModel
    {
        public int status { get; set; }
        public string msg { get; set; }
        public bool changed { get; set; }
        public string data { get; set; }

    }
    public class CartCheckProductResponseModelItem
    {
        public string cart_id { get; set; }
        public string product_id { get; set; }
        public double old_amount { get; set; }
        public double new_amount { get; set; }
    }
}
