const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Tạo cron job test mỗi phút
// | Phần | Ý nghĩa |
// |------|--------|
// | 5    | phút = 5
// | *    | giờ = 0h sáng
// | *    | mỗi ngày trong tháng
// | *    | mỗi tháng
// | *    | mỗi ngày trong tuần
cron.schedule('30 * * * *', () => {
  const now = new Date();

  // Tạo folder theo ngày, ví dụ: ./reports/2025-06-20
  const folderPath = path.join(__dirname, '../../reports', now.toISOString().split('T')[0]);
  fs.mkdirSync(folderPath, { recursive: true });

  // Dữ liệu báo cáo
  const data = {
    timestamp: now.toISOString(),
    status: 'done',
    message: '📄 Daily report generated for 5 minutes'
  };

  // Ghi file report.json vào thư mục theo ngày
  const filePath = path.join(folderPath, `report-${Date.now()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log("✅ Daily report created:", filePath);
});
