using Telegram.Bot;

namespace EnglishForKids.Utilities
{
    public static class LogHelper
    {
      
        /// <summary>
        /// function ghi log vao telegram
        /// </summary>
        /// <param name="botToken">Token cua bot </param>
        /// <param name="group_Id">chat Id cua nhom hoac ca nhan</param>
        /// <param name="message">noi dung can gui</param>
        /// <returns>1: thanh cong</returns>
        /// <returns>-1: loi</returns>
        /// <createDate>14-04-2020</createDate>
        /// <author>ThangNV</author>
        public static int InsertLogTelegram(string botToken, string group_Id, string message)
        {
            var rs = 1;
            try
            {
                TelegramBotClient alertMsgBot = new TelegramBotClient(botToken);
                alertMsgBot.SendTextMessageAsync(group_Id, message);
            }
            catch (Exception ex)
            {
                rs = -1;
            }
            return rs;
        }

      
       
        public static void InsertLogTelegramByUrl(string bot_token, string id_group, string msg)
        {
            string JsonContent = string.Empty;
            string url_api = "https://api.telegram.org/bot" + bot_token + "/sendMessage?chat_id=" + id_group + "&text=" + msg;
            try
            {
                using (var webclient = new System.Net.WebClient())
                {
                    JsonContent = webclient.DownloadString(url_api);
                }
            }
            catch (Exception ex)
            {

            }
        }


        public static void WriteLogActivity(string AppPath, string log_content)
        {
            StreamWriter sLogFile = null;
            try
            {
                //Ghi lại hành động của người sử dụng vào log file
                string sDay = string.Format("{0:dd}", DateTime.Now);
                string sMonth = string.Format("{0:MM}", DateTime.Now);
                string strLogFileName = sDay + "-" + sMonth + "-" + DateTime.Now.Year + ".log";
                string strFolderName = AppPath + @"\Logs\" + DateTime.Now.Year + "-" + sMonth;
                //Application.StartupPath
                //Tạo thư mục nếu chưa có
                if (!Directory.Exists(strFolderName + @"\"))
                {
                    Directory.CreateDirectory(strFolderName + @"\");
                }
                strLogFileName = strFolderName + @"\" + strLogFileName;

                if (File.Exists(strLogFileName))
                {
                    //Nếu đã tồn tại file thì tiếp tục ghi thêm
                    sLogFile = File.AppendText(strLogFileName);
                    sLogFile.WriteLine(string.Format("Thời điểm ghi nhận: {0:hh:mm:ss tt}", DateTime.Now));
                    sLogFile.WriteLine(string.Format("Chi tiết log: {0}", log_content));
                    sLogFile.WriteLine("-------------------------------------------");
                    sLogFile.Flush();
                }
                else
                {
                    //Nếu file chưa tồn tại thì có thể tạo mới và ghi log
                    sLogFile = new StreamWriter(strLogFileName);
                    sLogFile.WriteLine(string.Format("Thời điểm ghi nhận: {0:hh:mm:ss tt}", DateTime.Now));
                    sLogFile.WriteLine(string.Format("Chi tiết log: {0}", log_content));
                    sLogFile.WriteLine("-------------------------------------------");
                }
                sLogFile.Close();
            }
            catch (Exception)
            {
                if (sLogFile != null)
                {
                    sLogFile.Close();
                }
            }
        }

    }
}
