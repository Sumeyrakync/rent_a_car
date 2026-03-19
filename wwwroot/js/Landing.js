document.addEventListener("DOMContentLoaded", function () {
    // 1. TEMA AYARINI YÜKLE
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // 2. DİL AYARINI YÜKLE
    const savedLang = localStorage.getItem('lang') || 'tr';
    changeLanguage(savedLang); // Sayfa açılır açılmaz dili uygula

    try { initFlatpickr(savedLang); } catch (e) { console.log("Flatpickr not needed here"); }

    // Hata almamak için fonksiyon kontrolleri
    if (typeof generateTimes === "function") generateTimes();
    if (typeof validateDates === "function") validateDates();
    if (typeof applyFilters === "function") applyFilters();

    // Chat Dışına Tıklama
    document.addEventListener('click', function (event) {
        const cw = document.getElementById('chatWindow');
        const tr = document.getElementById('chatTrigger');
        if (cw && tr && !cw.classList.contains('d-none') && !cw.contains(event.target) && !tr.contains(event.target)) {
            cw.classList.add('d-none');
        }
    });
});

/* --- REHBER & SSS GENİŞLETME --- */
window.toggleGuide = function () {
    const txt = document.getElementById('guideText');
    const btn = document.getElementById('btnExpandGuide');
    const lang = document.getElementById('currentLangSpan') ? document.getElementById('currentLangSpan').innerText.toLowerCase() : 'tr';

    if (txt.style.maxHeight === '150px' || txt.style.maxHeight === '') {
        txt.style.maxHeight = txt.scrollHeight + "px";
        btn.innerHTML = langData[lang].btn_show_less + ' <i class="fas fa-chevron-up ms-1"></i>';
    } else {
        txt.style.maxHeight = '150px';
        btn.innerHTML = langData[lang].btn_read_more + ' <i class="fas fa-chevron-down ms-1"></i>';
    }
}

window.toggleFaq = function () {
    const more = document.getElementById('moreFaq');
    const btn = document.getElementById('btnShowAllFaq');
    const lang = document.getElementById('currentLangSpan') ? document.getElementById('currentLangSpan').innerText.toLowerCase() : 'tr';

    if (more.classList.contains('d-none')) {
        more.classList.remove('d-none');
        more.classList.add('animate__animated', 'animate__fadeIn');
        btn.innerHTML = langData[lang].btn_show_less + ' <i class="fas fa-chevron-up"></i>';
    } else {
        more.classList.add('d-none');
        btn.innerHTML = langData[lang].btn_see_all + ' <i class="fas fa-chevron-down"></i>';
    }
}

