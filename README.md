# Smart Canteen Web App

This is a **React.js frontend application** that implements a smart canteen system with different modules for students, staff, and admins. It covers menu browsing, order management, inventory tracking, analytics, and feedback.

---

## 🚀 Features

### 👩‍🎓 Student & Staff Web App
- View daily menu
- Pre-order meals with customization (basic demo flow)
- Multiple payment options (placeholder)
- View order history & receipts (to be extended)
- Push notifications (simulated alerts)

### 🧑‍🍳 Canteen-side Dashboard (Staff)
- Realtime order management
- Update food availability (sync with app)
- Automatic bill generation & payment confirmation (demo flow)

### 📦 Inventory & Analytics Module
- Track inventory (basic dummy dataset)
- Automatic low-stock alerts (to be implemented)
- Sales analytics with charts (using `recharts`)
- Revenue calculation (to be extended)

### ⭐ Feedback & Ratings
- Students can rate meals in-app
- Admin dashboard generates reports to improve canteen operations

---

## 🛠️ Tech Stack
- **React.js** (Frontend Framework)
- **TailwindCSS** (Styling)
- **shadcn/ui** (Reusable UI Components)
- **Recharts** (Data Visualization)

---

## 📂 Project Structure
```
📦 smart-canteen-app
 ┣ 📂 src
 ┃ ┣ 📜 App.jsx       # Main app entry with tabs
 ┃ ┣ 📜 index.js      # ReactDOM render
 ┃ ┣ 📂 components   # UI components (cards, buttons, tabs)
 ┗ 📜 README.md
```

---

## ▶️ Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/smart-canteen-app.git
   cd smart-canteen-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open in browser:
   ```
   http://localhost:5173
   ```

---

## 📊 Future Improvements
- Authentication & role-based dashboards (Student/Staff/Admin)
- Payment gateway integration
- Real-time database sync (Firebase / Supabase / Node backend)
- Push notifications (WebSockets or Firebase Cloud Messaging)
- Detailed sales & revenue reports

---

## 📜 License
This project is open-source and free to use under the **MIT License**.
