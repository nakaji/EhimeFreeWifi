using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using Codeplex.Data;

namespace EhimeFreeWiFi.Models
{
    public class Geocoder : IDisposable
    {
        private WebClient wc;

        public Geocoder()
        {
            wc = new WebClient();
        }

        public void Dispose()
        {
            wc.Dispose();
        }

        public GeoLocation GetLocationFromAddress(string address)
        {
            var url = string.Format("http://maps.google.com/maps/api/geocode/json?address={0}",
                HttpUtility.UrlEncode(address));

            var result = wc.DownloadData(url);
            var jsonString = Encoding.UTF8.GetString(result);

            var placeInfo = DynamicJson.Parse(jsonString);
            if (placeInfo.status != "OK") return null;

            var location = placeInfo.results[0].geometry.location;
            return new GeoLocation()
            {
                Latitude = location.lat,
                Longtitude = location.lng,
            };
        }
    }
}