/* --- ARAÇ VERİSİ --- */
const DB = {
    vehicles: [
        { brand: "Renault", model: "Clio", type: "Hatchback", fuel: "gasoline", gear: "manual", year: 2023, color: "white", price: 900, image: "https://cdn.motor1.com/images/mgl/mMPW3/s1/renault-megane-e-tech-electric.jpg" },
        { brand: "Fiat", model: "Egea", type: "Sedan", fuel: "diesel", gear: "manual", year: 2022, color: "white", price: 1100, image: "https://im.haberturk.com/2021/01/22/ver1611311059/2947087_810x458.jpg" },
        { brand: "Peugeot", model: "3008", type: "SUV", fuel: "diesel", gear: "auto", year: 2024, color: "gray", price: 2500, image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80" },
        { brand: "Toyota", model: "Corolla", type: "Sedan", fuel: "hybrid", gear: "auto", year: 2023, color: "blue", price: 1800, image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80" },
        { brand: "BMW", model: "520i", type: "Sedan", fuel: "gasoline", gear: "auto", year: 2024, color: "black", price: 4200, image: "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&w=600&q=80" }
    ]
};

/* --- ÇEVİRİ YARDIMCISI --- */
function getTrans(key, lang) {
    const dict = { gasoline: { tr: "Benzin", en: "Gasoline" }, diesel: { tr: "Dizel", en: "Diesel" }, hybrid: { tr: "Hibrit", en: "Hybrid" }, manual: { tr: "Manuel", en: "Manual" }, auto: { tr: "Otomatik", en: "Automatic" }, white: { tr: "Beyaz", en: "White" }, black: { tr: "Siyah", en: "Black" }, gray: { tr: "Gri", en: "Gray" }, blue: { tr: "Mavi", en: "Blue" } };
    return dict[key] ? dict[key][lang] : key;
}

window.applyFilters = function () {
    const langSpan = document.getElementById('currentLangSpan');
    if (!langSpan) return; // Eğer giriş sayfasındaysak bu fonksiyon çalışmasın

    const lang = langSpan.innerText.toLowerCase();
    const grid = document.getElementById('vehicleGrid');
    const fuel = document.getElementById('filterFuel').value;
    const gear = document.querySelector('input[name="gear"]:checked').value;
    const maxPrice = parseInt(document.getElementById('filterPrice').value);
    const brand = document.getElementById('filterBrand').value;
    const color = document.getElementById('filterColor').value;
    const minYear = parseInt(document.getElementById('filterYear').value);

    const filtered = DB.vehicles.filter(v => (fuel === 'all' || v.fuel === fuel) && (gear === 'all' || v.gear === gear) && (brand === 'all' || v.brand === brand) && (color === 'all' || v.color === color) && v.year >= minYear && v.price <= maxPrice);

    if (filtered.length === 0) { grid.innerHTML = ""; document.getElementById('noResultMsg').classList.remove('d-none'); document.querySelector('#noResultMsg h5').innerText = langData[lang].no_result; }
    else {
        document.getElementById('noResultMsg').classList.add('d-none');
        let html = "";
        filtered.forEach(v => {
            html += `<div class="col-md-6 col-lg-4 animate__animated animate__fadeIn"><div class="vehicle-card h-100"><div class="vehicle-img-wrapper"><img src="${v.image}" alt="${v.brand}"></div><div class="card-body p-3"><div class="d-flex justify-content-between mb-2"><span class="badge bg-light text-dark border">${v.year}</span><span class="badge bg-light text-dark border">${getTrans(v.gear, lang)}</span></div><h5 class="fw-bold mb-1" style="color:var(--text-main)">${v.brand} ${v.model}</h5><p class="card-text small mb-3">${getTrans(v.fuel, lang)} | ${getTrans(v.color, lang)}</p><div class="d-flex justify-content-between align-items-center mt-3"><div><h4 class="text-primary fw-bold mb-0">${v.price} ₺</h4><small class="card-text">/${lang === 'tr' ? 'gün' : 'day'}</small></div><button class="btn btn-primary btn-sm px-3" onclick="alert('${lang === 'tr' ? 'Seçildi' : 'Selected'}: ${v.model}')">${lang === 'tr' ? 'Kirala' : 'Rent'}</button></div></div></div></div>`;
        });
        grid.innerHTML = html;
    }
}
window.resetFilters = function () { document.getElementById('filterFuel').value = "all"; document.getElementById('gearAll').checked = true; document.getElementById('filterPrice').value = 5000; document.getElementById('priceVal').innerText = "5000 ₺"; applyFilters(); }

/* --- DALLANAN AKILLI CHATBOT --- */
const chatScenarios = {
    tr: {
        root: { text: "Merhaba! Nasıl yardımcı olabilirim?", options: [{ l: "Fiyatlar", n: "prices" }, { l: "Kiralama Şartları", n: "terms" }, { l: "Canlı Destek", n: "live" }] },
        prices: { text: "Günlük fiyatlarımız 900 TL'den başlamaktadır. Ayrıca aylık kiralamalarda özel indirimlerimiz mevcuttur.", options: [{ l: "Aylık İndirim?", n: "monthly_disc" }, { l: "Araçları Göster", a: "scroll_fleet" }, { l: "Canlı Destek", n: "live" }] },
        monthly_disc: { text: "30 gün ve üzeri kiralamalarda %20 indirim uyguluyoruz. Kurumsal kiralama için teklif alabilirsiniz.", options: [{ l: "Filoyu İncele", a: "scroll_fleet" }, { l: "Canlı Destek", n: "live" }, { l: "Başa Dön", n: "root" }] },
        terms: { text: "Araç kiralamak için en az 21 yaşında olmanız ve 1 yıllık ehliyet sahibi olmanız gerekmektedir.", options: [{ l: "Depozito?", n: "deposit" }, { l: "KM Sınırı?", n: "km" }, { l: "Başa Dön", n: "root" }] },
        deposit: { text: "Araç grubuna göre 2000 TL ile 5000 TL arası provizyon alınır. Araç iadesinden sonra blokaj kaldırılır.", options: [{ l: "KM Sınırı?", n: "km" }, { l: "Canlı Destek", n: "live" }, { l: "Başa Dön", n: "root" }] },
        km: { text: "Günlük kiralamalarda 400km sınır vardır. Aylık kiralamalarda 3000km sınır uygulanır. Aşım ücreti araç başına değişir.", options: [{ l: "Diğer Sorular", n: "terms" }, { l: "Canlı Destek", n: "live" }] },
        live: { text: "Müşteri temsilcimize hemen bağlanabilirsiniz. Hangi yöntemi tercih edersiniz?", options: [{ l: "WhatsApp Mesaj", a: "wa", c: "chat-btn-wa" }, { l: "Telefonla Ara", a: "call", c: "chat-btn-call" }, { l: "Vazgeç", n: "root" }] }
    },
    en: {
        root: { text: "Hello! How can I help you?", options: [{ l: "Prices", n: "prices" }, { l: "Rental Terms", n: "terms" }, { l: "Live Support", n: "live" }] },
        prices: { text: "Daily rates start from 900 TL. We also offer special discounts for monthly rentals.", options: [{ l: "Monthly Discount?", n: "monthly_disc" }, { l: "Show Fleet", a: "scroll_fleet" }, { l: "Live Support", n: "live" }] },
        monthly_disc: { text: "We offer a 20% discount for rentals of 30 days or more. Get a quote for corporate rentals.", options: [{ l: "View Fleet", a: "scroll_fleet" }, { l: "Live Support", n: "live" }, { l: "Main Menu", n: "root" }] },
        terms: { text: "You must be at least 21 years old and have a 1-year driver's license. Credit card is mandatory.", options: [{ l: "Deposit?", n: "deposit" }, { l: "Mileage Limit?", n: "km" }, { l: "Main Menu", n: "root" }] },
        deposit: { text: "A provision between 2000 TL and 5000 TL is blocked on your credit card depending on the car group.", options: [{ l: "Mileage Limit?", n: "km" }, { l: "Live Support", n: "live" }, { l: "Main Menu", n: "root" }] },
        km: { text: "Daily limit is 400km, monthly limit is 3000km. Excess fees vary by vehicle.", options: [{ l: "Other Questions", n: "terms" }, { l: "Live Support", n: "live" }] },
        live: { text: "You can contact our representative immediately. Which method do you prefer?", options: [{ l: "WhatsApp", a: "wa", c: "chat-btn-wa" }, { l: "Call Now", a: "call", c: "chat-btn-call" }, { l: "Cancel", n: "root" }] }
    }
};

window.toggleChat = function () {
    const w = document.getElementById('chatWindow');
    w.classList.toggle('d-none');
    if (!w.classList.contains('d-none')) {
        const lang = document.getElementById('currentLangSpan') ? document.getElementById('currentLangSpan').innerText.toLowerCase() : 'tr';
        renderChat(lang, 'root');
    }
}

function renderChat(lang, nodeId) {
    const data = chatScenarios[lang][nodeId];
    const b = document.getElementById('chatMessages');
    const f = document.getElementById('chatInputArea');
    if (nodeId === 'root') b.innerHTML = '';

    b.innerHTML += `<div class="message bot animate__animated animate__fadeInLeft">${data.text}</div>`;
    f.innerHTML = "";

    data.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = `chat-option-btn ${opt.c || ''}`;
        btn.innerText = opt.l;
        btn.onclick = () => {
            b.innerHTML += `<div class="message user animate__animated animate__fadeInRight">${opt.l}</div>`;
            if (opt.n) setTimeout(() => renderChat(lang, opt.n), 500);
            if (opt.a === 'scroll_fleet') { document.getElementById('filo').scrollIntoView({ behavior: 'smooth' }); document.getElementById('chatWindow').classList.add('d-none'); }
            if (opt.a === 'wa') window.open('https://wa.me/905000000000', '_blank');
            if (opt.a === 'call') window.location.href = 'tel:08501234567';
        };
        f.appendChild(btn);
    });
    b.scrollTop = b.scrollHeight;
}

