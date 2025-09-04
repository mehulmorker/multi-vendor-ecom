# Database Schema – Multi-Vendor E-Commerce Platform

## Tables

---

### Users
- id (UUID, PK)
- name (string)
- email (string, unique)
- password_hash (string)
- role (enum: customer, vendor, admin)
- created_at (timestamp)
- updated_at (timestamp)

---

### Vendors
- id (UUID, PK)
- user_id (UUID, FK → Users.id)
- store_name (string)
- store_description (text)
- is_approved (boolean, default: false)
- created_at (timestamp)

---

### Products
- id (UUID, PK)
- vendor_id (UUID, FK → Vendors.id)
- name (string)
- description (text)
- price (decimal)
- stock (int)
- category (string)
- images (jsonb array)
- created_at (timestamp)

---

### Carts
- id (UUID, PK)
- user_id (UUID, FK → Users.id)
- created_at (timestamp)

---

### Cart_Items
- id (UUID, PK)
- cart_id (UUID, FK → Carts.id)
- product_id (UUID, FK → Products.id)
- quantity (int)

---

### Orders
- id (UUID, PK)
- user_id (UUID, FK → Users.id)
- vendor_id (UUID, FK → Vendors.id)
- total_amount (decimal)
- status (enum: pending, paid, shipped, delivered, cancelled)
- created_at (timestamp)

---

### Order_Items
- id (UUID, PK)
- order_id (UUID, FK → Orders.id)
- product_id (UUID, FK → Products.id)
- quantity (int)
- price (decimal)

---

### Payments
- id (UUID, PK)
- order_id (UUID, FK → Orders.id)
- stripe_payment_id (string)
- status (enum: pending, succeeded, failed, refunded)
- amount (decimal)
- created_at (timestamp)

---

### Notifications
- id (UUID, PK)
- user_id (UUID, FK → Users.id)
- message (string)
- is_read (boolean, default: false)
- created_at (timestamp)

---

### Analytics (ClickHouse / Aggregated)
- id (UUID, PK)
- event_type (enum: order_placed, payment_success, product_view, cart_add)
- user_id (UUID, FK → Users.id, nullable)
- vendor_id (UUID, FK → Vendors.id, nullable)
- product_id (UUID, FK → Products.id, nullable)
- amount (decimal, nullable)
- created_at (timestamp)

---

## Indexing & Performance
- Products → GIN index on name, category (for search)  
- Orders → index on user_id, vendor_id  
- Payments → index on order_id, status  
- Analytics → partitioned by created_at (for fast queries)
