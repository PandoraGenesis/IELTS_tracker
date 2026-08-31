# Nhật Ký Bứt Phá IELTS

Một trang web tự quản lý lộ trình luyện IELTS cá nhân trong 28 ngày, mục tiêu nâng band Overall từ 6.0 lên 8.0. Ứng dụng theo dõi tiến độ theo từng kỹ năng (Listening, Reading, Writing, Speaking), ghi lại kết quả các bài test thuộc nhiều nguồn khác nhau (Cambridge, VOL, Actual Test, Mock Test, Practice C) và trực quan hóa xu hướng điểm số theo thời gian bằng chart.

## Tính năng

- Theo dõi tiến độ 28 ngày học theo tuần, mỗi ngày có mô tả nội dung có thể chỉnh sửa trực tiếp
- Ghi nhận điểm số cho nhiều loại bài test (Cambridge, VOL, Actual Test, Mock Test, Practice C), mỗi loại có thể thêm/xóa từng lần làm bài
- Biểu đồ đường bay điểm số so sánh song song giữa các loại test và mục tiêu từng kỹ năng
- Bảng thống kê tổng quan (band hiện tại, delta so với mục tiêu) cập nhật theo thời gian thực
- Dữ liệu được lưu cục bộ trong trình duyệt bằng `localStorage`, không cần backend hay tài khoản

## Cấu trúc dự án

```
.
├── index.html   # Cấu trúc trang (markup)
├── style.css    # Toàn bộ style
├── script.js    # Toàn bộ logic ứng dụng (render, state, lưu trữ)
└── README.md
```

## Cách chạy

Đây là ứng dụng tĩnh, không cần build hay cài dependency. Chỉ cần mở trực tiếp `index.html` bằng trình duyệt, hoặc host qua GitHub Pages:

1. Push repo lên GitHub
2. Vào **Settings → Pages**, chọn branch chứa mã nguồn (thường là `main`) và thư mục gốc (`/`)
3. GitHub sẽ cung cấp một URL public để truy cập ứng dụng

## Lưu ý về dữ liệu

Toàn bộ dữ liệu nhập vào (điểm test, mô tả từng ngày...) được lưu trong `localStorage` của trình duyệt đang dùng. Dữ liệu sẽ không đồng bộ giữa các thiết bị/trình duyệt khác nhau, và sẽ mất nếu xóa dữ liệu trình duyệt.
