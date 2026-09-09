# 🎓 HƯỚNG DẪN CHI TIẾT: DEPLOY MIỄN PHÍ & LƯU LỜI CHÚC TRỰC TUYẾN

> **Dự án:** Thiệp Mời Lễ Tốt Nghiệp Thạc Sĩ — **Vũ Thị Ngọc Quỳnh**  
> **Tác giả thiệp:** *Made by Hien Truong*

---

## 💡 GIẢI ĐÁP CÁC CÂU HỎI CỦA BẠN

### 1. "Những lời chúc thì lưu ở đâu? Người khác có xem được không?"
* **Trước đây:** Lời chúc chỉ lưu trong `localStorage` (bộ nhớ trình duyệt của người đó). Nghĩa là bạn A gửi lời chúc từ điện thoại của bạn A thì chỉ có bạn A thấy, Quỳnh hoặc bạn B mở máy lên **sẽ KHÔNG thấy**.
* **Bây giờ (Đã hoàn thiện giải pháp):** Tôi đã tạo sẵn backend **Google Sheets Database** (file `google_sheets_backend.js`). Khi kết nối:
  - Tất cả lời chúc, danh sách xác nhận đi hay không, kèm ảnh chụp Photo Booth sẽ **tự động lưu vào 1 file Google Trang Tính (Google Sheets) của bạn**.
  - **Tất cả mọi người mở website ở bất kỳ đâu đều nhìn thấy toàn bộ lời chúc của nhau** theo thời gian thực (real-time).
  - Bạn và Quỳnh có thể mở Google Sheets trên điện thoại ra xem danh sách khách mời tham dự bất kỳ lúc nào!

---

### 2. "Deploy lên kiểu gì? Có gì dùng miễn phí để thử nghiệm gửi cho người khác không?"
* **Có 100% MIỄN PHÍ vĩnh viễn, cực kỳ uy tín và bảo mật HTTPS (có ổ khóa xanh):**
  - **Cách số 1 (Đề xuất - Nhanh nhất quả đất, 10 giây):** Dùng **Netlify Drop** — Chỉ cần kéo thả thư mục `graduation` vào trình duyệt là có link gửi ngay cho mọi người qua Zalo/Messenger!
  - **Cách số 2:** Dùng **Vercel** hoặc **GitHub Pages**.

---

## 🚀 PHẦN 1: CÀI ĐẶT DATABASE GOOGLE SHEETS (Chỉ mất 2 phút)

