using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
namespace EnglishForKids.Utilities
{
    public static class CommonHelper
    {
        public static string dollarCurrencyFormat = @"\$(\d{1,3}(,\d{3})*).(\d{2})";
        public static bool GetParamWithKey(string Token, out JArray objParr, string EncryptApi)
        {
            objParr = null;
            try
            {

                Token = Token.Replace(" ", "+");
                // var serializer = new JavaScriptSerializer();                
                var jsonContent = GetContentObject(Token, EncryptApi);
                objParr = JArray.Parse("[" + jsonContent + "]");
                if (objParr != null && objParr.Count > 0)
                {
                    return true;
                }
                else { return false; }
            }
            catch (Exception ex)
            {
                //LogHelper.InsertLogTelegram("GetParamWithKey - CommonHelper: " + ex + "--Token =  " + Token);
                return false;
            }
        }

        public static string GetContentObject(string sContentEncode, string sKey)
        {
            try
            {
                // api.insidekp: Key quy uoc giua  2 ben | parramKey: tham so dong
                sContentEncode = sContentEncode.Replace(" ", "+");

                string data = Decode(sContentEncode, sKey); // Lay ra content 
                return data;
            }
            catch (Exception ex)
            {
              //  LogHelper.InsertLogTelegram("GetContentObject - CommonHelper: " + ex);
                // ErrorWriter.WriteLog(System.Web.HttpContext.Current.Server.MapPath("~"), "GiaiMa()", ex.ToString());
                return string.Empty;
            }

        }
        public static string Decode(string strString, string strKeyPhrase)
        {
            try
            {
                Byte[] byt = Convert.FromBase64String(strString);
                strString = System.Text.Encoding.UTF8.GetString(byt);
                strString = KeyED(strString, strKeyPhrase);
                return strString;
            }
            catch (Exception ex)
            {

                return strString;
            }
        }
        public static string Encode(string strString, string strKeyPhrase)
        {
            try
            {
                strString = KeyED(strString, strKeyPhrase);
                Byte[] byt = System.Text.Encoding.UTF8.GetBytes(strString);
                strString = Convert.ToBase64String(byt);
                return strString;
            }
            catch (Exception ex)
            {
                return string.Empty;
            }

        }
        private static string KeyED(string strString, string strKeyphrase)
        {
            int strStringLength = strString.Length;
            int strKeyPhraseLength = strKeyphrase.Length;

            System.Text.StringBuilder builder = new System.Text.StringBuilder(strString);

            for (int i = 0; i < strStringLength; i++)
            {
                int pos = i % strKeyPhraseLength;
                int xorCurrPos = (int)(strString[i]) ^ (int)(strKeyphrase[pos]);
                builder[i] = Convert.ToChar(xorCurrPos);
            }

            return builder.ToString();
        }
  
