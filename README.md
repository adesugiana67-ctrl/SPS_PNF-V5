# SKB/PKBM Sumedang 2026 — Single-File Web App

Versi **single-file** (satu file `index.html` saja) dari aplikasi *Standar Pengelolaan Satuan Pendidikan Non Formal SKB/PKBM 2026* Dinas Pendidikan Kabupaten Sumedang.

Cukup satu file HTML saja — semua halaman, navbar, grafik, tabel, modal input, dan styling tergabung dalam satu file. Siap di-host di **GitHub Pages**.

---

## 📂 Struktur

```
docs/
├── index.html      # ⭐ SATU file berisi seluruh aplikasi
├── .nojekyll       # mencegah Jekyll memproses
└── README.md
```

---

## ✨ Fitur dalam 1 File

- 🎨 **Tampilan Depan dengan Logo** Dinas Sumedang (SVG inline)
- 🧭 **Navbar dropdown** Beranda / Informasi ▼ / Keterangan
- 📊 **Beranda dashboard**: hero card berlogo, 3 quick-link, 4 KPI, 3 grafik laporan, 2 daftar data terbaru
- 📋 **Tabel Akreditasi** — dengan badge berwarna sesuai status
- 👥 **Tabel Peserta Didik SPMB ATS/APS** — header bertingkat, gender + verval
- 📈 **Tabel E-Rapor 8 SNP** — kategori otomatis (Baik/Cukup/Sedang/Kurang)
- ➕ **Input Data** dengan form modal + dropdown opsi
- ✏️ **Edit** & 🗑️ **Hapus** per baris
- 🖨️ **Cetak** print-friendly
- 📄 **Unduh PDF** (jsPDF + autotable via CDN)
- 📑 **Export CSV** (Excel-friendly, BOM UTF-8)
- 🔍 **Search** per tabel
- 💾 **localStorage** sebagai database (data tersimpan di browser)
- 📱 **Mobile responsive** (Tailwind via CDN)
- 🔗 **Hash routing** (`#beranda`, `#akreditasi`, dst.) — tetap satu file

---

## 🚀 Cara Hosting di GitHub Pages

### Cara Tercepat (folder `/docs`)

1. Push project ke repository GitHub.
2. Buka **Settings → Pages**.
3. Pilih **Source: Deploy from a branch**.
4. Pilih branch `main`, folder **`/docs`**, klik **Save**.
5. Tunggu 1–2 menit, situs live di:
   `https://<username>.github.io/<nama-repo>/`

### Alternatif: Repo `<username>.github.io`

Salin `docs/index.html` ke root branch `main` dari repo bernama `<username>.github.io` → otomatis live di `https://<username>.github.io/`.

### Alternatif: Drop-in di hosting lain

Karena ini hanya satu file `index.html`, kamu juga bisa:
- Upload langsung ke Netlify drop / Vercel / cPanel / Nginx / Apache
- Buka offline: klik dua kali file `index.html` di file manager (semua fitur tetap jalan, kecuali butuh internet untuk Tailwind/jsPDF CDN)

---

## 🧪 Pengembangan Lokal

```bash
cd docs && python -m http.server 8080
# atau:  npx serve docs
```

Buka `http://localhost:8080`.

---

## 📜 Lisensi

Bebas digunakan untuk lingkungan Dinas Pendidikan Kabupaten Sumedang. © 2026.
