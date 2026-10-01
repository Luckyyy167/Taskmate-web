# TaskMate — Implementation Task List

> Task list implementasi berdasarkan PRD TaskMate.  
> Stack yang dirujuk PRD: Next.js App Router, Route Handlers/API, PostgreSQL, Zod, serta struktur `src/app`, `components`, `lib`, `server`, dan `types`.

---

## 0. Project Setup

- [x] Inisialisasi project Next.js dengan App Router.
- [x] Konfigurasi TypeScript.
- [x] Konfigurasi environment variables.
- [x] Konfigurasi timezone aplikasi:
  - [x] `APP_TIMEZONE=Asia/Jakarta`
- [x] Setup PostgreSQL.
- [x] Setup ORM/database client sesuai arsitektur project.
- [x] Setup validasi schema menggunakan Zod.
- [x] Setup linting dan formatting.
- [x] Setup testing.
- [x] Setup struktur folder:
  - [x] `src/app`
  - [x] `src/components`
  - [x] `src/lib`
  - [x] `src/server`
  - [x] `src/types`

---

## 1. Database

### 1.1 Users

- [x] Buat tabel `users`.
- [x] Tambahkan `id` UUID sebagai primary key.
- [x] Tambahkan `name` VARCHAR(100) NOT NULL.
- [x] Tambahkan `email` VARCHAR(255) NOT NULL.
- [x] Tambahkan `password_hash` VARCHAR(255) NOT NULL.
- [x] Tambahkan `created_at`.
- [x] Tambahkan `updated_at`.
- [x] Tambahkan unique constraint untuk email.
- [x] Pastikan email disimpan dalam lowercase.

### 1.2 Tasks

- [x] Buat tabel `tasks`.
- [x] Tambahkan `id` UUID sebagai primary key.
- [x] Tambahkan foreign key `user_id` ke `users.id`.
- [x] Gunakan `ON DELETE CASCADE`.
- [x] Tambahkan `title` VARCHAR(100) NOT NULL.
- [x] Tambahkan `description` VARCHAR(500).
- [x] Tambahkan `due_date` DATE NOT NULL.
- [x] Tambahkan `due_time` TIME.
- [x] Tambahkan `priority`.
- [x] Tambahkan `category`.
- [x] Tambahkan `status`.
- [x] Tambahkan `completed_at`.
- [x] Tambahkan `created_at`.
- [x] Tambahkan `updated_at`.

### 1.3 Constraints

- [x] Validasi title tidak boleh kosong.
- [x] Validasi priority:
  - [x] `low`
  - [x] `medium`
  - [x] `high`
- [x] Validasi category:
  - [x] `college`
  - [x] `assignment`
  - [x] `personal`
  - [x] `project`
  - [x] `exam`
- [x] Validasi status:
  - [x] `todo`
  - [x] `in_progress`
  - [x] `completed`
- [x] Validasi konsistensi `status` dan `completed_at`.

### 1.4 Index

- [x] Index `(user_id, due_date)`.
- [x] Index `(user_id, status)`.
- [x] Index `(user_id, category)`.
- [x] Index `(user_id, completed_at)`.
- [x] Setup index pencarian title/description jika menggunakan PostgreSQL full-text/trigram search.

---

## 2. Authentication

### 2.1 Register

- [x] Buat halaman `/register`.
- [x] Buat form nama.
- [x] Buat form email.
- [x] Buat form password.
- [x] Validasi input dengan Zod.
- [x] Hash password sebelum disimpan.
- [x] Buat endpoint `POST /api/auth/register`.
- [x] Tangani email yang sudah terdaftar.
- [x] Tampilkan pesan validasi yang jelas.

### 2.2 Login

- [x] Buat halaman `/login`.
- [x] Buat form email.
- [x] Buat form password.
- [x] Validasi input.
- [x] Buat endpoint `POST /api/auth/login`.
- [x] Verifikasi password.
- [x] Buat session/cookie autentikasi yang aman.
- [x] Redirect user ke halaman tujuan setelah login.
- [x] Support `returnTo` pada `/login?returnTo={path}`.
- [x] Tangani login gagal.

