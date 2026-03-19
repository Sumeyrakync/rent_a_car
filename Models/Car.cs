using System.ComponentModel.DataAnnotations;

namespace rent_a_car.Models
{
    public class Car
    {
        [Key]
        public int Id { get; set; }

        public string Brand { get; set; }
        public string Model { get; set; }
        public string Plate { get; set; }
        public string Fuel { get; set; }
        public string Gear { get; set; }
        public decimal DailyPrice { get; set; }
        public bool IsAvailable { get; set; }
        public string ImageUrl { get; set; }

        // YENİ EKLENEN ÖZELLİK:
        public bool IsDamaged { get; set; } = false; // Hasarlı mı?
    }
}