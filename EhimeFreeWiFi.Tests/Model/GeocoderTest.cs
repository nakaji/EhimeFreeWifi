using System;
using EhimeFreeWiFi.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace EhimeFreeWiFi.Tests.Model
{
    [TestClass]
    public class GeocoderTest
    {
        [TestMethod]
        public void 住所から位置情報を取得する()
        {
            var sut = new Geocoder();

            var actual = sut.GetLocationFromAddress("愛媛県松山市二番町４丁目７−２");

            Assert.AreEqual(33.8396935, actual.Latitude);
            Assert.AreEqual(132.7653669, actual.Longtitude);
        }
    }
}
