import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    Cpu,
    Wallet,
    ArrowDownToLine,
    History,
    Settings,
    Shield,
    Zap,
    LogOut,
    Menu,
    X,
    Bell,
    ChevronDown,
    Search,
    CreditCard,
    MessageSquare,
    UserPlus,
    AlertTriangle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { adminNotifications } from '../../data/mockData'

const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/rigs', icon: Cpu, label: 'Mining Rigs' },
    { path: '/admin/payment-methods', icon: CreditCard, label: 'Payment Methods' },
    { path: '/admin/deposits', icon: Wallet, label: 'Deposits' },
    { path: '/admin/withdrawals', icon: ArrowDownToLine, label: 'Withdrawals' },
    { path: '/admin/transactions', icon: History, label: 'Transactions' },
    { path: '/admin/tickets', icon: MessageSquare, label: 'Support Tickets' },
    { path: '/admin/mining', icon: Zap, label: 'Mining Controls' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/roles', icon: Shield, label: 'Admin Roles' },
]

const notificationIcons = {
    deposit: Wallet,
    withdrawal: ArrowDownToLine,
    ticket: MessageSquare,
    user: UserPlus,
    system: AlertTriangle
}

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [notifications, setNotifications] = useState(adminNotifications)
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const unreadCount = notifications.filter(n => !n.isRead).length

    const handleLogout = () => {
        logout()
        navigate('/admin/login')
    }

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
    }

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })))
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
        <div className="min-h-screen bg-primary">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Purple themed for admin */}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-primary-light border-r border-accent-purple/20 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-accent-purple/20">
                        <Link to="/admin/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                                    CryptoMine
                                </span>
                                <span className="block text-xs text-accent-purple">Admin Panel</span>
                            </div>
                        </Link>
                    </div>

                    {/* Close button for mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:bg-card-hover"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 text-accent-purple border border-accent-purple/30'
                                        : 'text-gray-400 hover:bg-card-hover hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Admin info */}
                    <div className="p-4 border-t border-accent-purple/20">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-accent-purple/10 to-accent-pink/10">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-medium">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</div>
                                <div className="text-xs text-accent-purple truncate capitalize">{user?.adminRole?.replace('_', ' ') || 'Super Admin'}</div>
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
                <header className="sticky top-0 z-30 bg-primary/80 backdrop-blur-xl border-b border-accent-purple/20">
                    <div className="flex items-center justify-between px-4 lg:px-8 h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-card-hover hover:text-white"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <div className="hidden lg:block">
                                <h1 className="text-lg font-semibold text-white">
                                    {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                                </h1>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="hidden md:block flex-1 max-w-md mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search users, transactions..."
                                    className="w-full pl-10 pr-4 py-2 bg-primary-light border border-glass-border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-purple text-sm"
                                />
                            </div>
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
                                        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card py-2 z-50 max-h-[70vh] overflow-hidden flex flex-col border-accent-purple/20">
                                            <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
                                                <h3 className="text-white font-semibold">Notifications</h3>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={markAllRead}
                                                        className="text-xs text-accent-purple hover:underline"
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
                                                    notifications.map((notif) => {
                                                        const Icon = notificationIcons[notif.type] || Bell
                                                        return (
                                                            <div
                                                                key={notif.id}
                                                                onClick={() => markAsRead(notif.id)}
                                                                className={`px-4 py-3 hover:bg-card-hover cursor-pointer transition-colors ${!notif.isRead ? 'bg-accent-purple/5' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex gap-3">
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'deposit' ? 'bg-accent-green/20 text-accent-green' :
                                                                            notif.type === 'withdrawal' ? 'bg-accent-yellow/20 text-accent-yellow' :
                                                                                notif.type === 'ticket' ? 'bg-accent-cyan/20 text-accent-cyan' :
                                                                                    notif.type === 'user' ? 'bg-accent-purple/20 text-accent-purple' :
                                                                                        'bg-accent-red/20 text-accent-red'
                                                                        }`}>
                                                                        <Icon className="w-5 h-5" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <p className={`text-sm font-medium ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>
                                                                                {notif.title}
                                                                            </p>
                                                                            {!notif.isRead && (
                                                                                <span className="w-2 h-2 rounded-full bg-accent-purple flex-shrink-0 mt-1.5"></span>
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
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-card-hover"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-sm font-medium">
                                        {user?.name?.charAt(0) || 'A'}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {profileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 glass-card py-2 z-50 border-accent-purple/20">
                                            <div className="px-4 py-3 border-b border-glass-border">
                                                <div className="text-sm font-medium text-white">{user?.name}</div>
                                                <div className="text-xs text-accent-purple capitalize">{user?.adminRole?.replace('_', ' ')}</div>
                                            </div>
                                            <Link
                                                to="/admin/settings"
                                                onClick={() => setProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-card-hover hover:text-white"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Settings</span>
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
        </div>
    )
}
