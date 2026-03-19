using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace rent_a_car.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult LoginSelection()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string Email, string Password)
        {
            if (Email == "admin@oto.com" && Password == "123")
            {
                HttpContext.Session.SetString("UserRole", "Admin");
                return RedirectToAction("Index", "Admin");
            }
            ViewBag.Error = "Hatalı Giriş!";
            return View();
        }

        [HttpGet] // Sayfayı ilk açan metot
        public IActionResult CustomerLogin()
        {
            return View();
        }

        [HttpPost] // Form gönderildiğinde çalışan metot
        public IActionResult CustomerLogin(string email, string password)
        {
            if (email == "musteri@gmail.com" && password == "123")
            {
                HttpContext.Session.SetString("UserRole", "Customer");
                return RedirectToAction("UserPanel");
            }

            ViewBag.Error = "Hatalı E-Posta veya Şifre!";
            return View();
        }

        public IActionResult UserPanel()
        {
            if (HttpContext.Session.GetString("UserRole") != "Customer")
            {
                return RedirectToAction("CustomerLogin");
            }

            // Arkadaşının panel tasarımı için gerekli ViewBag verileri
            ViewBag.AktifKiralamaVarMi = true;
            ViewBag.AktifArac = new
            {
                Resim = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
                Marka = "Peugeot",
                Model = "3008 SUV",
                Plaka = "01 ADN 001",
                TeslimTarihi = DateTime.Now.AddDays(5).ToString("dd.MM.yyyy"),
                KalanGun = 5
            };

            ViewBag.Favoriler = new List<dynamic>
            {
                new { Id=1, Resim="https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=600&q=80", Marka="BMW", Model="520i", Fiyat=4200, Yakit="Benzin", Vites="Otomatik", Koltuk=5 },
                new { Id=2, Resim="https://im.haberturk.com/2021/01/22/ver1611311059/2947087_810x458.jpg", Marka="Fiat", Model="Egea", Fiyat=1100, Yakit="Dizel", Vites="Manuel", Koltuk=5 },
                new { Id=3, Resim="https://cdn.motor1.com/images/mgl/mMPW3/s1/renault-megane-e-tech-electric.jpg", Marka="Renault", Model="Clio", Fiyat=900, Yakit="Benzin", Vites="Manuel", Koltuk=4 }
            };

            ViewBag.Gecmis = new List<dynamic>
            {
                new { Resim="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80", Marka="Toyota", Model="Corolla" }
            };

            return View();
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Index", "Home");
        }
        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(string FirstName, string LastName, string Email, string Password)
        {
            // Şimdilik sadece kayıt başarılıymış gibi girişe yönlendiriyoruz
            return RedirectToAction("CustomerLogin");
        }
    }
}