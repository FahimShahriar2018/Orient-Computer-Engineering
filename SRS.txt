# Software Requirements Specification (SRS)
## Project: Orient Computers & Engineering E-Commerce Platform
**Target Brand**: [Orient Computers & Engineering](https://orientcomputers.com.bd/)  
**Document Version**: 1.0.0  
**Context**: Internship Web Development Project  

---

## 1. Project Overview & Objectives

### 1.1 Purpose
The purpose of this project is to design, develop, and deploy an e-commerce web application for **Orient Computers & Engineering**, an IT hardware retailer and engineering solutions provider in Bangladesh. The platform enables customers to browse, search, compare, and purchase computer hardware, laptops, peripherals, and engineering equipment, while providing store administrators with a management dashboard for products and customer orders.

### 1.2 Scope & Target Audience
- **Retail Customers**: Gamers, students, and professionals shopping for laptops, desktop parts, and accessories.
- **Enterprise & Engineers**: Clients seeking networking equipment, security/CCTV hardware, and office IT setups.
- **Store Administrators**: Team managing product inventory, pricing, and fulfilling customer orders.

---

## 2. Functional Requirements (FR)

### 2.1 Module 1: Storefront Header & Navigation (Amazon-Inspired)
- **FR-1.1 Top Support Bar**: Display customer support phone numbers, email, showroom location, and business hours.
- **FR-1.2 Global Search Bar**:
  - Keyword search matching product titles, brands, categories, and tags.
  - Category selector dropdown inside the search bar.
  - Real-time auto-suggestions as the user types.
- **FR-1.3 Quick Action Elements**:
  - Wishlist icon with active count badge.
  - Shopping Cart icon with quantity badge and slide-out preview drawer.
  - User Account menu (Sign In / Register / My Orders).
- **FR-1.4 Category Mega Menu**: Structured multi-level navigation for computer hardware categories:
  - *Laptops & Ultrabooks* (Gaming, Business, Student)
  - *Desktop & Components* (Processors, Motherboards, Graphics Cards, RAM, Storage, PSUs, Cases, Cooling)
  - *Monitors & Displays*
  - *Networking & Security* (Routers, Switches, CCTV Cameras, Access Points)
  - *Peripherals & Accessories* (Keyboards, Mice, Headsets, UPS)
- **FR-1.5 Footer**: Company information, terms & conditions, warranty policy, return policy, social links, newsletter subscription, and accepted payment badge icons.

---

### 2.2 Module 2: Homepage Experience
- **FR-2.1 Hero Banner Carousel**: Auto-sliding promotional banners with direct call-to-action (CTA) buttons for deals and new product launches.
- **FR-2.2 Quick Category Grid**: Visual category cards for fast navigation into key component categories.
- **FR-2.3 Flash Deals / Deal of the Day**: Time-limited discounted items featuring a live countdown clock.
- **FR-2.4 Featured Collections**: Dynamic product carousels for *Top Selling Components*, *New Arrivals*, and *Trending Laptops*.
- **FR-2.5 Value Proposition Badges**: Highlighting 100% Genuine Products, Official Brand Warranty, EMI availability, and Fast Nationwide Delivery.

---

### 2.3 Module 3: Product Catalog, Search & Filtering (Amazon Style)
- **FR-3.1 Catalog View Modes**: Switch between Grid view (3x4 / 4x4) and List view.
- **FR-3.2 Multi-Facet Sidebar Filtering**:
  - **Category Filter**: Filter by primary category and sub-categories.
  - **Brand Filter**: Checkboxes for major brands (Asus, MSI, Gigabyte, Intel, AMD, HP, Dell, Corsair, etc.).
  - **Price Range Filter**: Dual-thumb interactive slider (in Bangladeshi Taka ৳ / BDT).
  - **Stock Status Filter**: In Stock, Pre-Order, Upcoming.
  - **Rating Filter**: Minimum rating (e.g., 4★ & above).
- **FR-3.3 Sorting Mechanism**:
  - Price: Low to High / High to Low
  - Popularity / Most Reviewed
  - Newest Arrivals
  - Customer Rating

---

### 2.4 Module 4: Product Details Page (PDP)
- **FR-4.1 Image Gallery**: Main high-resolution image with interactive hover zoom and multiple thumbnail previews.
- **FR-4.2 Key Product Information**: Product title, SKU, brand, stock status (In Stock / Out of Stock), pricing (Regular vs. Discounted Price), and savings badge.
- **FR-4.3 Quick Highlights**: Bullet-point summary of key hardware specs.
- **FR-4.4 Comprehensive Specification Table**: Detailed tabbed table for full technical specifications (e.g., Socket, Chipset, Core Count, VRAM, Interface, Form Factor, Warranty).
- **FR-4.5 Actions**: Quantity increment/decrement, "Add to Cart", "Buy Now", and "Add to Wishlist".
- **FR-4.6 Customer Reviews & Ratings**: Star rating summary breakdown, verified customer reviews list, and review submission form.
- **FR-4.7 Product Recommendations**: "Related Products" and "Frequently Bought Together" carousels.

---

### 2.5 Module 5: Cart & Wishlist Management
- **FR-5.1 Cart Drawer & Full Cart View**: Accessible from any page without losing browsing context.
- **FR-5.2 Cart Operations**: Update item quantities, remove items, clear cart, and calculate real-time subtotals, VAT/taxes, and estimated shipping fees.
- **FR-5.3 Coupon Code System**: Input field to apply discount promo codes with instant price deduction.
- **FR-5.4 Wishlist**: Save favorite products for later purchase with persistent storage.

---

### 2.6 Module 6: Checkout & Order Placement
- **FR-6.1 Multi-Step Checkout**:
  - **Step 1: Contact & Delivery Information**: Full name, mobile number, email, delivery address, division/district selection (Dhaka, Chittagong, Sylhet, Rajshahi, etc.).
  - **Step 2: Shipping Method**: Standard Delivery (Inside Dhaka / Outside Dhaka), Express Delivery, Showroom Pickup.
  - **Step 3: Payment Method**: Cash on Delivery (COD), Mobile Banking (bKash / Nagad simulation), Online Card/Net Banking.
- **FR-6.2 Order Summary & Confirmation**: Final order review before submission.
- **FR-6.3 Invoice & Tracking**: Generated unique Order ID, printable invoice receipt, and order tracking number.

---

### 2.7 Module 7: User Account & Authentication
- **FR-7.1 Authentication**: User Registration, Login with Email/Password, and secure Logout.
- **FR-7.2 Customer Profile**: Update contact details, manage saved delivery addresses, and change password.
- **FR-7.3 Order History**: View list of past orders with dates, total amounts, and statuses (*Pending, Processing, Shipped, Delivered, Cancelled*).
- **FR-7.4 Order Details & Tracking**: Detailed view of items purchased in a specific order with live fulfillment timeline.

---

### 2.8 Module 8: Admin Management Panel
- **FR-8.1 Dashboard Metrics**: Real-time summary cards displaying Total Sales (৳), Total Orders, Total Products, and Registered Customers.
- **FR-8.2 Product Management (CRUD)**:
  - Add new product (Title, Brand, Category, Price, Discount, Stock, SKU, Images, Specs, Warranty).
  - Edit existing product data and pricing.
  - Delete or mark product as inactive.
- **FR-8.3 Order Management**:
  - Master list of all customer orders with filtering by status.
  - View individual order details and customer shipping info.
  - Update order fulfillment status (*Pending ➔ Processing ➔ Shipped ➔ Delivered ➔ Cancelled*).
- **FR-8.4 Category & Brand Management**: Add/edit product categories and supported brands.

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Performance & Responsiveness
- **NFR-1 Page Load Time**: Initial load under 2.5 seconds; smooth client-side transitions.
- **NFR-2 Responsive Design**: Fully responsive layout adapted for Mobile, Tablet, Laptop, and Desktop viewports.

### 3.2 Security
- **NFR-3 Password Security**: Passwords encrypted using bcrypt/Argon2.
- **NFR-4 Data Validation**: Comprehensive client-side and server-side validation for form inputs.
- **NFR-5 Role-Based Access Control (RBAC)**: Strict segregation between Customer and Admin permissions.

### 3.3 Usability & Aesthetics
- **NFR-6 Clean & Modern UI**: Tech-themed design with professional typography, clear visual hierarchy, and intuitive micro-interactions.
- **NFR-7 Accessibility**: Semantic HTML, proper contrast ratios, and keyboard navigability.

---

## 4. Technical Architecture & Recommended Stack

- **Frontend**: Next.js (React 19 / App Router) OR React (Vite) with Tailwind CSS, Lucide Icons, Shadcn UI / Radix primitives.
- **Backend / API**: Next.js API Routes / Server Actions OR Node.js + Express.js REST API.
- **Database**: MongoDB (Mongoose) OR PostgreSQL / SQLite (Prisma ORM).
- **Authentication**: JWT-based auth or NextAuth.js.
- **State Management**: Zustand / React Context API for Cart, Wishlist, and Auth state.

---

## 5. Database Schema Design (Key Models)

1. **User**: `id`, `name`, `email`, `password_hash`, `role` (customer/admin), `phone`, `address`, `created_at`
2. **Product**: `id`, `title`, `slug`, `brand`, `category_id`, `price`, `discount_price`, `stock`, `sku`, `images[]`, `short_specs[]`, `technical_specs{}`, `rating`, `review_count`, `is_featured`, `created_at`
3. **Category**: `id`, `name`, `slug`, `icon`, `parent_id`
4. **Order**: `id`, `user_id`, `order_items[]`, `shipping_address{}`, `payment_method`, `payment_status`, `total_amount`, `shipping_fee`, `order_status`, `tracking_code`, `created_at`
5. **Review**: `id`, `product_id`, `user_name`, `rating`, `comment`, `created_at`

---

## 6. Deliverables for Internship Showcase

1. **Working Web Application**: Fully interactive storefront and admin management interface.
2. **Source Code**: Clean, well-structured repository with modular code organization.
3. **Documentation**:
   - Software Requirements Specification (`PROJECT_REQUIREMENTS.md`)
   - Setup & Installation Guide (`README.md`)
   - API / Architecture overview
4. **Demonstration Assets**: Seed data with genuine Orient Computers hardware products and test admin/customer credentials.