### 2.3 Logout

- [x] Buat endpoint `POST /api/auth/logout`.
- [x] Hapus/invalidate session.
- [x] Redirect ke `/login`.

### 2.4 Current User

- [x] Buat endpoint `GET /api/me`.
- [x] Buat endpoint `PATCH /api/me`.
- [x] Support update nama user.
- [x] Lindungi endpoint dengan authentication middleware/helper.

---

## 3. Authorization & Security

- [x] Pastikan setiap task hanya dapat diakses oleh pemiliknya.
- [x] Validasi `user_id` dari session, bukan dari input client.
- [x] Lindungi seluruh route `/dashboard`, `/tasks`, `/today`, `/upcoming`, `/completed`, `/categories`, dan `/settings`.
- [x] Redirect user yang belum login ke `/login`.
- [x] Jangan expose password hash.
- [x] Gunakan cookie `HttpOnly`.
- [x] Gunakan cookie `Secure` pada production.
- [x] Gunakan `SameSite=Lax`.
- [x] Konfigurasi Content Security Policy.
- [x] Konfigurasi `X-Content-Type-Options`.
- [x] Konfigurasi `Referrer-Policy`.
- [x] Pastikan `frame-ancestors` sesuai kebutuhan keamanan.
- [x] Hindari penggunaan `dangerouslySetInnerHTML` kecuali benar-benar diperlukan dan telah disanitasi.
- [x] Tambahkan rate limiting pada endpoint authentication dan mutation jika diperlukan.

---

## 4. Task Domain & Validation

### 4.1 Task Schema

- [x] Buat shared type untuk Task.
- [x] Buat Zod schema untuk create task.
- [x] Buat Zod schema untuk update task.
- [x] Buat schema untuk query/filter.
- [x] Validasi:
  - [x] `title`
  - [x] `description`
  - [x] `due_date`
  - [x] `due_time`
  - [x] `priority`
  - [x] `category`
  - [x] `status`

### 4.2 Display Status

- [x] Implementasikan `display_status`.
- [x] Jika `status = completed`, display status harus `completed`.
- [x] Jika task belum selesai dan due date/time sudah lewat, display status menjadi `overdue`.
- [x] Selain kondisi tersebut, gunakan status tersimpan.
- [x] Perhitungan overdue harus menggunakan `APP_TIMEZONE=Asia/Jakarta`.

### 4.3 Progress

- [x] Task baru memiliki progress `0`.
- [x] Task completed memiliki progress `100`.
- [x] Task in progress menggunakan progress sesuai data aplikasi.
- [x] Pastikan progress konsisten antara API dan UI.

---

## 5. Task API

### 5.1 Create Task

- [x] Implementasikan `POST /api/tasks`.
- [x] Validasi request body.
- [x] Ambil `user_id` dari authenticated user.
- [x] Simpan task.
- [x] Set default priority `medium` jika tidak diberikan.
- [x] Set default status `todo`.
- [x] Validasi duplicate task.
- [x] Return response `{ data: ... }`.
- [x] Return `VALIDATION_ERROR` jika input invalid.
- [x] Return `DUPLICATE_TASK` jika task duplikat.

### 5.2 List Tasks

- [x] Implementasikan `GET /api/tasks`.
- [x] Support `view`:
  - [x] `all`
  - [x] `active`
  - [x] `today`
  - [x] `upcoming`
  - [x] `completed`
- [x] Support search `q`.
- [x] Support filter `status`.
- [x] Support filter `priority`.
- [x] Support filter `category`.
- [x] Support sorting.
- [x] Support `order=asc|desc`.
- [x] Support pagination.
- [x] Support `page`.
- [x] Support `limit`.
- [x] Return metadata pagination.
- [x] Default sort berdasarkan due date sesuai PRD.

