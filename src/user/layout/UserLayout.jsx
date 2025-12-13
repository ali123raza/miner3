import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Cpu,
    Wallet,
    ArrowDownToLine,
    History,
    User,
    LogOut,
    Bell,
    ChevronDown,
    MessageSquare,
    Check,
    Zap,
    Gift,
    AlertCircle,
    Users
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', shortLabel: 'Home' },
    { path: '/rigs', icon: Cpu, label: 'Mining Rigs', shortLabel: 'Rigs' },
    { path: '/deposit', icon: Wallet, label: 'Deposit', shortLabel: 'Deposit' },
    { path: '/withdraw', icon: ArrowDownToLine, label: 'Withdraw', shortLabel: 'Withdraw' },
    { path: '/transactions', icon: History, label: 'Transactions', shortLabel: 'History' },
    { path: '/referral', icon: Users, label: 'Referrals', shortLabel: 'Referral' },
    { path: '/support', icon: MessageSquare, label: 'Support', shortLabel: 'Support' },
    { path: '/profile', icon: User, label: 'Profile', shortLabel: 'Profile' },
]

// Bottom nav shows only 5 items for cleaner mobile UX
const bottomNavItems = [
    menuItems[0], // Dashboard
    menuItems[1], // Rigs
    menuItems[2], // Deposit
    menuItems[6], // Support
    menuItems[7], // Profile
]

const notificationIcons = {
    deposit: Wallet,
    withdrawal: ArrowDownToLine,
    earning: Zap,
    rig: Cpu,
    referral: Gift,
    system: AlertCircle,
    promo: Gift
}

export default function UserLayout({ children }) {
    const [profileOpen, setProfileOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            const res = await api.getNotifications()
            if (res.success && Array.isArray(res.data)) {
                setNotifications(res.data)
            } else {
                setNotifications([])
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
            setNotifications([])
        }
    }

    const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.is_read).length : 0

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const markAsRead = async (id) => {
        try {
            await api.markNotificationRead(id)
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    const markAllRead = async () => {
        try {
            await api.markAllNotificationsRead()
            setNotifications(notifications.map(n => ({ ...n, is_read: true })))
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error)
        }
    }

    const formatTime = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = now - date
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (hours < 1) return 'Just now'
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="min-h-screen bg-primary pb-20 lg:pb-0">
            {/* Desktop Sidebar - hidden on mobile */}
            <aside className="hidden lg:block fixed top-0 left-0 h-full w-72 bg-primary-light border-r border-glass-border z-50">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-glass-border">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                                <span className="text-xl font-bold">₿</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                                CryptoMine
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-glass-border">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-card-hover">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-white font-medium">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">{user?.name || 'User'}</div>
                                <div className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-3 flex items-center gap-3 px-4 py-3 text-gray-400 rounded-xl hover:bg-accent-red/10 hover:text-accent-red transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-72">
                {/* Top navbar */}
                <header className="sticky top-0 z-30 bg-primary/80 backdrop-blur-xl border-b border-glass-border">
                    <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                        {/* Mobile logo */}
                        <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                                <span className="text-sm font-bold">₿</span>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                                CryptoMine
                            </span>
                        </Link>

                        <div className="hidden lg:block">
                            <h1 className="text-lg font-semibold text-white">
                                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="relative p-2 rounded-lg text-gray-400 hover:bg-card-hover hover:text-white"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0 right-0 w-5 h-5 bg-accent-red rounded-full text-xs flex items-center justify-center text-white font-medium">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card py-2 z-50 max-h-[70vh] overflow-hidden flex flex-col">
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
                                                <h3 className="text-white font-semibold">Notifications</h3>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={markAllRead}
                                                        className="text-xs text-accent-cyan hover:underline"
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                            </div>
                                            <div className="overflow-y-auto flex-1">
                                                {notifications.length === 0 ? (
                                                    <div className="p-4 text-center text-gray-400">
                                                        No notifications
                                                    </div>
                                                ) : (
                                                    notifications.slice(0, 10).map((notif) => {
                                                        const Icon = notificationIcons[notif.type] || Bell
                                                        return (
                                                            <div
                                                                key={notif.id}
                                                                onClick={() => markAsRead(notif.id)}
                                                                className={`px-4 py-3 hover:bg-card-hover cursor-pointer transition-colors ${!notif.isRead ? 'bg-accent-cyan/5' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex gap-3">
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'deposit' ? 'bg-accent-green/20 text-accent-green' :
                                                                        notif.type === 'earning' ? 'bg-accent-cyan/20 text-accent-cyan' :
                                                                            notif.type === 'withdrawal' ? 'bg-accent-yellow/20 text-accent-yellow' :
                                                                                'bg-accent-purple/20 text-accent-purple'
                                                                        }`}>
                                                                        <Icon className="w-5 h-5" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <p className={`text-sm font-medium ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                                                                                {notif.title}
                                                                            </p>
                                                                            {!notif.isRead && (
                                                                                <span className="w-2 h-2 rounded-full bg-accent-cyan flex-shrink-0 mt-1.5"></span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-400 mt-0.5 truncate">{notif.message}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">{formatTime(notif.createdAt)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Profile dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-card-hover"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-white text-sm font-medium">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <ChevronDown className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 glass-card py-2 z-50">
                                            <div className="px-4 py-3 border-b border-glass-border">
                                                <div className="text-sm font-medium text-white">{user?.name}</div>
                                                <div className="text-xs text-gray-400">{user?.email}</div>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-card-hover hover:text-white"
                                            >
                                                <User className="w-4 h-4" />
                                                <span>Profile Settings</span>
                                            </Link>
                                            <Link
                                                to="/support"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-card-hover hover:text-white"
                                            >
                                                <MessageSquare className="w-4 h-4" />
                                                <span>Support</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-accent-red/10 hover:text-accent-red"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-primary-light/95 backdrop-blur-xl border-t border-glass-border">
                <div className="flex items-center justify-around h-16 px-2">
                    {bottomNavItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all ${isActive
                                    ? 'text-accent-cyan'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                                    <item.icon className="w-5 h-5" />
                                    {isActive && (
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent-cyan"></div>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium">{item.shortLabel}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}
