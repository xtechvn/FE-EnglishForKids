using EnglishForKids.Service.Redis;
using EnglishForKids.ViewComponents.GroupProduct;
using EnglishForKids.ViewComponents.Header;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Net.Http.Headers;

namespace EnglishForKids
{
    public class Startup
    {
        //public static string API_GEN_TOKEN = ReadFile.LoadConfig().API_GEN_TOKEN;
        // public static int TimeOutVerifyEmail = Convert.ToInt32(ReadFile.LoadConfig().timeout_verify_email); // phut
        //public static string KEY_PRIVATE_TOKEN = "YourKey-2374-OFFKDI940NG7:56753253-tyuw-5769-0921-kfirox29zoxv";
        private readonly IConfiguration Configuration;//
        public Startup(IConfiguration configuration)
        {

            Configuration = configuration;
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();            
            services.AddRazorPages();

            services.AddResponseCaching(); // Cho phép sử dụng Response Caching
            services.AddMemoryCache(); // Đăng ký Memory Cache
            services.AddControllersWithViews();
            services.AddScoped<GroupProductViewComponent>(); // Đảm bảo đã thêm HeaderViewComponent
            services.AddScoped<HeaderViewComponent>(); // Đảm bảo đã thêm HeaderViewComponent
            // Register services                      
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            // Khởi tạo các dịch vụ cần thiết
            
           
            services.AddSingleton<RedisConn>(); // Đảm bảo RedisConn được khởi tạo

            /// Thêm nén các file css/js/... theo chuẩn Br và Gzip --> Web load nhanh hơn
            services.AddResponseCompression(options =>
            {
                options.Providers.Add<BrotliCompressionProvider>();
                options.Providers.Add<GzipCompressionProvider>();
            });
           

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, RedisConn redisService)
        {

            if (env.IsDevelopment())
            {
                //app.UseStatusCodePagesWithRedirects("/Error/{0}");
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseStatusCodePagesWithRedirects("/Error/{0}");
            }


            //Addd User session  - JWT
            

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseRouting();

            /// Sử dụng các file như css/js/img --> Set cache với thời gian là 1 d
            /// GoLive mới nhảy vào đây
            if (!env.IsDevelopment())
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    OnPrepareResponse = ctx =>
                    {
                        const int durationInSeconds = 60 * 60 * 24;// 60 * 60 * 24 * 30;
                        ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                                "public,max-age=" + durationInSeconds;
                    }
                });
            }
            app.UseAuthentication();
            //Redis conn Call the connect method
            redisService.Connect();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute("Default", "{controller=Home}/{action=Index}/{id?}");
            }); 
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "san-pham",
                    pattern: "/san-pham/{title}--{product_code}",
                    defaults: new { controller = "Product", action = "Detail" });
            });
        }
    }
}