### 5.3 Task Detail

- [x] Implementasikan `GET /api/tasks/:id`.
- [x] Validasi task ownership.
- [x] Return task detail.
- [x] Return `NOT_FOUND` jika task tidak ditemukan.

### 5.4 Update Task

- [x] Implementasikan `PUT /api/tasks/:id`.
- [x] Validasi request.
- [x] Validasi task ownership.
- [x] Update task.
- [x] Update `updated_at`.
- [x] Update `completed_at` jika status berubah.
- [x] Return updated task.

### 5.5 Delete Task

- [x] Implementasikan `DELETE /api/tasks/:id`.
- [x] Validasi ownership.
- [x] Hapus task.
- [x] Return confirmation deleted.

### 5.6 Complete/Reopen Task

- [x] Implementasikan `PATCH /api/tasks/:id/complete`.
- [x] Support `{ "completed": true }`.
- [x] Saat complete:
  - [x] Set status `completed`.
  - [x] Set progress `100`.
  - [x] Set `completed_at`.
- [x] Saat reopen:
  - [x] Set status `todo`.
  - [x] Set progress `0`.
  - [x] Set `completed_at = null`.
- [x] Pastikan display status dihitung kembali.

---

## 6. Summary & Dashboard API

### 6.1 Task Summary

- [x] Implementasikan `GET /api/tasks/summary`.
- [x] Return:
  - [x] `total`
  - [x] `completed`
  - [x] `in_progress`
  - [x] `todo`
  - [x] `overdue`
  - [x] `today`
  - [x] `completed_this_month`

### 6.2 Today's Progress

- [x] Hitung total task hari ini.
- [x] Hitung task selesai hari ini.
- [x] Hitung percentage:
  - [x] `completed_today / total_today * 100`
- [x] Handle `total_today = 0`.
- [x] Gunakan timezone Asia/Jakarta.

### 6.3 Category Summary

- [x] Buat endpoint `GET /api/categories`.
- [x] Return jumlah task per category.
- [x] Return jumlah task completed per category.
- [x] Support category:
  - [x] College
  - [x] Assignment
  - [x] Personal
  - [x] Project
  - [x] Exam

### 6.4 Notifications

- [x] Buat endpoint `GET /api/notifications`.
- [x] Hitung overdue task.
- [x] Hitung task yang jatuh tempo hari ini.
- [x] Return notification count.
- [x] Return notification items.
- [x] Bedakan tipe:
  - [x] `overdue`
  - [x] `due_today`

---

## 7. Application Routing

- [x] `/dashboard`
- [x] `/tasks`
- [x] `/tasks/{id}`
- [x] `/today`
- [x] `/upcoming`
- [x] `/completed`
- [x] `/categories`
- [x] `/categories/{key}`
- [x] `/settings`
- [x] `/login`
- [x] `/register`

### Query Parameters

- [x] `/tasks?q=report`
- [x] `/tasks?status=overdue`
- [x] `/tasks?priority=high`
- [x] `/tasks?category=assignment`
- [x] `/tasks?sort=due_date&order=asc`
- [x] `/tasks?page=2`
- [x] Support kombinasi query parameters.

---

## 8. Application Layout & Navigation

- [x] Buat root layout.
- [x] Buat authenticated app layout.
- [x] Buat auth layout.
- [x] Buat sidebar/navigation.
- [x] Buat mobile navigation/menu.
- [x] Tampilkan active navigation state.
- [x] Gunakan `aria-current="page"` pada halaman aktif.
- [x] Pastikan navigasi responsive.
- [x] Buat header global.
- [x] Tampilkan nama user.
- [x] Tambahkan search.
- [x] Tambahkan notification.
- [x] Tambahkan profile menu.

---

## 9. Dashboard UI

