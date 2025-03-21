﻿using EnglishForKids_Service.Models.Client;

namespace EnglishForKids_Service.Models.Orders
{
    public class OrderESModel
    {
        public long orderid { get; set; }

        public long clientid { get; set; }

        public string orderno { get; set; }

        public DateTime createddate { get; set; }

        public int? createdby { get; set; }

        public DateTime? updatelast { get; set; }

        public int? userupdateid { get; set; }

        public double? price { get; set; }

        public double? profit { get; set; }

        public double? discount { get; set; }

        public double? amount { get; set; }

        public int orderstatus { get; set; }

        public short paymenttype { get; set; }

        public int paymentstatus { get; set; }

        public string utmsource { get; set; }

        public string utmmedium { get; set; }

        /// <summary>
        /// chính là label so với wiframe
        /// </summary>
        public string note { get; set; }

        public int? voucherid { get; set; }

        public int? isdelete { get; set; }

        public int? userid { get; set; }

        public string usergroupids { get; set; }

        public long address_id { get; set; }
    }
    public class OrderESDetailModel: OrderESModel
    {
        public AddressClientESModel address { get; set; }

    }
    public class OrderESHistoryResponseModel : OrderESModel
    {
        public string address { get; set; }

    }
}
