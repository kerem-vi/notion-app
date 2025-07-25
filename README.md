# Notion Bilgi Merkezi

Modern ve kullanıcı dostu bir Notion entegrasyonu ile bilgi kartları görüntüleme uygulaması.

## 🚀 Özellikler

- **Güzel Hero Görsel**: Üst kısımda etkileyici bir hero bölümü
- **Arama Sistemi**: Notion verilerinizde hızlı arama yapabilme
- **Filtreleme**: Kategori bazında filtreleme (Tümü, Ürünler, Bilgiler)
- **Kart Tasarımı**: Modern, açılabilir ürün benzeri kartlar
- **Modal Detay Görünümü**: Kartlara tıklayarak detaylı bilgi görüntüleme
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Animasyonlar**: Smooth geçiş animasyonları

## 📋 Gereksinimler

- Notion API erişimi
- Notion Internal Integration Token
- Notion Database ID

## 🛠️ Kurulum

1. **Notion API Kurulumu:**
   - [Notion Developers](https://developers.notion.com/) sayfasına gidin
   - Yeni bir integration oluşturun
   - Integration token'ınızı alın

2. **Notion Database Hazırlama:**
   Notion'da aşağıdaki özelliklerle bir database oluşturun:
   - **Name** (Title): Kart başlığı
   - **Description** (Rich Text): Açıklama
   - **Category** (Select): Kategori (Ürün, Bilgi vb.)
   - **Price** (Number): Fiyat (opsiyonel)
   - **Image** (URL): Görsel URL'si (opsiyonel)

3. **Kod Güncelleme:**
   `main.js` dosyasında aşağıdaki değerleri güncelleyin:
   ```javascript
   const notionToken = "your_integration_token_here";
   const databaseId = "your_database_id_here";
   ```

4. **Demo Modundan Çıkış:**
   `main.js` dosyasında:
   ```javascript
   // Demo modunu kapatın
   // loadDemoData();
   
   // Notion API'yi aktifleştirin
   fetchNotionData();
   ```

## 🎨 Kullanım

### Demo Modu
Şu anda demo modunda çalışıyor. Gerçek Notion verilerinizi kullanmak için yukarıdaki kurulum adımlarını takip edin.

### Özellikler
- **Arama**: Üst kısımdaki arama kutusunu kullanarak verilerinizde arama yapın
- **Filtreleme**: "Tümü", "Ürünler", "Bilgiler" butonlarıyla kategorilere göre filtreleme
- **Detay Görünümü**: Kartlara tıklayarak detaylı bilgileri görüntüleyin
- **Responsive**: Mobil cihazlarda da mükemmel görünüm

## 📱 Responsive Tasarım

Uygulama tüm cihazlarda mükemmel çalışır:
- **Desktop**: 3 sütunlu grid layout
- **Tablet**: 2 sütunlu layout
- **Mobile**: Tek sütunlu layout

## 🎯 Notion Database Yapısı

Önerilen database yapısı:

| Özellik | Tip | Açıklama |
|---------|-----|----------|
| Name | Title | Kart başlığı (zorunlu) |
| Description | Rich Text | Detaylı açıklama |
| Category | Select | Kategori (Ürün, Bilgi, Proje vb.) |
| Price | Number | Fiyat bilgisi |
| Image | URL | Görsel URL'si |

## 🔧 Özelleştirme

### Renk Teması Değiştirme
`style.css` dosyasında gradient renklerini değiştirebilirsiniz:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Kart Animasyonları
Animasyon sürelerini `style.css` dosyasında ayarlayabilirsiniz:
```css
.card {
  animation: fadeInUp 0.6s ease forwards;
}
```

## 🚀 Canlı Demo

Sayfayı açmak için:
```bash
# Basit HTTP sunucusu başlatın
python -m http.server 8000
# veya
npx serve .
```

Tarayıcınızda `http://localhost:8000` adresine gidin.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun yaşarsanız issue açabilir veya iletişime geçebilirsiniz.