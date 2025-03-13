using EnglishForKids.Contants;
using EnglishForKids.Models;
using EnglishForKids.Models.Course;
using EnglishForKids.Service.Redis;
using EnglishForKids.Utilities;
using EnglishForKids.Utilities.Lib;
using EnglishForKids.ViewModels;
using Microsoft.VisualBasic.FileIO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Reflection;

namespace EnglishForKids.Controllers.Course.Service
{
    public class CourseService : APIService
    {
        private readonly IConfiguration _configuration;
        private readonly RedisConn redisService;

        public CourseService(IConfiguration configuration, RedisConn _redisService) : base(configuration)
        {
            _configuration = configuration;
            redisService = _redisService;
        }
        /// <summary>
        /// Chi tiết bài viết
        /// </summary>
        /// <param name="article_id"></param>
        /// <returns></returns>
        public async Task<ArticleDetailModel?> getCourseDetailById(long article_id)
        {
            try
            {
                string response_api = string.Empty;
                var connect_api_us = new ConnectApi(_configuration, redisService);
                var input_request = new Dictionary<string, long>
                {
                    {"article_id",article_id }
                };

                response_api = await connect_api_us.CreateHttpRequest("/api/news/get-article-detail.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    var article = JsonConvert.DeserializeObject<ArticleDetailModel>(JsonParent[0]["data"].ToString());
                    return article;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                Utilities.LogHelper.InsertLogTelegramByUrl(_configuration["log_telegram:token"], _configuration["log_telegram:group_id"], error_msg);
                return null;
            }
        }

        public async Task<LessonDetailResponse?> GetLessonDetail(LessonDetail request)
        {
            try
            {
                string apiResponse = string.Empty;
                var connect_api_us = new ConnectApi(_configuration, redisService);

                // 🔥 Gửi yêu cầu lấy chi tiết bài học đến API backend
                var requestBody = new LessonDetail
                {
                    LessonId = request.LessonId,
                    CourseId = request.CourseId,

                };

                apiResponse = await POST(_configuration["API:get_lesson_detail"], request);

                var jsonData = JObject.Parse(apiResponse);
                //int status = int.Parse(jsonData["status"].ToString());

                return new LessonDetailResponse
                {
                    VideoUrl = jsonData["videoUrl"]?.ToString(),
                    AudioUrl = jsonData["audioUrl"]?.ToString(),
                    ArticleContent = jsonData["articleContent"]?.ToString(),
                    ArticleFiles = jsonData["articleFilesJson"] != null
                ? jsonData["articleFilesJson"].Select(f => new LessonFile
                {
                    Name = f["name"]?.ToString(),
                    Path = f["path"]?.ToString()
                }).ToList()
                : new List<LessonFile>(),
                    QuizData = jsonData["quizDataJson"] != null
                ? jsonData["quizDataJson"].Select(q => new QuizQuestion
                {
                    QuestionId = q["questionId"].ToObject<int>(),
                    QuestionText = q["questionText"]?.ToString(),
                    Options = q["options"].Select(o => new QuizOption
                    {
                        OptionId = o["optionId"].ToObject<int>(),
                        OptionText = o["optionText"]?.ToString()
                    }).ToList()
                }).ToList()
                : new List<QuizQuestion>()
                };
            }
            catch (Exception ex)
            {
                 return null;
            }
        }

        public async Task<QuizResultResponse?> SubmitQuizAnswer(SubmitQuizAnswer request)
        {
            try
            {
                int userId = 1; // Lấy từ session hoặc context
                string apiResponse = string.Empty;
                var connect_api_us = new ConnectApi(_configuration, redisService);

                // 1️⃣ Gửi đáp án lên API `QuizResult` để lưu vào DB
                var requestBody = new SubmitQuizAnswer
                {
                    SourceId = request.SourceId,
                    QuizId = request.QuizId,
                    QuizAnswerId = request.QuizAnswerId,
                    UserId = userId
                };

                apiResponse = await POST(_configuration["API:quiz_result"], request);
                //var apiResult = await apiResponse.Content.ReadAsStringAsync();
                var jsonData = JObject.Parse(apiResponse);
                int status = int.Parse(jsonData["status"].ToString());
                return new QuizResultResponse
                {
                    Status = status == (int)ResponseType.SUCCESS,
                    IsCorrect = bool.Parse(jsonData["IsCorrect"].ToString()),
                    CorrectAnswerNote = jsonData["CorrectAnswerNote"]?.ToString(),
                    Message = jsonData["Message"].ToString()
                };


            }
            catch (Exception ex)
            {
                return new QuizResultResponse { Status = false, Message = "Lỗi hệ thống: " + ex.Message };
            }
        }


        public async Task<QuizProgressResponse?> GetQuizResults(GetQuizResultRequest request)
        {
            try
            {
                int userId = request.UserId;
                int quizId = request.QuizId;
                string apiResponse = string.Empty;
                var connect_api_us = new ConnectApi(_configuration, redisService);

                // 1️⃣ Gọi API lấy kết quả quiz từ database
                var requestBody = new GetQuizResultRequest
                {
                    QuizId = quizId,
                    UserId = userId
                };

                apiResponse = await POST(_configuration["API:quiz_get_results"], request);
                // Nhan ket qua tra ve                            
                var jsonData = JObject.Parse(apiResponse);
                int status = int.Parse(jsonData["Status"].ToString());
                if (status != (int)ResponseType.SUCCESS)
                {
                    return new QuizProgressResponse
                    {
                        Status = false,
                        Message = jsonData["Message"].ToString()
                    };
                }

                return new QuizProgressResponse
                {
                    Status = status == (int)ResponseType.SUCCESS,
                    Completed = jsonData["Completed"] != null && bool.Parse(jsonData["Completed"].ToString()),

                    NextQuestionIndex = jsonData["NextQuestionIndex"] != null
                          ? (int?)int.Parse(jsonData["NextQuestionIndex"].ToString())
                          : null,  // 🛑 Nếu không có thì để null tránh lỗi

                    CorrectCount = jsonData["CorrectCount"] != null
                     ? int.Parse(jsonData["CorrectCount"].ToString())
                     : 0,  // 🛑 Nếu không có thì mặc định là 0

                    CorrectAnswers = jsonData["CorrectAnswers"] != null
                       ? jsonData["CorrectAnswers"].ToObject<List<QuestionViewModel>>()
                       : new List<QuestionViewModel>(), // 🛑 Nếu null thì trả về danh sách rỗng
                    SkippedQuestions = jsonData["SkippedQuestions"] != null
                       ? jsonData["SkippedQuestions"].ToObject<List<QuestionViewModel>>()
                       : new List<QuestionViewModel>(), // 🛑 Nếu null thì trả về danh sách rỗng
                    AllQuestions = jsonData["AllQuestions"] != null
                       ? jsonData["AllQuestions"].ToObject<List<QuestionViewModel>>()
                       : new List<QuestionViewModel>(), // 🛑 Nếu null thì trả về danh sách rỗng

                    IncorrectAnswers = jsonData["IncorrectAnswers"] != null
                         ? jsonData["IncorrectAnswers"].ToObject<List<QuestionViewModel>>()
                         : new List<QuestionViewModel>() // 🛑 Nếu null thì trả về danh sách rỗng
                };

            }
            catch (Exception ex)
            {
                return new QuizProgressResponse { Status = false, Message = "Lỗi hệ thống: " + ex.Message };
            }
        }

        public async Task<bool> ResetQuizResults(GetQuizResultRequest request)
        {
            try
            {
                int userId = request.UserId;
                int quizId = request.QuizId;
                string apiResponse = string.Empty;

                // 1️⃣ Gọi API để reset quiz từ database
                apiResponse = await POST(_configuration["API:quiz_reset"], request);

                // 2️⃣ Nhận kết quả trả về
                var jsonData = JObject.Parse(apiResponse);
                int status = int.Parse(jsonData["status"].ToString());

                if (status != (int)ResponseType.SUCCESS)
                {
                    Console.WriteLine("❌ Lỗi khi reset quiz: " + jsonData["message"].ToString());
                    return false;
                }

                Console.WriteLine("✅ Quiz đã reset thành công!");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Lỗi hệ thống khi reset quiz: " + ex.Message);
                return false;
            }
        }


        //public async Task<ArticleViewModel?> getArticleByCategoryId(int category_id, int top, int skip)
        //{
        //    try
        //    {
        //        string response_api = string.Empty;
        //        var connect_api_us = new ConnectApi(configuration, redisService);
        //        var input_request = new Dictionary<string, string>
        //        {
        //            {"category_id",category_id.ToString() },
        //             {"skip",skip.ToString() },
        //             {"take", top.ToString()}
        //        };

        //        response_api = await connect_api_us.CreateHttpRequest("/api/news/get-list-by-categoryid.json", input_request);

        //        // Nhan ket qua tra ve                            
        //        var JsonParent = JArray.Parse("[" + response_api + "]");
        //        int status = Convert.ToInt32(JsonParent[0]["status"]);

        //        if (status == ((int)ResponseType.SUCCESS))
        //        {
        //            var _category_detail = JsonConvert.DeserializeObject<CategoryModel>(JsonParent[0]["category_detail"].ToString());
        //            var _list_article = JsonConvert.DeserializeObject<List<CategoryArticleModel>>(JsonParent[0]["data"].ToString());

        //            var model = new ArticleViewModel
        //            {
        //                obj_article_list = _list_article,
        //                category_detail = _category_detail
        //            };
        //            return model;
        //        }
        //        else
        //        {
        //            return null;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
        //        Utilities.LogHelper.InsertLogTelegramByUrl(configuration["log_telegram:token"], configuration["log_telegram:group_id"], error_msg);
        //        return null;
        //    }
        //}
        /// <summary>
        /// Lấy ra các tin mới nhất trang chủ dc set top của tất cả các chuyên mục
        /// </summary>
        /// <param name="category_id"></param>
        /// <param name="top"></param>ssjujuuj
        /// <param name="skip"></param>
        /// <returns></returns>
        public async Task<CourseViewModel?> getListCourse(int category_id, int skip, int top)
        {
            try
            {
                string response_api = string.Empty;
                var connect_api_us = new ConnectApi(_configuration, redisService);
                var input_request = new Dictionary<string, int>
                {
                     {"skip", skip},
                     {"top", top},
                     {"category_id", category_id}
                };


                // Lấy các tin được đăng gần nhất
                response_api = await connect_api_us.CreateHttpRequest("/api/courses/get-list-courses.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    var _list_article = JsonConvert.DeserializeObject<List<CategoryCourseModel>>(JsonParent[0]["data"].ToString());
                    var model = new CourseViewModel
                    {
                        category_id = category_id,
                        obj_article_list = _list_article
                    };
                    return model;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                Utilities.LogHelper.InsertLogTelegramByUrl(_configuration["log_telegram:token"], _configuration["log_telegram:group_id"], error_msg);
                return null;
            }
        }
        /// <summary>
        /// Tổng bài viết của 1 cate để phân trang
        /// </summary>
        /// <param name="category_id"></param>
        /// <returns></returns>
        public async Task<int> getTotalNews(int category_id)
        {
            try
            {
                string response_api = string.Empty;
                var connect_api_us = new ConnectApi(_configuration, redisService);
                var input_request = new Dictionary<string, int>
                {
                     {"category_id",category_id }
                };

                response_api = await connect_api_us.CreateHttpRequest("/api/courses/get-total-courses.json", input_request);

                // Nhan ket qua tra ve                            
                var JsonParent = JArray.Parse("[" + response_api + "]");
                int status = Convert.ToInt32(JsonParent[0]["status"]);

                if (status == ((int)ResponseType.SUCCESS))
                {
                    int total_items = Convert.ToInt32(JsonParent[0]["data"]);
                    return total_items;
                }
                else
                {
                    return 0;
                }

            }
            catch (Exception ex)
            {
                string error_msg = Assembly.GetExecutingAssembly().GetName().Name + "->" + MethodBase.GetCurrentMethod().Name + "=>" + ex.Message;
                Utilities.LogHelper.InsertLogTelegramByUrl(_configuration["log_telegram:token"], _configuration["log_telegram:group_id"], error_msg);
                return 0;
            }
        }

    }
}