const langData = {
    tr: {
        btn_login_main: "Giriş Yap",
        cust_login_title: "Müşteri Girişi",
        lbl_email: "E-Posta Adresi",
        lbl_pass: "Şifre",
        btn_login_submit: "Giriş Yap",
        link_forgot: "Şifremi Unuttum",
        link_register: "Hesap Oluştur",
        login_desc: "Kiralama işlemlerine devam etmek için giriş yapın.",
        nav_home: "Ana Sayfa", nav_features: "Ayrıcalıklar", nav_about: "Kurumsal", nav_fleet: "Filo", nav_faq: "SSS", nav_contact: "İletişim", nav_guide: "Rehber", nav_reviews: "Yorumlar",
        hero_title: "Güvenli ve Konforlu Yolculuk", hero_desc: "Adana'nın en geniş araç filosu ve 7/24 hizmet garantisi.",
        tab_daily: "Günlük", tab_monthly: "Aylık", tab_res: "Rezervasyon",
        lbl_pickup: "ALIŞ YERİ", lbl_dropoff: "İADE YERİ", lbl_pdate: "ALIŞ TARİHİ", lbl_ddate: "DÖNÜŞ TARİHİ", lbl_time: "SAAT", lbl_duration: "SÜRE",
        btn_find: "ARAÇ BUL", btn_query: "SORGULA", btn_cancel: "İPTAL", btn_login: "Giriş Yap", live_support: "Canlı Destek", btn_read_more: "Devamını Oku", btn_show_less: "Daha Az", btn_see_all: "Tüm Soruları Gör",
        feat_title: "Neden Biz?", feat_desc: "Size sunduğumuz ayrıcalıklar.", feat_1_t: "Ekonomik Fiyat", feat_1_d: "Gizli ücret yok.", feat_2_t: "Geniş Filo", feat_2_d: "Her ihtiyaca uygun.", feat_3_t: "7/24 Destek", feat_3_d: "Her an yanınızda.",
        about_sub: "Kurumsal", about_title: "Güvenin Adresi", about_desc1: "2010'dan beri hizmetinizdeyiz.", about_desc2: "Müşteri memnuniyeti odaklıyız.", about_stat1: "Kuruluş", about_stat2: "Müşteri",
        fleet_title: "Araç Filomuz", fleet_desc: "İhtiyacınıza uygun aracı seçin.", filter_title: "Filtrele", filter_clear: "Temizle", filter_brand: "MARKA", filter_gear: "VİTES", filter_fuel: "YAKIT", filter_price: "MAX FİYAT", filter_year: "MODEL YILI", filter_color: "RENK", no_result: "Araç bulunamadı.",
        opt_all: "Tümü", opt_select: "Seçiniz", gear_auto: "Oto", gear_manual: "Man", fuel_gas: "Benzin", fuel_dsl: "Dizel", fuel_hyb: "Hibrit", clr_white: "Beyaz", clr_black: "Siyah", loc_ada: "Havalimanı", loc_seyhan: "Seyhan Ofis",
        dur_1: "1 Ay", dur_3: "3 Ay", dur_6: "6 Ay",
        faq_title: "Sıkça Sorulan Sorular", faq_q1: "Yaş sınırı nedir?", faq_a1: "En az 21 yaş ve 1 yıllık ehliyet.", faq_q2: "Depozito var mı?", faq_a2: "Evet, provizyon alınır.", faq_q3: "KM sınırı?", faq_a3: "Günlük 400km.", faq_q4: "Ek sürücü?", faq_a4: "Evet, sözleşmeye eklenebilir.", faq_q5: "İptal?", faq_a5: "24 saat öncesine kadar.",
        guide_title: "Kiralama Rehberi", guide_p1: "Doğru araç seçimi önemlidir.", guide_h1: "1. Araç Seçimi", guide_p2: "Yolcu sayısı ve bagaj hacmine göre seçin.", guide_h2: "2. Sigorta", guide_p3: "Tam kasko güvence sağlar.", guide_h3: "3. Teslim Alma", guide_p4: "Aracı kontrol ederek teslim alın.", guide_h4: "4. İade Süreci", guide_p5: "Zamanında teslim önemli.",
        review_title: "Müşteri Deneyimleri", rev_1_text: "Havalimanı teslimat süreci çok hızlıydı.", rev_2_text: "Fiyatlar çok uygun.", footer_desc: "Adana'nın en güvenilir araç kiralama firması.", footer_contact: "İletişim", footer_corp: "Kurumsal", footer_priv: "Gizlilik Politikası", footer_terms: "Kiralama Koşulları",
        ph_date: "Tarih Seç...", ph_pnr: "Örn: 123456", ph_surname: "SOYİSİM", err_pnr: "Kod giriniz", err_surname: "Soyisim gerekli", login_placeholder: "Giriş Formu",
        modal_priv_title: "Gizlilik Politikası", modal_priv_body: "<p>Kişisel verileriniz KVKK kapsamında korunmaktadır. Asla 3. şahıslarla paylaşılmaz.</p>",
        modal_term_title: "Kiralama Koşulları", modal_term_body: "<ul><li>Min 21 yaş.</li><li>1 yıllık ehliyet.</li><li>Kredi kartı zorunlu.</li></ul>",
        chat_title: "EasyAsistan", 
        lbl_remember: "Beni Hatırla",
        nav_cust_login: "Müşteri Girişi",
        nav_admin_login: "Yönetici Girişi",
        admin_login_title: "Yönetici Girişi",
        admin_desc: "Yönetim paneline erişmek için giriş yapın.",
        reg_desc: "Hızlıca kayıt olun ve araç kiralamaya başlayın.",
        lbl_name: "Adınız",
        reg_already: "Zaten hesabınız var mı?",
        reg_prompt: "Henüz hesabınız yok mu?",
        link_register: "Hesap Oluştur",
    },
    en: {
        btn_login_main: "Login",
        cust_login_title: "Customer Login",
        lbl_email: "Email Address",
        lbl_pass: "Password",
        btn_login_submit: "Sign In",
        link_forgot: "Forgot Password?",
        link_register: "Create Account",
        login_desc: "Log in to continue your rental process.", 
        nav_home: "Home", nav_features: "Features", nav_about: "About", nav_fleet: "Fleet", nav_faq: "FAQ", nav_contact: "Contact", nav_guide: "Guide", nav_reviews: "Reviews",
        hero_title: "Safe and Comfortable Journey", hero_desc: "Widest fleet in Adana with 24/7 service.",
        tab_daily: "Daily", tab_monthly: "Monthly", tab_res: "Reservation",
        lbl_pickup: "PICK-UP", lbl_dropoff: "DROP-OFF", lbl_pdate: "PICK-UP DATE", lbl_ddate: "DROP-OFF DATE", lbl_time: "TIME", lbl_duration: "DURATION",
        btn_find: "FIND CAR", btn_query: "CHECK", btn_cancel: "CANCEL", btn_login: "Login", live_support: "Live Support", btn_read_more: "Read More", btn_show_less: "Show Less", btn_see_all: "See All FAQ",
        feat_title: "Why Us?", feat_desc: "Our privileges for you.", feat_1_t: "Best Price", feat_1_d: "No hidden fees.", feat_2_t: "Wide Fleet", feat_2_d: "For every need.", feat_3_t: "24/7 Support", feat_3_d: "Always with you.",
        about_sub: "Corporate", about_title: "Address of Trust", about_desc1: "Serving since 2010.", about_desc2: "Customer satisfaction focused.", about_stat1: "Founded", about_stat2: "Clients",
        fleet_title: "Our Fleet", fleet_desc: "Choose the best car.", filter_title: "Filter", filter_clear: "Clear", filter_brand: "BRAND", filter_gear: "GEAR", filter_fuel: "FUEL", filter_price: "MAX PRICE", filter_year: "YEAR", filter_color: "COLOR", no_result: "No vehicle found.",
        opt_all: "All", opt_select: "Select", gear_auto: "Auto", gear_manual: "Man", fuel_gas: "Gasoline", fuel_dsl: "Diesel", fuel_hyb: "Hybrid", clr_white: "White", clr_black: "Black", loc_ada: "Airport", loc_seyhan: "Seyhan Office",
        dur_1: "1 Month", dur_3: "3 Months", dur_6: "6 Months",
        faq_title: "Freq. Asked Questions", faq_q1: "Age limit?", faq_a1: "Min 21 years old & 1 year license.", faq_q2: "Deposit?", faq_a2: "Yes, provision required.", faq_q3: "Mileage limit?", faq_a3: "Daily 400km limit.", faq_q4: "Extra driver?", faq_a4: "Yes, can be added.", faq_q5: "Cancellation?", faq_a5: "Free up to 24h.",
        guide_title: "Rental Guide", guide_p1: "Choosing the right car is important.", guide_h1: "1. Selection", guide_p2: "Consider passengers and luggage.", guide_h2: "2. Insurance", guide_p3: "Full insurance provides safety.", guide_h3: "3. Pick-up", guide_p4: "Check for scratches.", guide_h4: "4. Return", guide_p5: "Timely return is important.",
        review_title: "Customer Reviews", rev_1_text: "Airport delivery was very fast.", rev_2_text: "Prices are very reasonable.", footer_desc: "Most reliable car rental in Adana.", footer_contact: "Contact", footer_corp: "Corporate", footer_priv: "Privacy Policy", footer_terms: "Rental Terms",
        ph_date: "Select Date...", ph_pnr: "Ex: 123456", ph_surname: "SURNAME", err_pnr: "Enter code", err_surname: "Surname required", login_placeholder: "Login Form",
        modal_priv_title: "Privacy Policy", modal_priv_body: "<p>Your data is protected under GDPR. We never share it with 3rd parties.</p>",
        modal_term_title: "Rental Terms", modal_term_body: "<ul><li>Min 21 years old.</li><li>1 year license.</li><li>Credit card required.</li></ul>",
        chat_title: "EasyAssistant", 
        lbl_remember: "Remember Me",
        nav_cust_login: "Customer Login",
        nav_admin_login: "Admin Login",
        admin_login_title: "Admin Login",
        admin_desc: "Log in to access the administration panel.",
        reg_desc: "Sign up quickly and start renting cars.",
        lbl_name: "First Name",
        reg_already: "Already have an account?",
        reg_prompt: "Don't have an account yet?",
        link_register: "Create Account",
    }
};

