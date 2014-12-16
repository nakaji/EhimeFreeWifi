using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using EhimeFreeWiFi;
using EhimeFreeWiFi.Controllers;

namespace EhimeFreeWiFi.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        [TestMethod]
        public void Index()
        {
            // 準備
            HomeController controller = new HomeController();

            // 実行
            ViewResult result = controller.Index() as ViewResult;

            // アサート
            Assert.IsNotNull(result);
            Assert.AreEqual("Home Page", result.ViewBag.Title);
        }
    }
}
