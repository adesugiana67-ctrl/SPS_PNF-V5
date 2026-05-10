# 📝 Prompt: Penyimpanan localStorage saat Input Data

Dokumen prompt siap-pakai untuk meminta AI (Claude / ChatGPT / Gemini / dll.) men-generate fitur penyimpanan data berbasis **localStorage** di aplikasi web statis seperti yang di-host di GitHub Pages.

---

## 🎯 Prompt Utama (Copy–Paste ke AI)

> **Implementasikan penyimpanan data di localStorage browser untuk aplikasi web statis (HTML + JS murni, tanpa backend) dengan ketentuan berikut:**
>
> ### 1. Skema Storage
> - Gunakan **3 storage key** terpisah dengan namespace + versi:
>   - `sumedang.ak.v1` → Data Akreditasi
>   - `sumedang.pd.v1` → Data Peserta Didik SPMB ATS/APS
>   - `sumedang.er.v1` → Data E-Rapor 8 SNP
> - Setiap key menyimpan **array JSON** berisi objek baris dengan `id` numerik unik.
>
> ### 2. Fungsi DB Helper
> Buat objek `DB` dengan API berikut:
> ```js
> DB.ak.all()   // baca semua baris akreditasi
> DB.ak.set(v)  // tulis ulang seluruh array
> DB.pd.all() / DB.pd.set(v)
> DB.er.all() / DB.er.set(v)
> DB.reset()    // hapus semua key
> DB.export()   // unduh seluruh data sebagai 1 file JSON backup
> DB.import(file) // restore dari file JSON backup
> ```
>
> ### 3. Seeding Awal
> Jika storage **kosong saat pertama kali load**, isi otomatis dengan **data contoh (seed)** dari konstanta `SEED` agar grafik & tabel langsung tampak terisi.
>
> ```js
> function load(key, seed) {
>   try {
>     const raw = localStorage.getItem(key);
>     if (raw) return JSON.parse(raw);
>   } catch (e) {}
>   localStorage.setItem(key, JSON.stringify(seed));
>   return seed;
> }
> ```
>
> ### 4. Operasi CRUD
> - **CREATE**: `id` di-generate otomatis = `max(existingIds) + 1`. Append ke array, lalu `set()`.
> - **READ**: Selalu panggil `all()` saat re-render tabel (single source of truth).
> - **UPDATE**: Map array, ganti baris dengan id yang sama menggunakan spread `{ ...old, ...newRow }`.
> - **DELETE**: Filter array buang baris dengan id terkait, baru `set()`.
>
> ### 5. Sinkronisasi UI
> - Setelah setiap CREATE/UPDATE/DELETE → tutup modal → re-render tabel + KPI + grafik → tampilkan **toast notifikasi** (auto-dismiss 2 detik) dengan pesan: "Data berhasil disimpan", "Diperbarui", atau "Dihapus".
> - Update juga indikator jumlah data ("Menampilkan X dari Y lembaga").
>
> ### 6. Validasi & Keamanan
> - Validasi field wajib di sisi client sebelum `set()`.
> - Bersihkan input string dengan trim, dan parse number dengan `Number(x) || 0`.
> - Untuk persentase E-Rapor, clamp 0–100: `Math.max(0, Math.min(100, Math.round(Number(x))))`.
> - Escape HTML saat render dengan helper `esc()` untuk mencegah XSS.
>
> ### 7. Backup / Restore
> - Tombol **"Unduh Backup"** di halaman Keterangan → unduh file `backup-sumedang-YYYY-MM-DD.json` berisi `{ ak, pd, er, exportedAt, version }`.
> - Tombol **"Restore dari Backup"** → buka file picker, parse JSON, validasi struktur, simpan ke localStorage, reload halaman.
>
> ### 8. Penanganan Error & Fallback
> - Try/catch saat `JSON.parse` jika data corrupt → fallback ke seed.
> - Try/catch saat `localStorage.setItem` (kuota penuh / mode private) → tampilkan toast error merah.
> - Tampilkan badge **"Mode Lokal"** di footer agar user paham datanya tersimpan di browser, bukan server.
>
> ### 9. Reset Data
> Tombol **"Reset Semua Data"** dengan konfirmasi `confirm()`, panggil `DB.reset()`, lalu `location.reload()`.
>
> ### 10. Ringkasan Komponen yang Harus Ada
> - Konstanta `STORAGE` & `SEED`
> - Fungsi `load()`, `save()`, `nextId()`
> - Objek `DB` dengan namespaced API
> - Helper `toast(msg, type)` untuk notifikasi
> - Helper `esc()` untuk escape HTML
> - Tidak perlu library eksternal selain Tailwind CSS, jsPDF, dan jspdf-autotable yang sudah dipakai.

---

## 📋 Contoh Implementasi Lengkap

### A. Skema & Seed
```js
const STORAGE = {
  ak: 'sumedang.ak.v1',
  pd: 'sumedang.pd.v1',
  er: 'sumedang.er.v1',
};

const SEED = {
  ak: [
    { id: 1, npsn: 'P2963449', namaSekolah: 'PKBM MEKAR BUANA', /* ... */ },
  ],
  pd: [/* ... */],
  er: [/* ... */],
};
```

