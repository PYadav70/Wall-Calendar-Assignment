# 📅 Wall Calendar Planner

An interactive, modern wall calendar built with **Next.js, TypeScript, and Tailwind CSS**, featuring date range selection and integrated notes.

---

## 🚀 Features

* 📆 **Wall Calendar UI**

  * Clean, minimal design inspired by physical wall calendars
  * Hero image that changes with the month
  * Responsive layout for all devices

* 🎯 **Date Range Selection**

  * Select start and end dates
  * Visual highlighting for:

    * Start date
    * End date
    * In-between range
  * Smooth hover preview for better UX

* 📝 **Notes System**

  * Add notes for:

    * Selected date range
    * Entire month
  * Edit and delete notes
  * Notes persist using `localStorage`

* 🎨 **Modern UI/UX**

  * Built with Tailwind CSS
  * Smooth animations and transitions
  * Clean typography and spacing

* 🌙 **Extras**

  * Dark mode support
  * Weekend highlighting
  * Today indicator

---

## 🛠 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Date Handling:** date-fns
* **Animations:** Framer Motion (optional)

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/wall-calendar.git
cd wall-calendar
```

---

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

---

### 3. Run the development server

```bash
npm run dev
```

---

### 4. Open in browser

```
http://localhost:3000
```

---

## 📁 Project Structure

```
app/
  layout.tsx
  page.tsx

components/
  calendar-grid.tsx
  day-cell.tsx
  notes-panel.tsx
  hero-image.tsx

hooks/
lib/
public/
```

---

## 💾 Data Persistence

* Notes are stored in **localStorage**
* No backend required (frontend-only project)

---

## 📱 Responsive Design

* **Desktop:** Image | Calendar | Notes
* **Tablet:** Adjusted grid layout
* **Mobile:** Stacked layout (Image → Calendar → Notes)

---

## 🎯 Design Goals

* Replicate a **real wall calendar aesthetic**
* Provide **intuitive date range selection**
* Maintain **clean and scalable component architecture**
* Deliver a **production-level UI experience**

---

## 🌐 Live Demo (Optional)

👉 https://wall-calendar-plum.vercel.app/

---


---

## 🙌 Author

**Pappu Kumar Yadav**

---