- [x] Buat halaman `/dashboard`.
- [x] Buat greeting/header.
- [x] Tampilkan nama user.
- [x] Buat search.
- [x] Buat notification button.
- [x] Buat profile section.
- [x] Buat summary cards:
  - [x] Total Tasks
  - [x] Completed
  - [x] In Progress
  - [x] Overdue
- [x] Buat Today's Progress.
- [x] Implement progress bar dengan accessibility.
- [x] Tampilkan task list.
- [x] Tambahkan empty state.
- [x] Hubungkan dashboard dengan API.

---

## 10. My Tasks UI

- [x] Buat halaman `/tasks`.
- [x] Tampilkan semua task.
- [x] Buat search.
- [x] Buat filter status.
- [x] Buat filter priority.
- [x] Buat filter category.
- [x] Buat sorting.
- [x] Buat pagination.
- [x] Buat task card/list item.
- [x] Tampilkan:
  - [x] Title
  - [x] Description
  - [x] Due date
  - [x] Due time
  - [x] Priority
  - [x] Category
  - [x] Status
  - [x] Progress
- [x] Tampilkan overdue secara jelas.
- [x] Tambahkan action edit.
- [x] Tambahkan action delete.
- [x] Tambahkan action complete.

---

## 11. Today UI

- [x] Buat halaman `/today`.
- [x] Filter task berdasarkan tanggal hari ini.
- [x] Tampilkan task yang due hari ini.
- [x] Tampilkan progress hari ini.
- [x] Tampilkan empty state jika tidak ada task.

---

## 12. Upcoming UI

- [x] Buat halaman `/upcoming`.
- [x] Tampilkan task mendatang.
- [x] Urutkan berdasarkan due date.
- [x] Tampilkan due time jika tersedia.
- [x] Bedakan task berdasarkan priority/status.

---

## 13. Completed UI

- [x] Buat halaman `/completed`.
- [x] Tampilkan task yang selesai.
- [x] Tampilkan `completed_at`.
- [x] Support membuka kembali task.
- [x] Tampilkan empty state jika belum ada task selesai.

---

## 14. Categories

### 14.1 Category List

- [x] Buat `/categories`.
- [x] Tampilkan semua kategori.
- [x] Tampilkan total task per kategori.
- [x] Tampilkan jumlah task completed.

### 14.2 Category Detail

- [x] Buat `/categories/{key}`.
- [x] Validasi category key.
- [x] Tampilkan task berdasarkan kategori.
- [x] Support filter/sort task.
- [x] Tampilkan empty state.

---

## 15. Create Task

- [x] Buat modal/overlay Create Task.
- [x] Field:
  - [x] Title
  - [x] Description
  - [x] Due date
  - [x] Due time
  - [x] Priority
  - [x] Category
- [x] Validasi field wajib.
- [x] Tampilkan inline validation error.
- [x] Disable submit saat loading.
- [x] Tampilkan success feedback.
- [x] Refresh task list setelah berhasil.
- [x] Support keyboard accessibility.

---

## 16. Edit Task

- [x] Buat modal/overlay Edit Task.
- [x] Pre-fill data task.
- [x] Validasi input.
- [x] Update melalui `PUT /api/tasks/:id`.
- [x] Tampilkan loading state.
- [x] Tampilkan error state.
- [x] Refresh UI setelah berhasil.

---

## 17. Task Detail

- [x] Buat `/tasks/{id}`.
- [x] Tampilkan detail lengkap task.
- [x] Tampilkan status.
- [x] Tampilkan display status.
- [x] Tampilkan overdue state.
- [x] Tampilkan progress.
- [x] Tampilkan created/updated time.
- [x] Tampilkan completed time jika tersedia.
- [x] Tambahkan edit action.
- [x] Tambahkan delete action.
- [x] Tambahkan complete/reopen action.
- [x] Handle task not found.

---

## 18. Delete Confirmation

