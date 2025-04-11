# Jawaban Pertanyaan Dasar - Developer Screening

## **Teknologi yang Digunakan**
- **Backend**: Golang (Go)
- **Frontend**: Vue.js
- **Database**: MySQL
- **Storage untuk gambar**: AWS S3

## **Rancangan Logika Proses**

### **1. Proses Upload oleh Pengguna**
- Pengguna mengunggah foto melalui form di frontend (Vue.js).
- Foto dikirim ke backend (API Golang).
- Backend akan meng-upload foto ke S3 dan mendapatkan URL dari S3.
- Metadata foto (URL S3, user ID, status review = "pending", timestamp) disimpan ke dalam database MySQL.

### **2. Proses Review oleh Moderator**
- Moderator login ke dashboard admin (Vue.js).
- Moderator melihat daftar foto dengan status "pending".
- Moderator dapat mengubah status foto menjadi "approved" atau "rejected" melalui dashboard.
- Frontend akan mengirimkan request ke backend API (Golang) untuk meng-update status foto di MySQL.

### **3. Proses Publikasi**
- Hanya foto dengan status "approved" yang akan ditampilkan ke publik.
- Frontend publik akan melakukan fetch ke backend API yang hanya mengembalikan data foto dengan status "approved".

---

## **Struktur Data - MySQL**

Tabel **photos**:

| Kolom        | Tipe Data                                 | Keterangan                                  |
|--------------|--------------------------------------------|---------------------------------------------|
| id           | INT (AUTO_INCREMENT) PRIMARY KEY          | Primary key                                 |
| user_id      | INT                                       | ID pengguna yang mengunggah                 |
| image_url    | VARCHAR(255)                              | URL gambar yang tersimpan di S3             |
| status       | ENUM('pending', 'approved', 'rejected')   | Status review foto                          |
| created_at   | TIMESTAMP                                 | Waktu foto diunggah                         |
| updated_at   | TIMESTAMP                                 | Waktu terakhir update oleh moderator        |

---

## **Alur Sistem**

**Frontend (Vue.js) → Backend API (Golang) → AWS S3 & MySQL → Frontend Admin (Vue.js) → Backend API → MySQL**

---


# Jawaban Database Questions

<pre>
SELECT 
    c.CustomerName,
    COUNT(o.OrderID) AS OrderCount,
    DATE_FORMAT(MIN(o.orderDate), '%Y-%m-%d') AS FirstOrder,
    DATE_FORMAT(MAX(o.orderDate), '%Y-%m-%d') AS LastOrder
FROM 
    Orders o
LEFT JOIN 
    Customers c ON c.CustomerID = o.CustomerID
GROUP BY 
    c.CustomerName
ORDER BY 
    MAX(o.orderDate) DESC
LIMIT 9;
</pre>

Query diatas seharusnya berjalan jika di mysql, namun tidak berjalan di https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all karena fungsi DATE_FORMAT dan limit tidak dikenali

Bisa menggunakan query dibawah ini jika ingin berjalan di w3schools, dengan catatan format date yang dihasilkan tidak sesuai dengan yang diharapkan
<pre>
SELECT 
    c.CustomerName,
    COUNT(o.OrderID) AS OrderCount,
    o.orderDate AS FirstOrder,
    o.orderDate AS LastOrder
FROM 
    Orders o
LEFT JOIN 
    Customers c ON c.CustomerID = o.CustomerID
GROUP BY 
    c.CustomerName
ORDER BY MAX(o.orderDate) DESC;
</pre>

# Vue.js

---

## Explain Vue.js Reactivity and Common Issues When Tracking Changes

### Penjelasan Reactivity di Vue.js:
Vue.js menggunakan sistem **reactive dependency tracking** melalui `Proxy` (Vue 3) atau `Object.defineProperty` (Vue 2). Saat data yang digunakan dalam template berubah, Vue akan secara otomatis memperbarui DOM yang terkait.

### Masalah Umum:
1. **Tidak reaktifnya properti baru** (Vue 2):
   - Menambahkan properti baru ke objek secara langsung tidak akan membuatnya reaktif.
   - Solusi: Gunakan `Vue.set(obj, 'property', value)`

2. **Array reactivity edge cases**:
   - Metode array seperti `splice` bersifat reaktif, tapi operasi langsung seperti `arr[index] = value` tidak akan memicu update di Vue 2.

3. **Masalah nested object**:
   - Perubahan dalam nested object tidak selalu terdeteksi secara mendalam.
   - Solusi: Gunakan `deep watcher` jika perlu.

---

## Describe Data Flow Between Components in a Vue.js App

### Dari Parent ke Child:
- Menggunakan **props** (`<Child :title="parentTitle" />`)

### Dari Child ke Parent:
- Menggunakan **custom events** (`this.$emit('eventName', data)`)

### Antara Sibling atau Komponen Tidak Langsung:
- Gunakan **event bus** (Vue 2), **state management (Vuex, Pinia)**, atau **provide/inject API**

---

## List the Most Common Cause of Memory Leaks in Vue.js Apps and How They Can Be Solved

### Penyebab Umum Memory Leak:
1. **Event listener tidak dihapus**
   - Solusi: Hapus listener di lifecycle `beforeUnmount` (Vue 3) atau `beforeDestroy` (Vue 2)

2. **Timers (setInterval / setTimeout) tidak di-clear**
   - Solusi: Pastikan `clearInterval` / `clearTimeout` dipanggil saat komponen dihancurkan

