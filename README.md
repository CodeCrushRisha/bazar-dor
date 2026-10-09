# 🛒 বাজার দর (BazarDor)

প্রয়োজনীয় পণ্যের দাম এক নজরে দেখার জন্য একটি রেসপন্সিভ ওয়েব অ্যাপ। চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের দাম, পরিবর্তন এবং বাজারভিত্তিক বিস্তারিত তথ্য এক জায়গায়।

---

## 🚀 Live Demo

👉 **[https://bazar-dor-opal.vercel.app](https://bazar-dor-opal.vercel.app)**

## 📦 GitHub Repository

👉 **[https://github.com/CodeCrushRisha/bazar-dor](https://github.com/CodeCrushRisha/bazar-dor)**

---

## 🛠️ Technologies Used

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **DaisyUI v5**
- **BetterAuth** — Email/Password + Google + GitHub OAuth
- **Neon PostgreSQL** — Production database
- **react-hot-toast** — Notification system
- **Lucide React** — Icons
- **Vercel** — Deployment platform

---

## ✨ Key Features

1. **ডায়নামিক হোম পেজ** — Top 6 risers, Top 6 fallers এবং সব ৩৩টি পণ্যের রেসপন্সিভ গ্রিড
2. **প্রোডাক্ট ডিটেইলস পেজ (Protected)** — দামের Min/Max/Avg সারসংক্ষেপ + ১২টি বাজারের তুলনামূলক টেবিল
3. **ক্যাটাগরি পেজ** — সর্টিং (ডিফল্ট / দাম: কম থেকে বেশি / বেশি থেকে কম), skeleton loader এবং empty state
4. **BetterAuth Authentication** — Email/Password + Google + GitHub login, toast notifications, protected route middleware
5. **বাংলা সংখ্যা ও তারিখ** — সব দাম বাংলা ডিজিটে (১৪৮ টাকা), হেডারে আজকের বাংলা তারিখ
6. **লাইভ প্রাইস টিকার** — Navbar-এর নিচে infinite scrolling দামের স্ট্রিপ
7. **Profile Update** — BetterAuth `updateUser` API দিয়ে নাম পরিবর্তন
8. **Fallback Data** — API rate limit হলে static data থেকে render করে
9. **Custom 404 Page** — Invalid routes-এর জন্য friendly 404 পেজ
10. **Fully Responsive** — Mobile, tablet, desktop সব screen-এ perfect

---

## 🚀 Run Locally

```bash
git clone https://github.com/CodeCrushRisha/bazar-dor.git
cd bazar-dor
npm install
npm run dev