- [x] Buat confirmation modal.
- [x] Tampilkan nama/title task yang akan dihapus.
- [x] Sediakan Cancel.
- [x] Sediakan Delete.
- [x] Tampilkan loading state.
- [x] Tampilkan error jika delete gagal.
- [x] Refresh list setelah delete.

---

## 19. Settings

### 19.1 Profile

- [x] Buat `/settings`.
- [x] Tampilkan nama user.
- [x] Tampilkan email.
- [x] Support update profile name.
- [x] Validasi input.

### 19.2 Appearance

- [x] Support Light mode.
- [x] Support Dark mode.
- [x] Support System mode.
- [x] Persist theme preference.
- [x] Gunakan dark mode berbasis class.
- [x] Respect system preference.

### 19.3 Account

- [x] Tambahkan logout.
- [x] Tampilkan confirmation jika diperlukan.
- [x] Redirect ke login setelah logout.

---

## 20. Design System

- [x] Buat design tokens.
- [x] Define:
  - [x] `primary`
  - [x] `primary-soft`
  - [x] `bg-app`
  - [x] `bg-surface`
  - [x] `border`
  - [x] `text-primary`
  - [x] `text-secondary`
  - [x] `success`
  - [x] `warning`
  - [x] `danger`
  - [x] `neutral`
  - [x] `info`
- [x] Buat typography scale.
- [x] Gunakan system UI/sans-serif.
- [x] Buat reusable button.
- [x] Buat reusable input.
- [x] Buat reusable select.
- [x] Buat reusable modal/dialog.
- [x] Buat reusable badge.
- [x] Buat reusable card.
- [x] Buat reusable progress bar.
- [x] Buat reusable empty state.
- [x] Buat reusable loading state.
- [x] Buat reusable error state.

---

## 21. Icons

Gunakan icon set yang konsisten untuk kebutuhan:

- [x] Dashboard
- [x] List/Todo
- [x] Calendar check
- [x] Calendar clock
- [x] Completed
- [x] Categories/Folders
- [x] Settings
- [x] Search
- [x] Bell
- [x] Add
- [x] Edit
- [x] Delete
- [x] Close
- [x] Filter
- [x] Sort
- [x] Menu
- [x] User/Profile
- [x] Education/College
- [x] Assignment
- [x] Personal
- [x] Project
- [x] Exam

---

## 22. Responsive UI

- [x] Mobile layout.
- [x] Tablet layout.
- [x] Desktop layout.
- [x] Sidebar responsive.
- [x] Header responsive.
- [x] Task list responsive.
- [x] Summary cards responsive.
- [x] Modal responsive.
- [x] Form responsive.
- [x] Table/list tidak overflow pada mobile.
- [x] Support touch interaction.
- [x] Pastikan layout tetap usable pada viewport kecil.

---

## 23. Accessibility

- [x] Gunakan semantic HTML.
- [x] Pastikan semua input memiliki `<label>`.
- [x] Gunakan `aria-label` bila diperlukan.
- [x] Gunakan `aria-describedby` untuk error/help text.
- [x] Gunakan `aria-invalid` pada input invalid.
- [x] Gunakan `aria-required` pada field wajib.
- [x] Gunakan `role="status"` untuk status feedback.
- [x] Gunakan `role="alert"` untuk error penting.
- [x] Gunakan `role="progressbar"` pada progress.
- [x] Pastikan progress memiliki `aria-valuenow`.
- [x] Pastikan progress memiliki `aria-valuemin`.
- [x] Pastikan progress memiliki `aria-valuemax`.
- [x] Pastikan modal menggunakan `role="dialog"`.
- [x] Pastikan modal menggunakan `aria-modal="true"`.
- [x] Pastikan modal memiliki `aria-labelledby`.
- [x] Pastikan focus management benar.
- [x] Pastikan seluruh fitur dapat digunakan dengan keyboard.
- [x] Respect `prefers-reduced-motion`.
- [x] Pastikan kontras warna memadai.

---

## 24. Search, Filter & Sort

### Search

