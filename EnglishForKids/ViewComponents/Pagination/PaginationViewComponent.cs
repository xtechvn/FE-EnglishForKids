using EnglishForKids.ViewModels.Paginated;
using Microsoft.AspNetCore.Mvc;

namespace EnglishForKids.ViewComponents.Pagination
{
    public class PaginationViewComponent : ViewComponent
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="total_items">Tổng toàn bộ bản ghi</param>
        /// <param name="page">index page</param>
        /// <param name="page_size">Số tin trên 1 page</param>
        /// <returns></returns>
        public async Task<IViewComponentResult?> InvokeAsync(int total_items, int page_size, string view, int page = 1)
        {
			try
			{                
                // Calculate total number of pages
                var totalPages = (int)Math.Ceiling((double)total_items / page_size);

                var view_model = new PaginationNewsViewModel
                {
					CurrentPage = page,
					TotalPages = totalPages
                };
				return View(view, view_model);
			}
			catch (Exception ex)
			{

				throw;
			}
        }
    }
}
