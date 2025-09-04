# API Reference – Multi-Vendor E-Commerce Platform

This document lists all core API endpoints, grouped by service.

---

## Auth Service
- **POST /auth/register** → Register new user (role: customer/vendor/admin)
- **POST /auth/login** → Login with email/password
- **POST /auth/refresh-token** → Refresh JWT
- **POST /auth/logout** → Invalidate session
- **GET /auth/me** → Get logged-in user profile

---

## User Service
- **GET /users/:id** → Get user profile
- **PATCH /users/:id** → Update profile
- **DELETE /users/:id** → Soft delete user
- **GET /users** → Admin only: list all users

---

## Vendor Service
- **POST /vendors** → Apply/register as vendor
- **GET /vendors/:id** → Vendor profile
- **PATCH /vendors/:id** → Update vendor details
- **GET /vendors** → List vendors (public)

---

## Product Service
- **POST /products** → Create product (vendor only)
- **GET /products/:id** → Get product details
- **PATCH /products/:id** → Update product
- **DELETE /products/:id** → Delete product
- **GET /products** → List products (with filters: category, price, search, vendor)

---

## Cart Service
- **POST /cart** → Add item to cart
- **GET /cart** → Get current cart
- **PATCH /cart/:itemId** → Update quantity
- **DELETE /cart/:itemId** → Remove item

---

## Order Service
- **POST /orders** → Place order (from cart)
- **GET /orders/:id** → Get order details
- **GET /orders** → List user’s orders
- **PATCH /orders/:id/cancel** → Cancel order (before shipping)
- **PATCH /orders/:id/status** → Vendor/admin update status

---

## Payment Service
- **POST /payments/checkout** → Create Stripe checkout session
- **POST /payments/webhook** → Stripe webhook (payment success/failure)
- **GET /payments/:orderId** → Get payment status

---

## Analytics Service
- **GET /analytics/sales** → Sales trends (filter: vendor, time range)
- **GET /analytics/realtime** → Real-time active users, orders, revenue
- **GET /analytics/products/top** → Top-selling products
- **GET /analytics/vendors/top** → Top-performing vendors

---

## Notification Service
- **POST /notifications** → Send notification (system use only)
- **GET /notifications** → Get user notifications
- **PATCH /notifications/:id/read** → Mark as read

---

## Search Service
- **GET /search/products** → Search products (Elasticsearch)
- **GET /search/vendors** → Search vendors

---

## Admin Service
- **GET /admin/dashboard** → High-level KPIs
- **PATCH /admin/vendors/:id/approve** → Approve vendor
- **PATCH /admin/vendors/:id/suspend** → Suspend vendor
- **GET /admin/reports** → System-wide analytics report
