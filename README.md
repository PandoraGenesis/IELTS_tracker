<div align="center">

# IELTS_tracker

**A customizable 28-day IELTS study logbook and progress tracker — fork it and make it your own.**  
*Nhật ký theo dõi tiến độ luyện IELTS trong 28 ngày, ai cũng có thể tùy chỉnh theo lộ trình của riêng mình.*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

[🇻🇳 Tiếng Việt](#-tiếng-việt) • [🇬🇧 English](#-english)

</div>

---

<h2 id="tiếng-việt">🇻🇳 Tiếng Việt</h2>

## 📌 Giới Thiệu Dự Án

**IELTS_tracker** là một trang web tự quản lý lộ trình luyện IELTS trong 28 ngày. Ứng dụng theo dõi tiến độ theo từng kỹ năng (Listening, Reading, Writing, Speaking), ghi lại kết quả các bài test thuộc nhiều nguồn khác nhau (Cambridge, VOL, Actual Test, Mock Test, Practice C) và trực quan hóa xu hướng điểm số theo thời gian bằng chart. Toàn bộ band hiện tại, band mục tiêu, tên từng tuần và nội dung từng ngày đều chỉnh sửa được ngay trên giao diện — dùng chung một mã nguồn nhưng mỗi người tự biến thành lộ trình của riêng mình.

## ✨ Tính Năng Chính

* **Tùy chỉnh band hiện tại & mục tiêu:** bấm nút "⚙ Tùy chỉnh mục tiêu" để nhập band hiện tại và band mục tiêu cho từng kỹ năng theo đúng tình hình bản thân; toàn bộ thẻ điểm, biểu đồ và mục tiêu Overall tự cập nhật theo.
* **Tùy chỉnh nội dung & cấu trúc 4 tuần:** bấm trực tiếp vào tên chủ đề mỗi tuần hoặc tiêu đề/mô tả từng ngày để đổi thành kế hoạch học của riêng mình, không bị bó buộc theo lộ trình mẫu.
* **Theo dõi 28 ngày học theo tuần:** mỗi ngày có tiêu đề và mô tả nội dung có thể chỉnh sửa trực tiếp trên giao diện.
* **Ghi nhận điểm số đa nguồn:** hỗ trợ nhiều loại bài test (Cambridge, VOL, Actual Test, Mock Test, Practice C), mỗi loại có thể thêm hoặc xóa từng lần làm bài.
* **Biểu đồ đường bay điểm số:** so sánh song song giữa các loại test và mục tiêu từng kỹ năng theo thời gian.
* **Thống kê tổng quan:** bảng band hiện tại và delta so với mục tiêu, cập nhật theo thời gian thực.
* **Lưu trữ cục bộ:** toàn bộ dữ liệu (điểm số lẫn các tùy chỉnh) được lưu bằng `localStorage` của trình duyệt, không cần backend hay tài khoản.

## 🛠️ Tùy Chỉnh Theo Tình Hình Bản Thân

Vì đây là dự án dùng chung, mỗi người mở trang lên sẽ thấy đúng lộ trình mẫu — nhưng có thể đổi thành của riêng mình mà không cần sửa code:

1. Bấm **⚙ Tùy chỉnh mục tiêu** ở đầu trang để nhập band hiện tại và band mục tiêu cho Listening/Reading/Writing/Speaking.
2. Bấm vào **tên chủ đề của từng tuần** (dưới hàng tab Tuần 1–4) để đổi trọng tâm luyện tập cho phù hợp giai đoạn của bạn.
3. Bấm vào **tiêu đề hoặc phần mô tả của từng ngày** để viết lại kế hoạch học theo đúng nhịp độ và điểm yếu của bản thân.
4. Có nút **"Đặt lại mặc định"** trong khung tùy chỉnh mục tiêu nếu muốn quay về band mẫu ban đầu.

Lưu ý: các thay đổi này lưu theo `localStorage`, nên chỉ áp dụng cho trình duyệt/thiết bị đang dùng — mỗi người dùng chung link vẫn giữ được bản tùy chỉnh riêng của mình mà không ảnh hưởng đến người khác.

## 📁 Cấu Trúc Thư Mục

```text
IELTS_tracker/
├── index.html           # Cấu trúc trang (markup)
├── style.css            # Toàn bộ style giao diện
├── script.js            # Toàn bộ logic ứng dụng (render, state, lưu trữ)
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Hướng Dẫn Cài Đặt & Vận Hành

Đây là ứng dụng web tĩnh, không cần build hay cài dependency.

#### 1. Chạy trực tiếp trên máy

```bash
    git clone https://github.com/PandoraGenesis/IELTS_tracker.git
    cd IELTS_tracker
```

Mở trực tiếp file `index.html` bằng trình duyệt.

#### 2. Chạy qua GitHub Pages

Trang đã được publish tại:

**🔗 https://pandoragenesis.github.io/IELTS_tracker/**

## ⚠️ Lưu Ý Về Dữ Liệu

Toàn bộ dữ liệu nhập vào (điểm test, mô tả/tiêu đề từng ngày, band mục tiêu tùy chỉnh, tên tuần tùy chỉnh...) được lưu trong `localStorage` của trình duyệt đang dùng. Dữ liệu sẽ không đồng bộ giữa các thiết bị/trình duyệt khác nhau, và sẽ mất nếu xóa dữ liệu trình duyệt.

## 📜 Giấy Phép

Dự án được thực hiện phục vụ mục đích học tập cá nhân, không nhằm mục đích thương mại.

---

<h2 id="english">🇬🇧 English</h2>

## 📌 Project Introduction

**IELTS_tracker** is a web app for managing a 28-day IELTS study logbook. It tracks progress across each skill (Listening, Reading, Writing, Speaking), logs test results from multiple sources (Cambridge, VOL, Actual Test, Mock Test, Practice C), and visualizes score trends over time with charts. Current band, target band, each week's theme, and each day's plan are all editable directly in the interface — one shared codebase, freely adaptable into anyone's own study plan.

## ✨ Key Features

* **Customizable current & target band:** click the "⚙ Customize targets" button to set your own current and target band for each skill; all stat cards, charts, and the Overall target update automatically.
* **Customizable 4-week content & structure:** click each week's theme label, or any day's title/description, to rewrite the study plan to fit your own situation.
* **28-day weekly tracking:** each day has an editable title and description, directly editable in the interface.
* **Multi-source score logging:** supports several test types (Cambridge, VOL, Actual Test, Mock Test, Practice C), each with add/delete per attempt.
* **Score trend charts:** compares results across test types against each skill's target over time.
* **Overview stats:** current band and delta versus target, updated in real time.
* **Local storage:** all data — scores as well as customizations — is saved via the browser's `localStorage`, with no backend or account required.

## 🛠️ Customize for Your Own Situation

Since this is a shared project, anyone opening the page first sees the sample plan — but can turn it into their own without touching any code:

1. Click **⚙ Customize targets** at the top of the page to enter your current and target band for Listening/Reading/Writing/Speaking.
2. Click each **week's theme label** (below the Week 1–4 tabs) to change the focus of that phase to match where you are.
3. Click any **day's title or description** to rewrite the study plan to your own pace and weak points.
4. A **"Reset to default"** button is available inside the targets panel if you want to go back to the sample band values.

Note: these changes are saved via `localStorage`, so they only apply to the browser/device you're using — everyone sharing the same link keeps their own customized version without affecting anyone else's.

## 📁 Directory Structure

```text
IELTS_tracker/
├── index.html           # Page structure (markup)
├── style.css            # All interface styles
├── script.js            # All application logic (rendering, state, storage)
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Installation & Usage

This is a static web app — no build step or dependencies required.

#### 1. Run locally

```bash
    git clone https://github.com/PandoraGenesis/IELTS_tracker.git
    cd IELTS_tracker
```

Open `index.html` directly in a browser.

#### 2. Run via GitHub Pages

The site is published at:

**🔗 https://pandoragenesis.github.io/IELTS_tracker/**

## ⚠️ Data Note

All entered data (test scores, day titles/descriptions, custom target bands, custom week labels...) is stored in the current browser's `localStorage`. Data does not sync across devices or browsers, and will be lost if browser data is cleared.

## 📜 License

This project was created for personal study purposes and is not intended for commercial use.