- [x] Implementasikan search `q`.
- [x] Search title.
- [x] Search description.
- [x] Tampilkan result count.
- [x] Handle search tanpa hasil.
- [x] Validasi query agar aman.

### Filter

- [x] Filter status.
- [x] Filter priority.
- [x] Filter category.
- [x] Support overdue.
- [x] Support kombinasi filter.
- [x] Sinkronkan filter dengan URL query parameter.

### Sort

- [x] Sort by due date.
- [x] Sort by priority.
- [x] Sort by created date.
- [x] Sort by status.
- [x] Sort by completed date.
- [x] Support ascending.
- [x] Support descending.

### Pagination

- [x] Implementasikan `page`.
- [x] Implementasikan `limit`.
- [x] Validasi page agar tidak negatif.
- [x] Batasi limit agar tidak berlebihan.
- [x] Tampilkan total item.
- [x] Tampilkan total pages.
- [x] Buat pagination control.

---

## 25. Empty, Loading & Error States

- [x] Empty state Dashboard.
- [x] Empty state My Tasks.
- [x] Empty state Today.
- [x] Empty state Upcoming.
- [x] Empty state Completed.
- [x] Empty state Categories.
- [x] Loading state halaman.
- [x] Loading state list.
- [x] Loading state mutation.
- [x] Error state API.
- [x] Error state not found.
- [x] Error state validation.
- [x] Error state authentication.
- [x] Tampilkan feedback melalui status/alert yang accessible.

---

## 26. Notifications

- [x] Tampilkan notification icon.
- [x] Hitung overdue count.
- [x] Hitung due today count.
- [x] Tampilkan notification list.
- [x] Link overdue notification ke `/tasks?status=overdue`.
- [x] Link due today notification ke `/today`.
- [x] Pastikan notification hanya berasal dari task user yang sedang login.

---

## 27. Analytics/Event Tracking

Implementasikan event sesuai kebutuhan PRD:

- [x] `user_registered`
- [x] `dashboard_viewed`
- [x] `task_create_started`
- [x] `task_created`
- [x] `task_updated`
- [x] `task_deleted`
- [x] `task_completed`
- [x] `task_reopened`
- [x] `search_used`
- [x] `filter_applied`
- [x] `sort_changed`
- [x] `category_page_viewed`
- [x] `task_detail_viewed`
- [x] `theme_changed`
- [x] `mutation_failed`

Tambahkan properties yang relevan:

- [x] `source`
- [x] `priority`
- [x] `category`
- [x] `has_description`
- [x] `has_due_time`
- [x] `duration_ms`
- [x] `fields_changed`
- [x] `on_time`
- [x] `was_overdue`
- [x] `query_length`
- [x] `result_count`
- [x] `filter_type`
- [x] `sort`
- [x] `order`
- [x] `theme`
- [x] `action`
- [x] `status_code`

---

## 28. Error Response Standard

Gunakan format response API yang konsisten:

```json
{
  "data": {}
}
```