### B. Helper Load/Save dengan Try-Catch
```js
function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Gagal parse ${key}, fallback ke seed`, e);
  }
  try {
    localStorage.setItem(key, JSON.stringify(seed));
  } catch (e) {
    toast('localStorage tidak tersedia (mode private?)', 'error');
  }
  return seed;
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    toast('Gagal menyimpan: ' + e.message, 'error');
    return false;
  }
}
```

### C. Generator ID Unik
```js
function nextId(arr) {
  return arr.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0) + 1;
}
```

### D. Objek DB Lengkap
```js
const DB = {
  ak: {
    all: () => load(STORAGE.ak, SEED.ak),
    set: v => save(STORAGE.ak, v),
    add: row => {
      const all = DB.ak.all();
      const newRow = { ...row, id: nextId(all) };
      if (save(STORAGE.ak, [...all, newRow])) {
        toast('Data Akreditasi berhasil disimpan', 'success');
      }
      return newRow;
    },
    update: (id, row) => {
      const all = DB.ak.all();
      if (save(STORAGE.ak, all.map(r => r.id === id ? { ...r, ...row, id } : r))) {
        toast('Data Akreditasi diperbarui', 'success');
      }
    },
    remove: id => {
      const all = DB.ak.all();
      if (save(STORAGE.ak, all.filter(r => r.id !== id))) {
        toast('Data dihapus', 'info');
      }
    },
  },
  // pd & er identik strukturnya
  reset: () => {
    Object.values(STORAGE).forEach(k => localStorage.removeItem(k));
    toast('Semua data direset ke contoh awal', 'info');
  },
  export: () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      ak: DB.ak.all(),
      pd: DB.pd.all(),
      er: DB.er.all(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-sumedang-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Backup berhasil diunduh', 'success');
  },
  import: async file => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.ak || !data.pd || !data.er) throw new Error('Format backup tidak valid');
      save(STORAGE.ak, data.ak);
      save(STORAGE.pd, data.pd);
      save(STORAGE.er, data.er);
      toast('Restore berhasil. Memuat ulang...', 'success');
      setTimeout(() => location.reload(), 1000);
    } catch (e) {
      toast('Gagal restore: ' + e.message, 'error');
    }
  },
};
```

### E. Toast Notifikasi
```js
function toast(message, type = 'info') {
  const colors = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    info: 'bg-slate-700',
    warning: 'bg-amber-500',
  };
  const div = document.createElement('div');
  div.className = `fixed bottom-6 right-6 z-[60] ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-slide-in no-print`;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => {
    div.style.opacity = '0';
    div.style.transition = 'opacity 0.3s';
    setTimeout(() => div.remove(), 300);
  }, 2000);
}
```

### F. Form Submit Handler (CREATE / UPDATE)
```js
form.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const row = {
    npsn: String(fd.get('npsn') || '').trim(),
    namaSekolah: String(fd.get('namaSekolah') || '').trim(),
    // ...field lain
  };
  // Validasi
  if (!row.npsn || !row.namaSekolah) {
    toast('NPSN & Nama Sekolah wajib diisi', 'warning');
    return;
  }
  if (editingId) DB.ak.update(editingId, row);
  else DB.ak.add(row);
  closeModal();
  renderTable();
});
```

---

## 🎁 Bonus: Pola Lanjutan

### Auto-save Draft Form
Simpan draft form ke `sessionStorage` agar tidak hilang saat refresh:
```js
form.addEventListener('input', () => {
  const draft = Object.fromEntries(new FormData(form));
  sessionStorage.setItem('ak.draft', JSON.stringify(draft));
});
```

### Sync Antar-Tab
Dengar perubahan dari tab lain dengan event `storage`:
```js
window.addEventListener('storage', e => {
  if (Object.values(STORAGE).includes(e.key)) {
    renderCurrentPage();
    toast('Data diperbarui dari tab lain', 'info');
  }
});
```

### Cek Kuota
```js
function checkQuota() {
  if (!navigator.storage?.estimate) return;
  navigator.storage.estimate().then(({ usage, quota }) => {
    const pct = Math.round((usage / quota) * 100);
    if (pct > 80) toast(`Storage hampir penuh (${pct}%)`, 'warning');
  });
}
```

---

## 🚦 Checklist Implementasi

- [x] Storage key dengan namespace + versi
- [x] Seed data otomatis saat kosong
- [x] CRUD lengkap (Create, Read, Update, Delete)
- [x] ID generator unik
- [x] Try/catch untuk parse + setItem
- [x] Toast notifikasi (success / error / info / warning)
- [x] Validasi field di sisi client
- [x] Escape HTML untuk anti-XSS
- [x] Backup ke file JSON
- [x] Restore dari file JSON
- [x] Reset semua data
- [x] Indikator "Mode Lokal" di footer
- [x] Sync antar-tab (opsional)
- [x] Auto-save draft (opsional)

---

## 🧠 Prompt Singkat (Versi Padat)

Jika kamu butuh prompt pendek:

> Buatkan modul JavaScript murni (tanpa library) untuk penyimpanan data di localStorage dengan API CRUD seperti `DB.ak.add(row)`, `DB.ak.update(id, row)`, `DB.ak.remove(id)`, `DB.ak.all()`. Gunakan storage key `sumedang.ak.v1`, `sumedang.pd.v1`, `sumedang.er.v1`. Sertakan auto-seed saat kosong, ID auto-increment, try-catch JSON parse, toast notifikasi, helper export/import backup JSON, dan tombol reset. Tambahkan validasi input wajib + escape HTML untuk keamanan.

---

© 2026 Dinas Pendidikan Kabupaten Sumedang