Tất cả code backend đã được viết sẵn trong file [`google_sheets_backend.js`](file:///d:/BMC_Projects/test/graduation/google_sheets_backend.js). Bạn chỉ cần làm theo 4 bước sau:

### Bước 1: Tạo Google Sheet mới
1. Mở trình duyệt và truy cập: **[https://sheets.new](https://sheets.new)** để tạo trang tính mới.
2. Đặt tên file (góc trên bên trái): `Danh Sách Khách & Lời Chúc Tốt Nghiệp - Ngọc Quỳnh`.

### Bước 2: Dán code Backend
1. Trên thanh menu của Google Sheets, chọn: **Tiện ích mở rộng** *(Extensions)* ➜ **Apps Script**.
2. Một tab mới hiện ra với giao diện lập trình của Google.
3. Xóa hết code mẫu có sẵn trong ô soạn thảo (`function myFunction() { ... }`).
4. Mở file [`google_sheets_backend.js`](file:///d:/BMC_Projects/test/graduation/google_sheets_backend.js) trong thư mục này, **Copy toàn bộ nội dung** và **Dán vào tab Apps Script**.
5. Bấm nút **Lưu** (biểu tượng đĩa mềm 💾 hoặc phím tắt `Ctrl + S`).

### Bước 3: Xuất bản Web App (Deploy)
1. Ở góc trên bên phải, bấm nút màu xanh **Triển khai** *(Deploy)* ➜ Chọn **Triển khai mới** *(New deployment)*.
2. Bấm vào biểu tượng **Bánh răng ⚙️** (bên cạnh dòng *Chọn loại / Select type*) ➜ Chọn **Ứng dụng web** *(Web app)*.
3. Điền các thông tin:
   - **Mô tả** *(Description)*: `Quynh Graduation API`
   - **Thực thi dưới dạng** *(Execute as)*: `Tôi (địa chỉ email của bạn)`
   - **Ai có quyền truy cập** *(Who has access)*: **CHỌN "BẤT KỲ AI" (ANYONE)**. *(⚠️ Bắt buộc chọn cái này để bạn bè vào web có thể gửi lời chúc và đọc lời chúc)*.
4. Bấm nút **Triển khai** *(Deploy)*.
5. **Cấp quyền truy cập cho Google (chỉ làm lần đầu):**
   - Google hiện popup "Cần có sự ủy quyền" ➜ Bấm **Ủy quyền truy cập** *(Authorize access)*.
   - Chọn tài khoản Google của bạn.
   - Nếu thấy cảnh báo *"Google chưa xác minh ứng dụng này"* ➜ Bấm vào chữ **Nâng cao** *(Advanced)* ở góc dưới ➜ Bấm vào **Đi tới Dự án không có tiêu đề (không an toàn)**.
   - Kéo xuống bấm **Cho phép** *(Allow)*.
6. Sau khi hoàn tất, Google sẽ cấp cho bạn một **URL ứng dụng web** *(Web app URL)* có dạng:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. Bấm **Sao chép** *(Copy)* đường link này!

### Bước 4: Dán link vào file script.js
1. Mở file [`script.js`](file:///d:/BMC_Projects/test/graduation/script.js).
2. Ngay dòng số **11**, tìm dòng:
   ```javascript
   const CLOUD_API_URL = '';
   ```
3. Dán link vừa copy vào giữa hai dấu nháy:
   ```javascript
   const CLOUD_API_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Bấm `Ctrl + S` để lưu file `script.js`.

> 🎉 **CHÚC MỪNG BẠN!** Kể từ lúc này, mọi lời chúc, ảnh Photo Booth và xác nhận đi dự của khách sẽ tự động đồng bộ lên Google Sheets và hiển thị công khai cho mọi người cùng đọc!

---

## 🌐 PHẦN 2: DEPLOY WEBSITE LÊN INTERNET MIỄN PHÍ

### Cách 1: Dùng Netlify Drop (ĐƠN GIẢN & NHANH NHẤT - KHUYÊN DÙNG)
Không cần cài bất kỳ phần mềm nào, không cần gõ lệnh.

1. Mở trình duyệt vào trang: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Bạn đăng nhập hoặc đăng ký nhanh bằng Google/GitHub (hoàn toàn miễn phí).
3. Mở thư mục máy tính: `d:\BMC_Projects\test`.
4. **Kéo cả thư mục `graduation`** rồi thả vào ô nét đứt trên trang web Netlify Drop.
5. Đợi khoảng 5 - 10 giây để hệ thống tải lên.
6. Khi hoàn tất, Netlify sẽ cấp ngay cho bạn một đường link website có sẵn SSL (HTTPS), ví dụ: `https://glowing-cupcake-123456.netlify.app`.
7. **Đổi tên miền theo tên Quỳnh cho đẹp:**
   - Bấm vào **Site configuration** ➜ **Change site name**.
   - Nhập tên mong muốn, ví dụ: `thiep-tot-nghiep-ngoc-quynh` hoặc `quynh-thac-si-qlkt`.
   - Đường link của bạn sẽ trở thành: **`https://thiep-tot-nghiep-ngoc-quynh.netlify.app`** cực kỳ chuyên nghiệp!

---

### Cách 2: Dùng GitHub Pages (Nếu bạn thích lưu mã nguồn trên GitHub)
1. Tạo repository mới trên GitHub (ví dụ: `graduation-quynh`).
2. Mở terminal tại thư mục `graduation` và chạy:
   ```bash
   git init
   git add .
   git commit -m "Thiệp tốt nghiệp Ngọc Quỳnh"
   git branch -M main
   git remote add origin https://github.com/TÊN_GITHUB_CỦA_BẠN/graduation-quynh.git
   git push -u origin main
   ```
3. Vào **Settings** ➜ **Pages** ➜ Tại mục **Branch** chọn `main` / `root` ➜ Bấm **Save**.
4. Sau 1 phút, website sẽ chạy tại: `https://TÊN_GITHUB_CỦA_BẠN.github.io/graduation-quynh/`.

---

## 📱 PHẦN 3: KIỂM TRA VÀ GỬI CHO KHÁCH

Sau khi deploy xong link:
1. Bạn lấy điện thoại mở thử link web.
2. Bấm vào mở phong bì ✉️, xem hiệu ứng pháo hoa, nghe nhạc tốt nghiệp 🎵.
3. Chụp thử 1 tấm ảnh ở **Photo Booth** và gửi lời chúc kèm xác nhận tham dự.
4. Mở Google Sheet trên máy tính hoặc điện thoại kiểm tra: Dòng mới sẽ xuất hiện ngay lập tức với đầy đủ Tên, Mối quan hệ, Xác nhận đi, Lời chúc và Ảnh!
5. Lấy link gửi qua **Zalo, Messenger, Facebook** cho bạn bè, thầy cô và người thân của Quỳnh!