window.changeLanguage = function (l) {
    // Seçimi kaydet
    localStorage.setItem('lang', l);

    const d = langData[l];
    const langSpan = document.getElementById('currentLangSpan');
    if (langSpan) langSpan.innerText = l.toUpperCase();

    document.querySelectorAll('[data-lang]').forEach(e => { const k = e.getAttribute('data-lang'); if (d[k]) e.innerText = d[k] });
    document.querySelectorAll('[data-lang-placeholder]').forEach(e => { const k = e.getAttribute('data-lang-placeholder'); if (d[k]) e.placeholder = d[k] });
    document.querySelectorAll('option[data-lang]').forEach(e => { const k = e.getAttribute('data-lang'); if (d[k]) e.innerText = d[k] });

    // Flatpickr varsa güncelle
    try { initFlatpickr(l); } catch (e) { }

    // Varsa araçları filtrele (Ana Sayfa İçin)
    if (typeof applyFilters === "function") applyFilters();

    // Chat açıksa resetle
    const cw = document.getElementById('chatWindow'); if (cw && !cw.classList.contains('d-none')) renderChat(l, 'root');
}

window.toggleGuide = function () { const t = document.getElementById('guideText'); const b = document.getElementById('btnExpandGuide'); const l = localStorage.getItem('lang') || 'tr'; if (t.style.maxHeight === 'none') { t.style.maxHeight = '150px'; b.innerHTML = langData[l].btn_read_more + ' <i class="fas fa-chevron-down"></i>' } else { t.style.maxHeight = 'none'; b.innerHTML = langData[l].btn_show_less + ' <i class="fas fa-chevron-up"></i>' } }
window.toggleFaq = function () { const m = document.getElementById('moreFaq'); const b = document.getElementById('btnShowAllFaq'); const l = localStorage.getItem('lang') || 'tr'; if (m.classList.contains('d-none')) { m.classList.remove('d-none'); m.classList.add('animate__animated', 'animate__fadeIn'); b.innerHTML = langData[l].btn_show_less + ' <i class="fas fa-chevron-up"></i>' } else { m.classList.add('d-none'); b.innerHTML = langData[l].btn_see_all + ' <i class="fas fa-chevron-down"></i>' } }
window.setModalContent = function (t) { const l = localStorage.getItem('lang') || 'tr'; const h = document.getElementById('infoModalLabel'); const b = document.getElementById('infoModalBody'); const lb = document.querySelector('#infoModal button.btn-success span'); if (t === 'Privacy') { h.innerText = langData[l].modal_priv_title; b.innerHTML = langData[l].modal_priv_body } else { h.innerText = langData[l].modal_term_title; b.innerHTML = langData[l].modal_term_body } if (lb) lb.innerText = langData[l].live_support }

