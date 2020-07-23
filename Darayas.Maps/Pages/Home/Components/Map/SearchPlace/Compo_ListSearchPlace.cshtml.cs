using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Darayas.Maps.DAL.Models;
using Darayas.Maps.DAL.Repository;
using Darayas.Maps.Logger;
using Darayas.Maps.Models.ViewInputs;
using Darayas.Maps.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace Darayas.Maps.Pages.Home.Components.Map.SearchPlace
{
    public class Compo_ListSearchPlaceModel : PageModel
    {
        NLog.Logger logger;
        public Compo_ListSearchPlaceModel()
        {
            logger = NLogger.Instance.GetCurrentClassLogger();
            Data = new List<vmCompo_ListSearch>();
            Input = new viCompo_ListSearch();
        }

        public async Task<IActionResult> OnGetAsync()
        {
            try
            {
                #region واکشی مکان ها از دیتابیس
                SqlRepository<tblPalces> repPalce = new SqlRepository<tblPalces>();

                double _NorthEastLat = double.Parse(Input.NorthEast.Split(new char[] { ',' })[0].Trim());
                double _NorthEastLng = double.Parse(Input.NorthEast.Split(new char[] { ',' })[1].Trim());

                double _SouthWestLat = double.Parse(Input.SouthWest.Split(new char[] { ',' })[0].Trim());
                double _SouthWestLng = double.Parse(Input.SouthWest.Split(new char[] { ',' })[1].Trim());

                var qLocalPlace = await repPalce.Get()
                    .Where(a => a.Zoom <= Input.Zoom)
                    .Where(a => a.Lat <= _NorthEastLat)
                    .Where(a => a.Lng <= _NorthEastLng)
                    .Where(a => a.Lat >= _SouthWestLat)
                    .Where(a => a.Lng >= _SouthWestLng)
                    .Select(a => new vmCompo_Places
                    {
                        Category = a.tblPalceCategoris.Title,
                        ImgName = a.tblPalceCategoris.ImgName,
                        Lat = a.Lat,
                        Lng = a.Lng,
                        Name = a.Name
                    }).ToListAsync();
                #endregion

                #region واکشی اطلاعات از سرویس دهنده ها
                //string _Data = Input.JsonData.Trim(new char[] { '[' }).Trim(new char[] { ']' });
                //var JsonData = JObject.Parse(_Data);


                //var qData = from a in JsonData["instructions"]
                //            select new vmCompo_GetLstRoads
                //            {
                //                Road = a["road"].ToString(),
                //                Text = a["text"].ToString(),
                //                Dist = double.Parse(a["distance"].ToString()),
                //                Time = double.Parse(a["time"].ToString()),
                //            };

                //Data = qData.ToList();
                #endregion

                return Page();
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw ex;
            }
        }

        [BindProperty(SupportsGet = true)]
        public viCompo_ListSearch Input { get; set; }
        public List<vmCompo_ListSearch> Data { get; set; }
    }
}