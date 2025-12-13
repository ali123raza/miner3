# Web Design Document (WDD)
## Crypto Mining & Investment Web Application

---

## 1. Document Overview

**Project Name:** Crypto Mining & Investment Web Application  
**Document Type:** Web Design Document (WDD)  
**Frontend Technology:** React.js (Vite)  
**Styling:** Tailwind CSS  
**Design Focus:** UI/UX First (No Backend Integration in this Phase)

This document defines the **frontend design, structure, routing, UI components, and admin/user separation** for the Crypto Mining & Investment Web Application.

---

## 2. Project Goals

- Create a **professional, trust-based crypto investment UI**
- Separate **User Panel** and **Admin Panel** completely
- Implement **independent authentication flows**
- Ensure scalability for future Node.js backend integration
- Maintain CodeCanyon / SaaS-quality frontend architecture

---

## 3. Target Users

### 3.1 End Users (Investors)
- Crypto investors
- Mining plan subscribers
- Users tracking ROI and earnings

### 3.2 Administrators
- Super Admin
- Finance Admin
- Support Admin

---

## 4. Design Principles

- Dark fintech theme
- Glassmorphism cards
- Minimal clutter
- High readability
- Responsive (Desktop & Mobile)
- Dashboard-first layout

---

## 5. Technology Stack

### 5.1 Frontend
- React 18+
- Vite
- Tailwind CSS
- React Router v6
- Chart.js / Recharts
- Lucide / Heroicons

### 5.2 Data Handling
- Mock JSON data
- No API calls in Phase 1

---

## 6. Application Architecture

### 6.1 High-Level Structure

- Public Area (Landing Page)
- User Panel (Authenticated)
- Admin Panel (Authenticated & Isolated)

---

## 7. Routing Structure

### 7.1 Public Routes
```
/              → Landing Page
/login         → User Login
/register      → User Register
/forgot-password → User Password Recovery
```

### 7.2 User Routes
```
/dashboard
/plans
/deposit
/withdraw
/transactions
/profile
```

### 7.3 Admin Routes (Isolated)
```
/admin/login
/admin/dashboard
/admin/users
/admin/plans
/admin/deposits
/admin/withdrawals
/admin/transactions
/admin/settings
/admin/roles
```

---

## 8. User Panel Design

### 8.1 User Dashboard
- Wallet balance card
- Active investment summary
- Daily / Monthly earnings
- ROI chart
- Mining progress indicator

### 8.2 Investment Plans
- Plan cards
- ROI percentage
- Duration
- Invest button (UI only)

### 8.3 Deposit Page
- Payment method selection (UI)
- Amount input
- Upload proof field

### 8.4 Withdraw Page
- Available balance
- Wallet input
- Withdrawal limits info

### 8.5 Transactions
- Deposit history
- Earnings history
- Withdrawal history

### 8.6 Profile & Settings
- User information
- Password change
- Wallet addresses

---

## 9. Admin Panel Design

### 9.1 Admin Authentication
- Completely separate from user auth
- Independent login & session handling

### 9.2 Admin Dashboard
- Total users
- Total investments
- Total earnings
- Total withdrawals
- Growth analytics charts

### 9.3 User Management
- User list table
- View user details
- Block / unblock user
- Manual balance adjustment (UI)

### 9.4 Investment Plan Management
- Create plan
- Edit plan
- Enable / disable plan
- ROI & duration settings

### 9.5 Deposit Management
- Pending deposits
- Proof preview
- Approve / reject actions

### 9.6 Withdrawal Management
- Pending withdrawal requests
- Approve / reject
- Status indicators

### 9.7 Transactions Control
- All system transactions
- Filter by date, user, type, status

### 9.8 Mining & ROI Controls
- Global ROI settings
- Mining pause / resume toggle
- Earnings cap display

### 9.9 System Settings
- App name & logo
- Minimum deposit
- Minimum withdrawal
- Maintenance mode toggle

### 9.10 Admin Roles
- Super Admin
- Finance Admin
- Support Admin
- Role-based UI visibility

---

## 10. Folder Structure

```
src/
 ├─ user/
 │   ├─ pages/
 │   ├─ components/
 │   ├─ routes/UserRoutes.jsx
 │   └─ layout/UserLayout.jsx
 │
 ├─ admin/
 │   ├─ pages/
 │   ├─ components/
 │   ├─ routes/AdminRoutes.jsx
 │   └─ layout/AdminLayout.jsx
 │
 ├─ auth/
 │   ├─ UserAuth.jsx
 │   └─ AdminAuth.jsx
 │
 ├─ data/
 │   └─ mockData.js
 │
 ├─ App.jsx
 └─ main.jsx
```

---

## 11. Security & Access Rules (Frontend)

- Users cannot access admin routes
- Admin routes require admin auth state
- Separate layouts & sidebars
- Route guards implemented via React Router

---

## 12. Future Scope

- Node.js backend integration
- Real authentication & JWT
- Payment gateway APIs
- Cron-based mining logic
- Admin audit logs

---

## 13. Conclusion

This WDD defines a **clean, scalable, and professional frontend architecture** suitable for a crypto mining & investment platform. The design ensures **clear separation of concerns**, high usability, and readiness for enterprise-level backend integration.

---

**End of Document**