Untuk error:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message.",
    "details": [
      {
        "field": "field_name",
        "message": "Field validation message."
      }
    ]
  }
}
```

- [x] Implementasikan `VALIDATION_ERROR`.
- [x] Implementasikan `NOT_FOUND`.
- [x] Implementasikan `DUPLICATE_TASK`.
- [x] Implementasikan authentication error.
- [x] Implementasikan authorization error.
- [x] Implementasikan generic server error.
- [x] Jangan expose detail internal server pada production.

---

## 29. Service & Repository Layer

### Services

- [x] Buat Task Service.
- [x] Buat Summary Service.
- [x] Buat Auth Service.
- [x] Buat Category Service.
- [x] Buat Notification Service.

### Repositories

- [x] Task Repository.
- [x] User Repository.
- [x] Query untuk task list.
- [x] Query untuk task detail.
- [x] Query untuk task summary.
- [x] Query untuk category summary.
- [x] Query untuk notifications.

### Shared Helpers

- [x] Auth helper.
- [x] Database client.
- [x] Zod schemas.
- [x] Date/time helper.
- [x] Overdue helper.
- [x] Pagination helper.
- [x] API response helper.

---

## 30. Testing

### Unit Test

- [x] Test validation schema.
- [x] Test display status.
- [x] Test overdue calculation.
- [x] Test progress calculation.
- [x] Test today's progress.
- [x] Test pagination validation.
- [x] Test filter parsing.
- [x] Test sort parsing.

### API Test

- [x] Register success.
- [x] Register duplicate email.
- [x] Login success.
- [x] Login invalid credential.
- [x] Logout.
- [x] Get current user.
- [x] Update current user.
- [x] Create task.
- [x] Create invalid task.
- [x] Create duplicate task.
- [x] Get tasks.
- [x] Get task detail.
- [x] Update task.
- [x] Delete task.
- [x] Complete task.
- [x] Reopen task.
- [x] Get summary.
- [x] Get categories.
- [x] Get notifications.

### Authorization Test

- [x] User A tidak dapat membaca task User B.
- [x] User A tidak dapat mengubah task User B.
- [x] User A tidak dapat menghapus task User B.
- [x] User A tidak dapat menyelesaikan task User B.

### UI/E2E Test

- [x] Register flow.
- [x] Login flow.
- [x] Redirect unauthenticated user.
- [x] Create task flow.
- [x] Edit task flow.
- [x] Delete task flow.
- [x] Complete/reopen flow.
- [x] Search flow.
- [x] Filter flow.
- [x] Sort flow.
- [x] Pagination flow.
- [x] Dashboard flow.
- [x] Today flow.
- [x] Upcoming flow.
- [x] Completed flow.
- [x] Category flow.
- [x] Settings flow.
- [x] Theme switching.

### Accessibility Test

- [x] Keyboard navigation.
- [x] Form labels.
- [x] ARIA attributes.
- [x] Modal focus.
- [x] Screen-reader status/error.
- [x] Progress bar accessibility.
- [x] Reduced motion.

---

## 31. Security Test

- [x] Test SQL injection protection.
- [x] Test XSS protection.
- [x] Test CSRF/session protection.
- [x] Test authorization.
- [x] Test insecure direct object reference pada task ID.
- [x] Test invalid UUID.
- [x] Test malformed query parameters.
- [x] Test excessive pagination limit.
- [x] Test malicious search query.
- [x] Test authentication rate limit.
- [x] Verify security headers.

---

## 32. Performance

- [x] Pastikan query task menggunakan index.
- [x] Hindari N+1 query.
- [x] Batasi pagination.
- [x] Optimalkan search.
- [x] Optimalkan dashboard summary query.
- [x] Optimalkan notification query.
- [x] Gunakan caching jika dibutuhkan.
- [x] Optimalkan client-side rendering.
- [x] Minimalkan unnecessary API calls.
- [x] Pastikan mutation tidak melakukan refresh halaman penuh jika tidak diperlukan.

---

## 33. Production Readiness

- [x] Setup production environment variables.
- [x] Setup production database.
- [x] Jalankan database migration.
- [x] Setup secure cookies.
- [x] Setup HTTPS.
- [x] Setup logging.
- [x] Setup error monitoring.
- [x] Setup backup database.
- [x] Setup health check.
- [x] Setup CI/CD.
- [x] Jalankan lint.
- [x] Jalankan type check.
- [x] Jalankan unit test.
- [x] Jalankan API test.
- [x] Jalankan E2E test.
- [x] Build production berhasil.
- [x] Test production build.

---

## 34. Final Acceptance Checklist

### Authentication

- [x] User dapat register.
- [x] User dapat login.
- [x] User dapat logout.
- [x] User dapat melihat profile.
- [x] User dapat update profile.
- [x] Protected route bekerja.

### Task Management

- [x] User dapat membuat task.
- [x] User dapat melihat task.
- [x] User dapat melihat detail task.
- [x] User dapat mengedit task.
- [x] User dapat menghapus task.
- [x] User dapat menyelesaikan task.
- [x] User dapat membuka kembali task.

### Views

- [x] Dashboard bekerja.
- [x] My Tasks bekerja.
- [x] Today bekerja.
- [x] Upcoming bekerja.
- [x] Completed bekerja.
- [x] Categories bekerja.
- [x] Category Detail bekerja.
- [x] Settings bekerja.

### Search & Organization

- [x] Search bekerja.
- [x] Filter status bekerja.
- [x] Filter priority bekerja.
- [x] Filter category bekerja.
- [x] Sort bekerja.
- [x] Pagination bekerja.

### Dashboard

- [x] Total Tasks benar.
- [x] Completed benar.
- [x] In Progress benar.
- [x] Overdue benar.
- [x] Today's Progress benar.
- [x] Task list dashboard benar.
- [x] Notification benar.

### UX & Accessibility

- [x] Responsive mobile.
- [x] Responsive tablet.
- [x] Responsive desktop.
- [x] Light mode.
- [x] Dark mode.
- [x] System theme.
- [x] Keyboard accessible.
- [x] Screen-reader friendly.
- [x] Loading state.
- [x] Empty state.
- [x] Error state.

### Security

- [x] Authorization benar.
- [x] Password aman.
- [x] Session aman.
- [x] Security headers aktif.
- [x] Input validation aktif.
- [x] XSS protection.
- [x] SQL injection protection.
- [x] Rate limiting sesuai kebutuhan.

---

## 35. Suggested Implementation Order

Untuk meminimalkan dependency antarfitur, implementasikan dalam urutan berikut:

1. [ ] Project setup & dependency.
2. [ ] Environment & database connection.
3. [ ] Database schema & migration.
4. [ ] Shared types & Zod schemas.
5. [ ] Authentication & session.
6. [ ] User API.
7. [ ] Task repository.
8. [ ] Task service.
9. [ ] Task API CRUD.
10. [ ] Complete/reopen task API.
11. [ ] Summary/category/notification API.
12. [ ] Application layout & navigation.
13. [ ] Login & register UI.
14. [ ] Task list UI.
15. [ ] Create/Edit/Delete task UI.
16. [ ] Task detail UI.
17. [ ] Dashboard UI.
18. [ ] Today/Upcoming/Completed UI.
19. [ ] Categories UI.
20. [ ] Settings UI.
21. [ ] Search/filter/sort/pagination.
22. [ ] Theme system.
23. [ ] Responsive improvements.
24. [ ] Accessibility.
25. [ ] Error/loading/empty states.
26. [ ] Analytics/event tracking.
27. [ ] Unit testing.
28. [ ] API testing.
29. [ ] E2E testing.
30. [ ] Security testing.
31. [ ] Performance optimization.
32. [ ] Production deployment.

---

## 36. Definition of Done

Sebuah task dapat dianggap selesai apabila:

- [x] Implementasi sesuai requirement PRD.
- [x] Tidak ada TypeScript error.
- [x] Tidak ada lint error.
- [x] Validasi input tersedia.
- [x] Error handling tersedia.
- [x] Loading state tersedia jika proses asynchronous.
- [x] Empty state tersedia jika relevan.
- [x] Accessibility dasar terpenuhi.
- [x] Responsive pada mobile/tablet/desktop.
- [x] Authorization sudah diverifikasi.
- [x] Unit/API/E2E test yang relevan sudah dibuat.
- [x] Tidak ada regression pada fitur lain.
- [x] Dokumentasi teknis diperbarui jika diperlukan.

---

## Reference

Task list ini diturunkan dari PRD `TaskMate`, termasuk routing, Task CRUD, API contract, authentication, database schema, summary, category, notification, accessibility, security, struktur Next.js, dan event tracking.
