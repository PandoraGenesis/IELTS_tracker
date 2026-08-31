<div align="center">

# IELTS_tracker

**A personal 28-day IELTS study logbook and progress tracker.**  
*Nhật ký theo dõi tiến độ luyện IELTS cá nhân trong 28 ngày.*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

[🇻🇳 Tiếng Việt](#-tiếng-việt) • [🇬🇧 English](#-english)

</div>

---

<h2 id="tiếng-việt">🇻🇳 Tiếng Việt</h2>

## 📌 Giới Thiệu Dự Án

**IELTS_tracker** là một trang web tự quản lý lộ trình luyện IELTS cá nhân trong 28 ngày, với mục tiêu nâng band Overall từ 6.0 lên 8.0. Ứng dụng theo dõi tiến độ theo từng kỹ năng (Listening, Reading, Writing, Speaking), ghi lại kết quả các bài test thuộc nhiều nguồn khác nhau (Cambridge, VOL, Actual Test, Mock Test, Practice C) và trực quan hóa xu hướng điểm số theo thời gian bằng chart.

## ✨ Tính Năng Chính

* **Theo dõi 28 ngày học theo tuần:** mỗi ngày có mô tả nội dung có thể chỉnh sửa trực tiếp trên giao diện.
* **Ghi nhận điểm số đa nguồn:** hỗ trợ nhiều loại bài test (Cambridge, VOL, Actual Test, Mock Test, Practice C), mỗi loại có thể thêm hoặc xóa từng lần làm bài.
* **Biểu đồ đường bay điểm số:** so sánh song song giữa các loại test và mục tiêu từng kỹ năng theo thời gian.
* **Thống kê tổng quan:** bảng band hiện tại và delta so với mục tiêu, cập nhật theo thời gian thực.
* **Lưu trữ cục bộ:** toàn bộ dữ liệu được lưu bằng `localStorage` của trình duyệt, không cần backend hay tài khoản.

## 📁 Cấu Trúc Thư Mục

```text
IELTS_tracker/
├── original.html       # Cấu trúc trang (markup)
├── style.css           # Toàn bộ style giao diện
├── script.js           # Toàn bộ logic ứng dụng (render, state, lưu trữ)
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

Toàn bộ dữ liệu nhập vào (điểm test, mô tả từng ngày...) được lưu trong `localStorage` của trình duyệt đang dùng. Dữ liệu sẽ không đồng bộ giữa các thiết bị/trình duyệt khác nhau, và sẽ mất nếu xóa dữ liệu trình duyệt.

## 📜 Giấy Phép

Dự án được thực hiện phục vụ mục đích học tập cá nhân, không nhằm mục đích thương mại.

---

<h2 id="english">🇬🇧 English</h2>

## 📌 Project Introduction

**IELTS_tracker** is a personal web app for managing a 28-day IELTS study logbook, aiming to raise the Overall band from 6.0 to 8.0. It tracks progress across each skill (Listening, Reading, Writing, Speaking), logs test results from multiple sources (Cambridge, VOL, Actual Test, Mock Test, Practice C), and visualizes score trends over time with charts.

## ✨ Key Features

* **28-day weekly tracking:** each day has an editable description, directly editable in the interface.
* **Multi-source score logging:** supports several test types (Cambridge, VOL, Actual Test, Mock Test, Practice C), each with add/delete per attempt.
* **Score trend charts:** compares results across test types against each skill's target over time.
* **Overview stats:** current band and delta versus target, updated in real time.
* **Local storage:** all data is saved via the browser's `localStorage`, with no backend or account required.

## 📁 Directory Structure

```text
IELTS_tracker/
├── original.html       # Page structure (markup)
├── style.css           # All interface styles
├── script.js           # All application logic (rendering, state, storage)
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

All entered data (test scores, day descriptions...) is stored in the current browser's `localStorage`. Data does not sync across devices or browsers, and will be lost if browser data is cleared.

## 📜 License

This project was created for personal study purposes and is not intended for commercial use.
