# 🛒 MiniMart Marketplace

A simplified full-stack marketplace app built with **React (Vite + TypeScript)** and a backend API.
Supports **Admin, Seller, and Buyer** roles with features for product management, inventory, orders, and shopping cart.

---

## 🚀 Features

### Buyer

* Browse products with **pagination, search & sorting**
* Add products to cart and place orders
* View order history & order details
* Responsive cart management

### Seller

* Manage **inventory** (add, edit, delete)
* Track and update order statuses
* View buyer details per order

### Admin

* Manage users (create, delete)
* Manage products (CRUD operations with image upload)

### Shared

* **Authentication & Role-based navigation**
* Responsive layout (**AppShell with mobile menu**)
* Consistent UI components (Button, Card, Input, Dropdown, Pagination, Dialog, Badge, etc.)

---

## 🛠️ Tech Stack

* **Frontend**

  * [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
  * [TailwindCSS](https://tailwindcss.com/) for styling
  * [Lucide Icons](https://lucide.dev/) for icons
  * Custom UI components (`Button`, `Card`, `Dialog`, `Pagination`, `Dropdown`, etc.)
  * State via `useState`, `useEffect`, `useCallback` (no Redux/Context for simplicity)

* **Backend API** (expected)

  * Endpoints like `api.listProducts`, `api.landingProducts`, `api.addSellerInventory`, etc.
  * JWT authentication
  * Role-based routes (Buyer, Seller, Admin)

---

## 📂 Project Structure

```
src/
 ├── api/              # API client functions
 ├── components/ui/    # Reusable UI components
 ├── pages/            # Page-level components
 │    ├── ProductsPage.tsx
 │    ├── InventoryPage.tsx
 │    ├── OrderPage.tsx
 │    ├── OrderDetailPage.tsx
 │    ├── AdminProductPage.tsx
 │    └── Auth/LoginPage.tsx
 ├── types/            # TypeScript models (User, Product, Order, etc.)
 ├── AppShell.tsx      # Layout wrapper
 └── main.tsx          # React entry point
```

---

## ⚡ Getting Started

### 1. Clone repo

```bash
git clone https://github.com/erickong12/minimart.git
cd minimart
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API

Edit **`.env`** and set `API_BASE` to your backend URL.

```env
VITE_API_BASE = "http://localhost:8000";
```

### 4. Run dev server

```bash
npm run dev
```

App will be available at **[http://localhost:5173](http://localhost:5173)**

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## 🔑 User Roles & Flows

* **Buyer**

  * Registers / logs in
  * Views **ProductsPage**, can add items to cart and place orders
* **Seller**

  * Manages inventory in **InventoryPage**
  * Handles incoming orders in **OrderPage**
* **Admin**

  * Manages users and products in **Admin pages**

---

## 📌 Notes

* Pagination supports **search toggle** (optional).
* **Order status badges** use dynamic variants for clarity:

  * `PENDING` → gray
  * `CONFIRMED` → blue
  * `READY_TO_PICKUP` → orange
  * `DONE` → green
  * `CANCELLED` → red
* Mobile nav uses a **responsive Drawer/Dropdown**, no `Sheet` dependency.

---

## 🧑‍💻 Development Guidelines

* Keep components **stateless** where possible, handle state in pages.
* Use `Pagination` for consistent listing (products, orders, inventory).
* Reuse `Dialog` for forms (Add/Edit).
* Always call `fetchData` after mutations (create/update/delete).
* Use `toast` for feedback messages.
