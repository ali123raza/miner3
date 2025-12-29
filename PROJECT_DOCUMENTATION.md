# Project Documentation: Crypto Mining & Investment Platform

This document provides a comprehensive overview of the project structure, technologies, and core modules to help new developers get started quickly.

## 🚀 Overview
The **Crypto Mining Platform** is a full-stack web application that allows users to invest in virtual mining rigs, earn passive income, and manage their portfolio. It includes a robust multi-level referral system, secure payment processing, and an integrated CMS for site management.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS (Custom Design System)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Routing**: React Router DOM

### Backend (API)
- **Language**: PHP (7.4+)
- **Architecture**: Custom MVC API (Model-View-Controller)
- **Database**: MySQL / MariaDB (managed via PDO)
- **Real-time**: SSE (Server-Sent Events) for notifications

---

## 📁 Project Structure

```bash
/
├── api/                    # PHP Backend (API)
│   ├── config/             # Database & System settings
│   ├── controllers/        # Logical controllers (MVC)
│   ├── middleware/         # Auth & CORS middleware
│   ├── models/             # Database interaction (PDO)
│   ├── migrations/         # SQL schema files
│   ├── seed/               # Initial database content
│   ├── uploads/            # User uploads (KYC, Proofs, Avatars)
│   └── index.php           # API Entry point & Routing
├── src/                    # React Frontend
│   ├── admin/              # Admin Panel Components & Pages
│   │   ├── layout/         # Admin-specific layouts
│   │   └── pages/          # Admin management views
│   ├── auth/               # Authentication views (Login, Register)
│   ├── components/         # Shared UI components
│   ├── context/            # React Contexts (Auth, Settings, Theme)
│   ├── services/           # API communication (api.js)
│   ├── user/               # User Panel Components & Pages
│   │   ├── layout/         # User Dashboard layouts
│   │   └── pages/          # User-specific views
│   ├── App.jsx             # Main App & Router
│   └── index.css           # Global styles & Tailwind entry
├── public/                 # Static assets
└── install/                # Installation Wizard / Setup
```

---

## 🔑 Core Modules

### 1. Authentication & Security
- **JWT-based Auth**: Secure token-based communication.
- **2FA**: Google Authenticator (TOTP) support.
- **Roles**: Distinct permissions for `User` and `Admin`.
- **Impersonation**: Admin can view the dashboard exactly like any user for support.

### 2. Mining & Investment logic
- **Rig Plans**: Admins can create mining plans with different ROI, duration, and prices.
- **Live Mining**: Real-time visualization of earnings.
- **Collection**: Users manually or automatically collect mining profits to their wallet.

### 3. Referral System
- **Multi-level**: Support for multiple generations of referral commissions.
- **Verification**: Optional mandatory referral codes during signup.
- **Stats**: Detailed tree view of the user's network.

### 4. Financial Transactions
- **Deposits**: Crypto/Manual payment methods with screenshot verification.
- **Withdrawals**: Secure withdrawal requests with user wallet management.
- **KYC**: Multi-step identity verification system required for withdrawals.

### 5. Content Management (CMS)
- **Page Manager**: Create and edit custom static pages (About, Terms, etc.).
- **Dynamic Homepage**: Configure hero texts, features, and site settings directly from the Admin Panel.
- **Announcements**: Global site-wide banners and popups for users.

---

## 🛠 Getting Started

### Backend Setup
1. Point your web server (Apache/Nginx) to the root directory.
2. Configure `.env` inside the `api` folder with your database credentials.
3. Import the SQL files from `api/migrations`.

### Frontend Setup
1. Navigate to the project root.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Update `src/config/env.js` (if applicable) to point to your backend API URL.

---

## 💡 Development Guidelines
- **Responsive Design**: Always test UI changes on mobile view (Responsive mode).
- **Z-Index**: Use `z-index` carefully; standard layers are 10-50, dropdowns/modals should be 100+.
- **API Calls**: All frontend communication must go through `src/services/api.js`.
- **Theming**: The app supports Dark/Light modes; use CSS variables or Tailwind's `dark:` classes.

---
© 2025 CryptoMiner Development Team.
