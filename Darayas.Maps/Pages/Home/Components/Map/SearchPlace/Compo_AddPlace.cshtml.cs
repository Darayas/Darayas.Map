using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Darayas.Maps.Logger;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Darayas.Maps.Pages.Home.Components.Map.SearchPlace
{
    public class Compo_AddPlaceModel : PageModel
    {
        NLog.Logger logger;
        public Compo_AddPlaceModel()
        {
            logger = NLogger.Instance.GetCurrentClassLogger();
        }
        public IActionResult OnGet()
        {
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {

            return Page();
        }


        public int Input { get; set; }
    }
}