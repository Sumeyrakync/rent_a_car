using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace rent_a_car.Models
{
    public class Rental
    {
        public int Id { get; set; }

        [Required]
        public string CustomerName { get; set; } // Müşteri Adı Soyadı

        public DateTime RentDate { get; set; } // Alış Tarihi
        public DateTime ReturnDate { get; set; } // İade Tarihi

        public decimal TotalPrice { get; set; } // Toplam Ödenen Tutar

        // Hangi Araba Kiralandı? (İlişki kuruyoruz)
        public int CarId { get; set; }
        public virtual Car Car { get; set; }

        
    }
}