3. **WebSocket atau subscription tidak ditutup**
   - Solusi: Tutup koneksi/subscription di lifecycle hook sebelum komponen dihancurkan

4. **Referensi DOM atau data besar tidak dilepaskan**
   - Solusi: Pastikan referensi tidak disimpan di global scope atau cache

---

##️ What Have You Used for State Management

Saya telah menggunakan beberapa solusi state management pada aplikasi Vue.js, antara lain:

- **Vuex**: Cocok untuk aplikasi besar dan kompleks
- **Pinia**: State management modern dan lebih ringan, pengganti Vuex (terutama di Vue 3)
- **Provide / Inject**: Untuk berbagi state antar komponen tanpa props
- **Reactive Composition API** (Vue 3): Menggunakan `reactive()` atau `ref()` dalam shared state module

---

## ️ What’s the Difference Between Pre-rendering and Server Side Rendering?

###  Pre-rendering (Static Site Generation):
- HTML dibuat **saat build time**
- Cocok untuk konten statis (blog, landing page)
- Sangat cepat (karena disajikan seperti file HTML biasa)

###  Server Side Rendering (SSR):
- HTML dirender **saat request masuk**
- Cocok untuk aplikasi dinamis (mis. data user)
- Lebih fleksibel tetapi bisa lebih lambat dibanding pre-rendering

---


# Website Security Best Practises

Urutan dari yang paling penting:

1. **Validasi dan Sanitasi Input**
   - Hindari SQL Injection, XSS, Command Injection
   - Jangan percaya input user

2. **Gunakan HTTPS**
   - Enkripsi semua komunikasi antara client dan server

3. **Enkripsi Data Sensitif**
   - Gunakan bcrypt/argon2 untuk password
   - Enkripsi data penting di database

4. **Authentication & Authorization yang Aman**
   - Gunakan OAuth2, JWT, RBAC
   - Batasi akses berdasarkan peran

5. **Jangan Hardcode Secrets**
   - Simpan secret di `.env` atau secret manager (Vault, AWS Secrets Manager)

6. **Update dan Patch Rutin**
   - Selalu perbarui sistem dan dependency
   - Gunakan tools audit otomatis seperti Dependabot

7. **Gunakan Security Testing**
   - SAST (Static Application Security Testing)
   - DAST (Dynamic Application Security Testing)

8. **Gunakan WAF dan Rate Limiting**
   - Filter trafik berbahaya
   - Cegah brute force dengan limit request

9. **Prinsip Least Privilege**
   - Batasi akses user dan service hanya yang dibutuhkan

10. **Audit dan Logging**
    - Simpan log akses & aktivitas penting
    - Jangan log data sensitif

11. **Proteksi CSRF dan Konfigurasi CORS**
    - Gunakan token CSRF
    - Atur origin yang diizinkan

12. **Keamanan Akun**
    - Password kuat
    - Aktifkan 2FA
    - Lock akun setelah gagal login berulang

13. **Gunakan Dependensi Terpercaya**
    - Cek reputasi & review library
    - Hindari dependency berbahaya

14. **Amankan File Upload**
    - Validasi tipe file & ukuran
    - Scan virus

15. **Amankan Session**
    - Gunakan cookie `Secure`, `HttpOnly`, dan `SameSite`

16. **Tampilkan Error Secara Umum**
    - Jangan tampilkan stack trace atau detail error ke user

17. **Gunakan Content Security Policy (CSP)**
    - Cegah serangan XSS

18. **Amankan Endpoint API**
    - Autentikasi, CORS, rate limiting

19. **Hindari Klikjacking**
    - Gunakan header `X-Frame-Options: DENY`

20. **Penetration Testing**
    - Lakukan uji coba penetrasi secara berkala


# Golang (if interviewing for a Golang job)

<pre>
package main

import (
	"fmt"
	"regexp"
	"strings"
)

func countWordFrequency(text string) map[string]int {
	reg := regexp.MustCompile(`[^\w\s]`)
	cleanText := reg.ReplaceAllString(text, "")

	cleanText = strings.ToLower(cleanText)

	words := strings.Fields(cleanText)

	frequency := make(map[string]int)
	for _, word := range words {
		frequency[word]++
	}

	return frequency
}

func main() {
	text := "Four, One two two three Three three four four four"
	freq := countWordFrequency(text)

	for word, count := range freq {
		fmt.Printf("%s: %d\n", word, count)
	}
}

</pre>

# Tools (Rate yourself 1 to 5)

- **Git**: ⭐⭐⭐⭐⭐ (5)
- **Redis**: ⭐⭐⭐⭐⭐ (5)
- **VSCode / JetBrains**: ⭐⭐⭐⭐⭐ (5)
- **Linux**: ⭐⭐⭐⭐⭐ (5)
- **AWS**: ⭐⭐⭐⭐ (4)
  - **EC2**: ⭐⭐⭐⭐ (4)
  - **Lambda**: ⭐⭐⭐ (3)
  - **RDS**: ⭐⭐⭐⭐⭐ (5)
  - **CloudWatch**: ⭐⭐⭐ (3)
  - **S3**: ⭐⭐⭐⭐⭐ (5)
- **Unit Testing**: ⭐⭐⭐ (3)
- **Kanban Boards**: ⭐⭐⭐⭐⭐ (5)