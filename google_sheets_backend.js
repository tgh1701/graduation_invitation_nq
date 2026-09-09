/**
 * ===================================================================
 * BACKEND GOOGLE APPS SCRIPT CHO THIỆP MỜI TỐT NGHIỆP - VŨ THỊ NGỌC QUỲNH
 * ===================================================================
 * 
 * HƯỚNG DẪN 3 BƯỚC NHANH ĐỂ CÓ DATABASE ONLINE MIỄN PHÍ:
 * 1. Truy cập https://sheets.new để tạo một trang tính Google Sheets mới.
 *    (Đặt tên trang tính ví dụ: "Danh Sách Lời Chúc Tốt Nghiệp - Ngọc Quỳnh")
 * 
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 *    - Xóa hết code mặc định trong đó đi.
 *    - Dán TOÀN BỘ đoạn code bên dưới này vào.
 *    - Bấm nút "Lưu" (biểu tượng đĩa mềm 💾).
 * 
 * 3. Bấm nút "Triển khai" (Deploy) màu xanh ở góc trên bên phải:
 *    - Chọn "Triển khai mới" (New deployment).
 *    - Ở mục "Chọn loại" (biểu tượng bánh răng ⚙️): Chọn "Ứng dụng web" (Web app).
 *    - Phần "Mô tả" (Description): Điền "Quỳnh Graduation API".
 *    - Phần "Thực thi dưới dạng" (Execute as): Chọn "Tôi" (Me).
 *    - Phần "Ai có quyền truy cập" (Who has access): CHỌN "BẤT KỲ AI" (Anyone). ⚠️ RẤT QUAN TRỌNG!
 *    - Bấm "Triển khai" (Deploy).
 *    - Google sẽ yêu cầu cấp quyền (Authorize Access) -> Chọn tài khoản Google của bạn -> Bấm "Advanced" (Nâng cao) -> Bấm "Go to Untitled project (unsafe)" -> Bấm "Allow" (Cho phép).
 *    - SAU ĐÓ COPY ĐƯỜNG LINK "URL ứng dụng web" (Web app URL, có đuôi kết thúc bằng /exec).
 * 
 * 4. Mở file script.js trong máy tính của bạn, dán link vào biến CLOUD_API_URL:
 *    const CLOUD_API_URL = 'https://script.google.com/macros/s/.../exec';
 * 
 * Xong! Mọi lời chúc, ảnh Photo Booth và xác nhận tham dự của mọi người sẽ tự động
 * bay vào bảng Google Sheets của bạn và hiển thị cho tất cả khách xem!
 */

const SHEET_NAME = "LoiChuc";

// Khởi tạo hoặc lấy Sheet
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Tạo tiêu đề cột đẹp mắt
    const headers = [
      "Thời gian",
      "Họ và tên",
      "Mối quan hệ",
      "Xác nhận tham dự",
      "Lời chúc",
      "Ảnh Photo Booth",
      "ID"
    ];
    sheet.appendRow(headers);
    
    // Format hàng tiêu đề
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0a0e27");
    headerRange.setFontColor("#d4af37");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    sheet.setFrozenRows(1);
    
    // Đặt độ rộng cột cho dễ nhìn
    sheet.setColumnWidth(1, 160); // Thời gian
    sheet.setColumnWidth(2, 180); // Họ tên
    sheet.setColumnWidth(3, 140); // Mối quan hệ
    sheet.setColumnWidth(4, 150); // Đi hay không
    sheet.setColumnWidth(5, 350); // Lời chúc
    sheet.setColumnWidth(6, 200); // Ảnh
    sheet.setColumnWidth(7, 130); // ID
  }
  return sheet;
}

// Xử lý khi có khách gửi lời chúc mới (POST Request)
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    let data;
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const id = data.id || Date.now().toString();
    const name = data.name || "Khách ẩn danh";
    const relation = data.relation || "Bạn bè";
    const attendance = data.attendance === "yes" ? "✅ Sẽ tham dự" : "❌ Không thể tham dự";
    const wish = data.wish || "Chúc mừng tốt nghiệp!";
    let photo = data.photo || "";
    
    // Google Sheet cell tối đa 50,000 ký tự. Nếu ảnh quá dài thì cắt an toàn để tránh lỗi sheet
    if (photo && photo.length > 49000) {
      photo = photo.substring(0, 49000);
    }

    // Thời gian định dạng Việt Nam
    const formattedTime = Utilities.formatDate(
      new Date(), 
      "GMT+7", 
      "HH:mm:ss dd/MM/yyyy"
    );

    // Ghi vào dòng mới
    sheet.appendRow([
      formattedTime,
      name,
      relation,
      attendance,
      wish,
      photo,
      id
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Đã lưu lời chúc thành công!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Xử lý khi trang web mở lên để lấy danh sách lời chúc hiển thị cho mọi người (GET Request)
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    const wishes = [];

    // Bỏ qua hàng 1 (hàng tiêu đề)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[1]) continue; // Bỏ qua nếu không có tên
      
      const attendRaw = row[3] || "";
      const attendance = attendRaw.toString().includes("Không") ? "no" : "yes";

      wishes.push({
        id: row[6] || (Date.now() - i),
        timestamp: row[0] || "",
        name: row[1] || "",
        relation: row[2] || "Bạn bè",
        attendance: attendance,
        wish: row[4] || "",
        photo: row[5] || null
      });
    }

    // Đảo ngược để lời chúc mới nhất nằm lên đầu trang
    wishes.reverse();

    return ContentService
      .createTextOutput(JSON.stringify(wishes))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm chạy thử trên trình biên tập Apps Script để test
function testSetup() {
  const sheet = getOrCreateSheet();
  Logger.log("Sheet đã sẵn sàng: " + sheet.getName());
}
