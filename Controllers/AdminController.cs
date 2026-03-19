using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using rent_a_car.Data;
using rent_a_car.Models;
using System.Linq;

namespace rent_a_car.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. DASHBOARD
        public IActionResult Index()
        {
            ViewBag.TotalCars = _context.Cars.Count();
            ViewBag.RentedCars = _context.Cars.Count(x => x.IsAvailable == false);
            return View();
        }

        // 2. ARAÇ LİSTESİ (Sadece sağlamları gösterir, hasarlıları ayırır)
        public IActionResult CarList()
        {
            // Listede sadece "Hasarlı Olmayanları" veya hepsini görebilirsin.
            // Karışıklık olmasın diye hepsini çekiyoruz, View'da boyayacağız.
            var cars = _context.Cars.ToList();
            return View(cars);
        }

        // 3. ARAÇ EKLEME
        [HttpGet]
        public IActionResult CarAdd()
        {
            return View();
        }

        [HttpPost]
        public IActionResult CarAdd(Car p)
        {
            if (ModelState.IsValid)
            {
                p.IsAvailable = true;
                p.IsDamaged = false; // Yeni araç sağlamdır
                _context.Cars.Add(p);
                _context.SaveChanges();
                return RedirectToAction("CarList");
            }
            return View(p);
        }

        // 4. ARAÇ SİLME
        public IActionResult DeleteCar(int id)
        {
            var car = _context.Cars.Find(id);
            if (car != null)
            {
                _context.Cars.Remove(car);
                _context.SaveChanges();
            }
            return RedirectToAction("CarList");
        }

        // --- YENİ EKLENEN: ARAÇ DÜZENLEME ---
        [HttpGet]
        public IActionResult CarEdit(int id)
        {
            var car = _context.Cars.Find(id);
            if (car == null) return RedirectToAction("CarList");
            return View(car);
        }

        [HttpPost]
        public IActionResult CarEdit(Car p)
        {
            var car = _context.Cars.Find(p.Id);
            if (car != null)
            {
                car.Brand = p.Brand;
                car.Model = p.Model;
                car.Plate = p.Plate;
                car.DailyPrice = p.DailyPrice;
                car.ImageUrl = p.ImageUrl;
                car.Gear = p.Gear;
                car.Fuel = p.Fuel;
                _context.SaveChanges();
                return RedirectToAction("CarList");
            }
            return View(p);
        }

        // --- YENİ EKLENEN: HASAR SİSTEMİ ---

        // A) Arızalı Araçlar Listesi
        public IActionResult DamagedVehicles()
        {
            var damagedCars = _context.Cars.Where(x => x.IsDamaged == true).ToList();
            return View(damagedCars);
        }

        // B) Arıza Bildir (Sağlam -> Hasarlı)
        public IActionResult ReportDamage(int id)
        {
            var car = _context.Cars.Find(id);
            if (car != null)
            {
                car.IsDamaged = true;     // Hasarlı oldu
                car.IsAvailable = false;  // Artık kiralanamaz
                _context.SaveChanges();
            }
            return RedirectToAction("CarList");
        }

        // C) Tamir Et (Hasarlı -> Sağlam)
        public IActionResult RepairVehicle(int id)
        {
            var car = _context.Cars.Find(id);
            if (car != null)
            {
                car.IsDamaged = false;   // Tamir edildi
                car.IsAvailable = true;  // Tekrar kiralanabilir
                _context.SaveChanges();
            }
            return RedirectToAction("DamagedVehicles");
        }

        // 5. KİRALAMA SİSTEMİ
        public IActionResult Rentals()
        {
            var rentals = _context.Rentals.Include(r => r.Car).ToList();
            return View(rentals);
        }

        [HttpGet]
        public IActionResult RentalCreate()
        {
            // Sadece Müsait Olan VE Hasarlı Olmayan araçları getir
            ViewBag.Cars = _context.Cars.Where(x => x.IsAvailable == true && x.IsDamaged == false).ToList();
            return View();
        }

        [HttpPost]
        public IActionResult RentalCreate(Rental p)
        {
            if (p.CarId != 0 && p.ReturnDate >= p.RentDate)
            {
                _context.Rentals.Add(p);
                var car = _context.Cars.Find(p.CarId);
                if (car != null) car.IsAvailable = false;

                _context.SaveChanges();
                return RedirectToAction("Rentals");
            }
            ViewBag.Cars = _context.Cars.Where(x => x.IsAvailable == true && x.IsDamaged == false).ToList();
            return View(p);
        }

        public IActionResult RentalReturn(int id)
        {
            var rental = _context.Rentals.Find(id);
            if (rental != null)
            {
                var car = _context.Cars.Find(rental.CarId);
                if (car != null) car.IsAvailable = true;
                _context.SaveChanges();
            }
            return RedirectToAction("Rentals");
        }
    }
}