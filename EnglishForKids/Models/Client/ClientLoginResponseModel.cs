namespace EnglishForKids.Models.Client
{
    public class ClientLoginResponseModel
    {
        public long account_client_id { get; set; }
        public long client_id { get; set; }
        public string token { get; set; }
        public string user_name { get; set; }
        public string name { get; set; }
        public string ip { get; set; }
        public DateTime time_expire { get; set; }
        public string validate_token { get; set; }

    }
}
