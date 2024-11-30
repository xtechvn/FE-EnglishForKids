using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnglishForKids.Models.Products
{
    public class ProductSpecificationTypeModel
    {
        public int _id { get; set; }
        public string name { get; set; }
        public int type { get; set; }
    }
}
