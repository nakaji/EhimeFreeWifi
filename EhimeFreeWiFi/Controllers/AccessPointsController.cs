using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EhimeFreeWiFi.Models;

namespace EhimeFreeWiFi.Controllers
{
    public class AccessPointsController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<AccessPoint> Get()
        {
            var repos = new AccessPointRepository();

            return repos.All();
        }
    }
}