        public static string RemoveUnicode(string text)
        {
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
    "đ",
    "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
    "í","ì","ỉ","ĩ","ị",
    "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
    "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
    "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
    "d",
    "e","e","e","e","e","e","e","e","e","e","e",
    "i","i","i","i","i",
    "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
    "u","u","u","u","u","u","u","u","u","u","u",
    "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }
        public static bool isCheckLink(string strURL)
        {
            strURL = strURL.Replace("https", "http").Replace("%", "");
            Uri uriResult;
            return Uri.TryCreate(strURL, UriKind.Absolute, out uriResult) && uriResult.Scheme == Uri.UriSchemeHttp;
        }
      
        public static string genLinkDetailProduct(string label_name, string product_code, string product_name)
        {
            product_name = CommonHelper.RemoveSpecialCharacters(product_name);
            product_name = RemoveUnicode(CheckMaxLength(product_name.Trim(), 50));
            product_name = product_name.Replace(" ", "-").Replace("/", "");
            return ("/product/" + label_name + "/" + product_name + "-").ToLower() + product_code + ".html";
        }
        public static string genLinkDetailProductOtherLabel(string label_name, string path, bool is_extension = false)
        {
            path = path.Replace(".html?", "-variant-");
            path = path.Replace(".html", "");
            path = path.Replace("=", "__");
            string url = ("/product/" + label_name + "/" + path).ToLower() + ".html";
            if (is_extension)
            {
                url += "?product_source=3";
            }
            return url;
        }
        public static string ConvertUsExpressPathToSourcePath(string path)
        {
            string source_path = path.Split(".html")[0];
            if (source_path.Contains("-variant-"))
            {
                source_path = source_path.Replace("-variant-", ".html?");
            }
            else
            {
                source_path += ".html";
            }
            source_path = source_path.Replace("__", "=");
            return source_path;
        }
        //public static string genLinkNews(string Title, string article_id)
        //{
        //    Title = RemoveUnicode(CheckMaxLength(Title.Trim(), 100));
        //    Title = RemoveSpecialCharacters(CheckMaxLength(Title.Trim(), 100));
        //    Title = Title.Replace(" ", "-").ToLower();
        //    return ("/" + Title + "-" + article_id + ".html");
        //}
   

        // xử lý chuỗi quá dài
        //str: Chuoi truyen vao
        // So ky tu toi da cho phep
        // OUPUT: Tra ra chuoi sau khi xu ly
        public static string CheckMaxLength(string str, int MaxLength)
        {
            try
            {
                //str = RemoveSpecialCharacters(str);
                if (str.Length > MaxLength)
                {

                    str = str.Substring(0, MaxLength + 1); // cat chuoi
                    if (str != " ") //  ky tu sau truoc khi cat co chua ky tu ko
                    {
                        while (str.Last().ToString() != " ") // cat not cac cu tu chu cho den dau cach gan nhat
                        {
                            str = str.Substring(0, str.Length - 1); // dich trai
                        }
                    }
                    //str = str + "...";
                }
                return str;
            }
            catch (Exception ex)
            {
                // Utilities.Common.WriteLog(Models.Contants.FOLDER_LOG, "ERROR CheckMaxLength : " + ex.Message);
                return string.Empty;
            }
        }

        public static string RemoveSpecialCharacters(string input)
        {
            try
            {
                Regex r = new Regex("(?:[^a-z0-9 ]|(?<=['\"])s)", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled);
                return r.Replace(input, String.Empty);
            }
            catch (Exception e)
            {
                return input ?? string.Empty;
            }
        }     

        public static string ConvertAllNonCharacterToSpace(string text)
        {
            string rs = Regex.Replace(text, @"\s+", " ", RegexOptions.Singleline);
            return rs.Trim();
        }
     
        public static string RemoveAllNonCharacter(string text)
        {
            string rs = Regex.Replace(text, @"\s+", "", RegexOptions.Singleline);
            return rs.Trim();
        }
        public static string RemoveUnusedTags(this string source)
        {
            return Regex.Replace(source, @"<(\w+)\b(?:\s+[\w\-.:]+(?:\s*=\s*(?:""[^""]*""|'[^']*'|[\w\-.:]+))?)*\s*/?>\s*</\1\s*>", string.Empty, RegexOptions.Multiline);
        }
        public static T ConvertFromJsonString<T>(string jsonString)
        {
            try
            {
                T rs = JsonConvert.DeserializeObject<T>(jsonString);
                return rs;
            }
            catch
            {
                return default(T);
            }

        }
        public static string DecodeHTML(string html)
        {
            string result = "";
            try
            {
                result = HttpUtility.HtmlDecode(html);
            }
            catch
            {
                string msg = "Unable to decode HTML: " + html;
                throw new ArgumentException(msg);
            }

            return result;
        }       

        public static string ReverDateTimeTiny(string strDate)
        {
            if (!string.IsNullOrEmpty(strDate))
            {
                strDate = strDate.Replace('/', '-');
                string[] ArrDate = strDate.Split('-');

                string DD = ArrDate[0].ToString();
                string MM = ArrDate[1].ToString();
                string YYYY = ArrDate[2].ToString().Split(' ')[0];
                string JoinDate = MM + "-" + DD + "-" + YYYY;
                return JoinDate;
            }
            else
            {
                return string.Empty;
            }
        }

        public static string StripTagsRegex(string source)
        {
            if (source != null)
            {
                return Regex.Replace(source, "<.*?>", string.Empty);
            }
            else
            {
                return string.Empty;
            }
        }

        public static byte[] GetImage(string url)
        {
            Stream stream = null;
            byte[] buf;

            try
            {
                WebProxy myProxy = new WebProxy();
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);

                HttpWebResponse response = (HttpWebResponse)req.GetResponse();
                stream = response.GetResponseStream();

                using (BinaryReader br = new BinaryReader(stream))
                {
                    int len = (int)(response.ContentLength);
                    buf = br.ReadBytes(len);
                    br.Close();
                }

                stream.Close();
                response.Close();
            }
            catch (Exception exp)
            {
                buf = null;
            }

            return (buf);
        }
       
        public static string genLinkDetailProductv2(string label_name, string url)
        {
            var product_path = url.Split("/");
            var plant_text = product_path[product_path.Length - 1].Replace(".html", "");
            if (product_path[product_path.Length - 1].Contains(".html?product_id="))
            {
                plant_text = product_path[product_path.Length - 1].Replace(".html?product_id=", "-");
            }
            return "/product/" + label_name + "/" + plant_text + ".html";
        }
        public static string RemoveSpecialCharactersExceptDot(string input)
        {
            try
            {
                Regex r = new Regex("(?:[^a-z0-9. ]|(?<=['\"])s)", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled);
                return r.Replace(input, String.Empty);
            }
            catch (Exception e)
            {
                return input ?? string.Empty;
            }
        }
        public static string RemoveSpecialCharactersProductName(string input)
        {
            try
            {
                var s = Regex.Replace(input, "[^a-zA-Z0-9-_ ]", "");
                return s.Replace(":", "-");
            }
            catch (Exception ex)
            {
                return input ?? string.Empty;
            }
        }
        public static double PackageVolumeToPound(double cubic_centimeters)
        {
            // Thể tích /5000 => ra đơn vị (kg) * 2.20462262185 => pound
            double pound = 0;
            try
            {
                if (cubic_centimeters <= 0)
                {
                    return pound;
                }
                else
                {
                    double kg = cubic_centimeters / 5000;
                    pound = Math.Round(kg * 2.20462262185, 2);
                }
            }
            catch
            {

            }
            return pound;
        }
        public static double PackageVolumeFromDimensions(List<double> dimensions_inches)
        {
            // Dài(cm)*rộng(cm)*cao(cm)
            if (dimensions_inches.Count < 3)
            {
                return 0;
            }
            else
            {
                return (dimensions_inches[0] * 2.54 * dimensions_inches[1] * 2.54 * dimensions_inches[2] * 2.54);
            }
        }
    }
}
