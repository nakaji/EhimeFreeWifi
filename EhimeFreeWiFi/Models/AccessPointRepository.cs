using Sgml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Xml.Linq;

namespace EhimeFreeWiFi.Models
{
    public class AccessPointRepository
    {
        private readonly Func<IEnumerable<AccessPoint>> _getAccessPoints;

        public AccessPointRepository()
        {
            _getAccessPoints = () =>
            {
                var urlString = "http://www.pref.ehime.jp/h12600/wifi/osirase260822.html";

                XDocument xml;
                using (var sgml = new SgmlReader() { Href = urlString, IgnoreDtd = true })
                {
                    xml = XDocument.Load(sgml);
                }

                var ns = xml.Root.Name.Namespace;
                var spots = xml.Descendants(ns + "table")
                    .Last()
                    .Descendants(ns + "tr")
                    .Skip(1) // タイトルをスキップ
                    .Select(e => e.Elements(ns + "td").ToList())
                    .Select(x => new AccessPoint
                    {
                        Place = x[1].Value,
                        Address = x[2].Value,
                        ServiceProvider = x[3].Value
                    });
                return spots;
            };
        }

        public AccessPointRepository(Func<IEnumerable<AccessPoint>> func)
        {
            _getAccessPoints = func;
        }


        public IEnumerable<AccessPoint> All()
        {
            var accessPoints = WebCache.Get("AccessPoints");

            if (accessPoints != null) return accessPoints;

            var spots = _getAccessPoints();

            WebCache.Set("AccessPoints", spots, 60 * 24, false);
            return spots;
        }
    }
}