/* --- STANDARD FUNCTIONS --- */
function initFlatpickr(l) { if (typeof flatpickr === 'undefined') return; const p = document.getElementById('pickupDate'); if (!p) return; const d = document.getElementById('dropoffDate'); flatpickr("#pickupDate", { locale: l, minDate: "today", defaultDate: p.value || "today", dateFormat: "Y-m-d", disableMobile: "true", onChange: function (s, dt) { const dr = document.getElementById("dropoffDate")._flatpickr; dr.set('minDate', dt); if (dt > dr.input.value) dr.setDate(dt); validateDates() } }); flatpickr("#dropoffDate", { locale: l, minDate: p.value || "today", defaultDate: d.value || new Date().fp_incr(1), dateFormat: "Y-m-d", disableMobile: "true", onChange: function () { validateDates() } }); }
window.toggleTheme = function () { const c = document.body.getAttribute('data-theme'); const n = c === 'light' ? 'dark' : 'light'; setTheme(n); }
function setTheme(t) { document.body.setAttribute('data-theme', t); localStorage.setItem('theme', t); const i = document.getElementById('themeIcon'); if (i) { if (t === 'dark') i.className = 'fas fa-sun text-warning'; else i.className = 'fas fa-moon text-dark'; } }
window.switchTab = function (t) { document.querySelectorAll('.widget-tab').forEach(b => b.classList.remove('active')); document.getElementById('tab-' + t).classList.add('active'); const rf = document.getElementById('rentalForm'); const res = document.getElementById('resForm'); if (t === 'reservation') { rf.classList.add('d-none'); res.classList.remove('d-none') } else { res.classList.add('d-none'); rf.classList.remove('d-none'); const d = document.querySelectorAll('.daily-only'); const m = document.querySelectorAll('.monthly-only'); if (t === 'daily') { d.forEach(e => e.classList.remove('d-none')); m.forEach(e => e.classList.add('d-none')) } else { d.forEach(e => e.classList.add('d-none')); m.forEach(e => e.classList.remove('d-none')) } } }
window.toggleDropoff = function () { const c = document.getElementById('diffLocCheck').checked; const p = document.getElementById('col-pickup'); const d = document.getElementById('col-dropoff'); const b = document.getElementById('col-btn'); if (c) { p.classList.remove('col-lg-3'); p.classList.add('col-lg-2'); d.classList.remove('d-none', 'col-lg-0'); d.classList.add('col-lg-2'); b.classList.remove('col-lg-3'); b.classList.add('col-lg-2') } else { d.classList.remove('col-lg-2'); d.classList.add('d-none', 'col-lg-0'); p.classList.remove('col-lg-2'); p.classList.add('col-lg-3'); b.classList.remove('col-lg-2'); b.classList.add('col-lg-3') } }
function generateTimes() { const t = []; for (let i = 0; i < 24; i++) { t.push((i < 10 ? '0' : '') + i + ":00"); t.push((i < 10 ? '0' : '') + i + ":30") } const h = t.map(v => `<option value="${v}">${v}</option>`).join(''); const pt = document.getElementById('pickupTime'); if (pt) { pt.innerHTML = h; document.getElementById('dropoffTime').innerHTML = h; document.getElementById('pickupTime').value = "10:00"; document.getElementById('dropoffTime').value = "10:00" } }
window.validateDates = function () { const pd = document.getElementById('pickupDate'); if (!pd) return; const dd = document.getElementById('dropoffDate'); const pt = document.getElementById('pickupTime'); const dt = document.getElementById('dropoffTime'); const today = new Date().toISOString().split('T')[0]; const curH = new Date().getHours(); Array.from(pt.options).forEach(o => { const h = parseInt(o.value.split(':')[0]); if (pd.value === today && h <= curH) { o.disabled = true; o.style.color = "#ccc" } else { o.disabled = false; o.style.color = "" } }); if (pt.options[pt.selectedIndex].disabled) { for (let o of pt.options) if (!o.disabled) { pt.value = o.value; break } } if (pd.value === dd.value) { const ph = parseInt(pt.value.split(':')[0]); Array.from(dt.options).forEach(o => { const h = parseInt(o.value.split(':')[0]); if (h <= ph) { o.disabled = true; o.style.color = "#ccc" } else { o.disabled = false; o.style.color = "" } }); if (dt.options[dt.selectedIndex].disabled) { for (let o of dt.options) if (!o.disabled) { dt.value = o.value; break } } } else { Array.from(dt.options).forEach(o => { o.disabled = false; o.style.color = "" }) } }
window.checkReservation = function (e) { e.preventDefault(); const c = document.getElementById('resCode'); const s = document.getElementById('resSurname'); const ec = c.nextElementSibling; const es = s.nextElementSibling; let v = true; if (c.value.length < 6) { c.classList.add('is-invalid'); ec.style.display = 'block'; v = false } else { c.classList.remove('is-invalid'); ec.style.display = 'none' } if (s.value.trim() === "") { s.classList.add('is-invalid'); es.style.display = 'block'; v = false } else { s.classList.remove('is-invalid'); es.style.display = 'none' } if (v) alert("Sorgulanıyor..."); }
window.searchCars = function (e) { e.preventDefault(); document.getElementById('filo').scrollIntoView({ behavior: 'smooth' }); }