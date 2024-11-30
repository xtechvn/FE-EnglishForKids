namespace EnglishForKids.Models
{
    public class DataBaseConfig
    {        
        public IPConfig Redis { get; set; }
        public IPConfig Elastic { get; set; }

    }
    public class DBConfig
    {
        public string ConnectionString { get; set; }
    }

    public class IPConfig
    {
        public string Host { get; set; }
    }

}
