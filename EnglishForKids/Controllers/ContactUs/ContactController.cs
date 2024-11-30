using Microsoft.AspNetCore.Mvc;

namespace EnglishForKids.Controllers.ContactUs
{
    public class ContactController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
