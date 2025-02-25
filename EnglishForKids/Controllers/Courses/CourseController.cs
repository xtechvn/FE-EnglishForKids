﻿using EnglishForKids.Controllers.Course.Service;

using EnglishForKids.Models;
using EnglishForKids.Service.Redis;
using EnglishForKids.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace EnglishForKids.Controllers.Course
{
    public class CourseController : Controller
    {
        private readonly IConfiguration configuration;
        private readonly RedisConn redisService;
        public CourseController(IConfiguration _configuration, RedisConn _redisService)
        {
            configuration = _configuration;
            redisService = _redisService;
        }
        // Layout trang chủ news dùng chung với trang Category cấp 2
        [Route("khoa-hoc")]
        [HttpGet]
        public async Task<IActionResult> Index(string path, int category_id, int page = 1, string category_path_child = "")
        {
            // Khởi tạo các param phân vào các ViewComponent
            var article_sv = new CourseService(configuration, redisService);

            ViewBag.category_id = -1;// Convert.ToInt32(configuration["menu:news_parent_id"]);
            ViewBag.page = page;
            ViewBag.page_size = Convert.ToInt32(configuration["blognews:page_size"]);
            ViewBag.total_items = await article_sv.getTotalNews(-1); // Lấy ra tổng toàn bộ bản ghi theo chuyên mục
            return View();
        }



        //[Route("khoa-hoc/{title}-{course_id}.html")]
        //[HttpGet]
        //public async Task<IActionResult> CourseDetail(string title, long course_id)
        //{
        //    // Key trong Redis tương ứng với khóa học
        //    string redisKey = $"COURSE_DETAIL_{course_id}";
        //    int redisDbIndex = int.Parse(configuration["Redis:Database:db_course"]);
        //    string redisData = await redisService.GetAsync(redisKey, redisDbIndex);
        //    if (string.IsNullOrEmpty(redisData))
        //    {
        //        // Nếu không tìm thấy dữ liệu trong Redis
        //        return NotFound("Không tìm thấy thông tin khóa học.");
        //    }
        //    // Parse dữ liệu JSON từ Redis sang object
        //    var courseModel = JsonConvert.DeserializeObject<CourseDetailViewModel>(redisData);
        //    if (courseModel == null  || courseModel.Chapters == null)
        //    {
        //        return NotFound("Dữ liệu không hợp lệ.");
        //    }

        //    return View("~/Views/Course/CourseDetail.cshtml", courseModel);
        //}

        [Route("khoa-hoc/{title}-{course_id}.html")]
        [HttpGet]
        public async Task<IActionResult> QuizDetail(string title, int course_id)
        {
            // Key trong Redis tương ứng với khóa học
            string redisKey = $"COURSE_DETAIL_{course_id}";
            int redisDbIndex = int.Parse(configuration["Redis:Database:db_course"]);
            string redisData = await redisService.GetAsync(redisKey, redisDbIndex);
            if (string.IsNullOrEmpty(redisData))
            {
                // Nếu không tìm thấy dữ liệu trong Redis
                return NotFound("Không tìm thấy thông tin khóa học.");
            }
            // Parse dữ liệu JSON từ Redis sang object
            var courseModel = JsonConvert.DeserializeObject<CourseDetailViewModel>(redisData);
            if (courseModel == null || courseModel.Source == null || courseModel.Chapters == null)
            {
                return NotFound("Dữ liệu khóa học không hợp lệ.");
            }

            return View("~/Views/Course/QuizDetail.cshtml", courseModel);
        }

        /// <summary>
        /// Lấy ra các bài viết mới nhất của các chuyên mục
        /// </summary>
        /// <param name="category_id">-1 là quét all các bài viết của các mục, >0 lấy theo chuyên mục</param>
        /// <param name="position_name">Vị trí cần bind data</param>
        /// <returns></returns>
        [Route("courses/home/get-course-list.json")]
        [HttpPost]
        public async Task<IActionResult> getCourseListByCategoryIdComponent(int category_id, string view_name, int page)
        {
            try
            {
                // Tính phân trang load tin
                int page_size = Convert.ToInt32(configuration["blognews:page_size"]);
                page = page == 0 ? 1 : page;
                int skip = (page - 1) * page_size;

                var model = new CategoryConfigModel
                {
                    category_id = category_id,                
                    view_name = view_name,                    
                    skip = skip,
                    take = page_size
                };
                return ViewComponent("CourseList", model);
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                //_logger.LogError(ex, "Error loading header component");
                return StatusCode(500); // Trả về lỗi 500 nếu có lỗi
            }
        }

    }
}
