using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Helpers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EhimeFreeWiFi.Models;

namespace EhimeFreeWiFi.Tests.Model
{
    [TestClass]
    public class AccessPointRepositoryTest
    {
        [TestMethod]
        public void キャッシュがない場合はWebから取得()
        {
            var sut = new AccessPointRepository(() => new List<AccessPoint> { new AccessPoint(), new AccessPoint(), new AccessPoint() });
            WebCache.Remove("AccessPoints");

            var spots = sut.All();

            Assert.AreEqual(3, spots.Count());
        }

        [TestMethod]
        public void キャッシュがある場合はキャッシュの内容を返す()
        {
            var sut = new AccessPointRepository(() => new List<AccessPoint> { new AccessPoint(), new AccessPoint(), new AccessPoint() });
            WebCache.Set("AccessPoints", new List<AccessPoint> { new AccessPoint() });

            var spots = sut.All();

            Assert.AreEqual(1, spots.Count());
        }
    }
}
