import { Routes, Route, Navigate } from 'react-router-dom'

// Auth Pages
import LandingPage from './auth/LandingPage'
import UserLogin from './auth/UserLogin'
import UserRegister from './auth/UserRegister'
import ForgotPassword from './auth/ForgotPassword'
import AdminLogin from './auth/AdminLogin'

// User Pages
import UserLayout from './user/layout/UserLayout'
import UserDashboard from './user/pages/Dashboard'
import Rigs from './user/pages/Plans'
import Deposit from './user/pages/Deposit'
import Withdraw from './user/pages/Withdraw'
import Transactions from './user/pages/Transactions'
import Profile from './user/pages/Profile'
import Support from './user/pages/Support'
import Referral from './user/pages/Referral'

// Admin Pages
import AdminLayout from './admin/layout/AdminLayout'
import AdminDashboard from './admin/pages/Dashboard'
import Users from './admin/pages/Users'
import AdminRigs from './admin/pages/Plans'
import PaymentMethods from './admin/pages/PaymentMethods'
import Deposits from './admin/pages/Deposits'
import Withdrawals from './admin/pages/Withdrawals'
import AdminTransactions from './admin/pages/Transactions'
import AdminTickets from './admin/pages/Tickets'
import MiningControls from './admin/pages/MiningControls'
import Settings from './admin/pages/Settings'
import Roles from './admin/pages/Roles'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'

// Route Guards
const UserGuard = ({ children }) => {
    const { user, isAuthenticated } = useAuth()
    if (!isAuthenticated || user?.role === 'admin') {
        return <Navigate to="/login" replace />
    }
    return children
}

const AdminGuard = ({ children }) => {
    const { user, isAuthenticated } = useAuth()
    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/admin/login" replace />
    }
    return children
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* User Routes */}
                <Route path="/dashboard" element={<UserGuard><UserLayout><UserDashboard /></UserLayout></UserGuard>} />
                <Route path="/rigs" element={<UserGuard><UserLayout><Rigs /></UserLayout></UserGuard>} />
                <Route path="/deposit" element={<UserGuard><UserLayout><Deposit /></UserLayout></UserGuard>} />
                <Route path="/withdraw" element={<UserGuard><UserLayout><Withdraw /></UserLayout></UserGuard>} />
                <Route path="/transactions" element={<UserGuard><UserLayout><Transactions /></UserLayout></UserGuard>} />
                <Route path="/profile" element={<UserGuard><UserLayout><Profile /></UserLayout></UserGuard>} />
                <Route path="/support" element={<UserGuard><UserLayout><Support /></UserLayout></UserGuard>} />
                <Route path="/referral" element={<UserGuard><UserLayout><Referral /></UserLayout></UserGuard>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
                <Route path="/admin/users" element={<AdminGuard><AdminLayout><Users /></AdminLayout></AdminGuard>} />
                <Route path="/admin/rigs" element={<AdminGuard><AdminLayout><AdminRigs /></AdminLayout></AdminGuard>} />
                <Route path="/admin/payment-methods" element={<AdminGuard><AdminLayout><PaymentMethods /></AdminLayout></AdminGuard>} />
                <Route path="/admin/deposits" element={<AdminGuard><AdminLayout><Deposits /></AdminLayout></AdminGuard>} />
                <Route path="/admin/withdrawals" element={<AdminGuard><AdminLayout><Withdrawals /></AdminLayout></AdminGuard>} />
                <Route path="/admin/transactions" element={<AdminGuard><AdminLayout><AdminTransactions /></AdminLayout></AdminGuard>} />
                <Route path="/admin/tickets" element={<AdminGuard><AdminLayout><AdminTickets /></AdminLayout></AdminGuard>} />
                <Route path="/admin/mining" element={<AdminGuard><AdminLayout><MiningControls /></AdminLayout></AdminGuard>} />
                <Route path="/admin/settings" element={<AdminGuard><AdminLayout><Settings /></AdminLayout></AdminGuard>} />
                <Route path="/admin/roles" element={<AdminGuard><AdminLayout><Roles /></AdminLayout></AdminGuard>} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    )
}

export default App
