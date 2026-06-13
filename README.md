# 🛒 Daily Cart

A full-stack e-commerce platform that allows customers to browse products, manage shopping carts, and complete purchases online, while providing administrators and managers with powerful tools to manage products, orders, and store operations.

Built using a modern tech stack including **React (client-side UI)**, **Node.js + Express (server-side logic)**, **PostgreSQL (database management)** and **Stripe (payment processing)**.

---

## 🚀 Features

### Customer Features

- 🛍 Browse products
- 🔍 Search products by name
- 🏷 Filter products by category
- 🛒 Add products to cart
- 💳 Secure checkout with Stripe
- 📦 View order status
- 🚪 Logout

### Management Features

- ➕ Create products
- ✏️ Update products
- 📋 View customer orders
- 📦 Manage order statuses
- 👥 Manage store managers (Admin only)
- 🔐 Role-based access control

---

## 🧩 Tech Stack

### Frontend

- React
- Axios
- React Router DOM
- Sonner

### Backend

- Node.js
- Express
- PostgreSQL
- JWT
- Cookie Parser
- BCrypt
- Multer
- Stripe
- CORS
- Dotenv

### Database

- PostgreSQL

---

## 🔑 Authentication & Security

### Authentication

The application uses **JWT-based authentication** with access and refresh tokens.

- Access tokens authenticate user requests.
- Refresh tokens are stored in HTTP-only cookies.
- Expired access tokens are automatically renewed using refresh tokens.
- Invalid tokens result in session expiration and require re-authentication.

### Authorization

Role-based permissions are implemented:

- **Customer** → Shopping and order management.
- **Manager** → Product and order management.
- **Admin** → Full access, including manager administration.

---

## 💳 Payments

Stripe is integrated to provide secure payment processing.

Features include:

- Checkout session creation
- Payment validation
- Order generation after successful payment
- Secure Stripe API integration

---

## 🌳 Environment Variables

### Client & Admin

```env
VITE_SERVER_URL=
```

| Variable          | Description                  |
| ----------------- | ---------------------------- |
| `VITE_SERVER_URL` | Base URL of the backend API. |

### Server

#### Server Configuration

```env
CLIENT_URL=
ADMIN_URL=
PORT=
NODE_ENV=
```

| Variable     | Description                                              |
| ------------ | -------------------------------------------------------- |
| `CLIENT_URL` | URL of the customer-facing frontend application.         |
| `ADMIN_URL`  | URL of the admin dashboard frontend.                     |
| `PORT`       | Port where the server will run.                          |
| `NODE_ENV`   | Application environment (`development` or `production`). |

#### Database

```env
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=
```

| Variable      | Description                   |
| ------------- | ----------------------------- |
| `DB_USER`     | PostgreSQL database username. |
| `DB_PASSWORD` | PostgreSQL database password. |
| `DB_NAME`     | Database name.                |
| `DB_HOST`     | Database host address.        |
| `DB_PORT`     | PostgreSQL port.              |

#### JWT

```env
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
```

| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| `JWT_ACCESS_SECRET`  | Secret key used to sign access tokens.  |
| `JWT_REFRESH_SECRET` | Secret key used to sign refresh tokens. |

#### Roles

```env
ADMIN_CODE=
MANAGER_CODE=
```

| Variable       | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `ADMIN_CODE`   | Secret code required to register or log in as an administrator. |
| `MANAGER_CODE` | Secret code required to register or log in as a store manager.  |

#### Stripe

```env
STRIPE_SECRET=
```

| Variable        | Description                                        |
| --------------- | -------------------------------------------------- |
| `STRIPE_SECRET` | Secret API key used for Stripe payment processing. |

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/TKbang-bang/daily-cart.git
cd daily-cart-sql
```

### 2. Setup Client

```bash
cd client
npm install
npm run dev
```

### 3. Setup Admin Dashboard

```bash
cd admin
npm install
npm run dev
```

### 4. Setup Server

```bash
cd server
npm install
npm run dev
```

---

## 👤 Author

**Woodley TK**

GitHub:
https://github.com/TKbang-bang/

---

## 📌 Notes

This project was designed to demonstrate a complete e-commerce workflow, including:

- Authentication with JWT and refresh tokens
- Role-based authorization
- Product management
- Shopping cart functionality
- Stripe payment integration
- Scalable backend architecture
- PostgreSQL database management

It is a backend-focused project that showcases real-world e-commerce concepts and application structure.
