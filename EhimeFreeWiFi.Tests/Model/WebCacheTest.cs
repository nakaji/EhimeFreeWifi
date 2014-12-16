using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EhimeFreeWiFi.Tests.Model
{
    [TestClass]
    public class WebCacheTest
    {
        [TestMethod]
        public void 該当するデータがなければnull()
        {
            Assert.IsNull(System.Web.Helpers.WebCache.Get("1"));
        }

        [TestMethod]
        public void 該当するデータがあればDynamic()
        {
            System.Web.Helpers.WebCache.Set("1", "hoge");
            Assert.AreEqual("hoge", System.Web.Helpers.WebCache.Get("1"));
        }
    }
}
