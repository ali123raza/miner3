import { useState, useEffect } from 'react'
import {
    Users,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    AlertCircle,
    CheckCircle,
    RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        pendingDeposits: 0,
        pendingWithdrawals: 0
    })
    const [pendingDeposits, setPendingDeposits] = useState([])
    const [pendingWithdrawals, setPendingWithdrawals] = useState([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const [dashRes, depositsRes, withdrawalsRes] = await Promise.all([
                api.adminGetDashboard(),
                api.adminGetDeposits(),
                api.adminGetWithdrawals()
            ])

            if (dashRes.success && dashRes.data) {
                setStats({
                    totalUsers: dashRes.data.total_users || 0,
                    totalDeposits: parseFloat(dashRes.data.total_deposits || 0),
                    totalWithdrawals: parseFloat(dashRes.data.total_withdrawals || 0),
                    pendingDeposits: dashRes.data.pending_deposits || 0,
                    pendingWithdrawals: dashRes.data.pending_withdrawals || 0
                })
            }

            if (depositsRes.success && Array.isArray(depositsRes.data)) {
                setPendingDeposits(depositsRes.data.filter(d => d.status === 'pending').slice(0, 5))
            }

            if (withdrawalsRes.success && Array.isArray(withdrawalsRes.data)) {
                setPendingWithdrawals(withdrawalsRes.data.filter(w => w.status === 'pending').slice(0, 5))
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'purple'
        },
        {
            title: 'Total Deposits',
            value: `$${stats.totalDeposits.toLocaleString()}`,
            icon: DollarSign,
            color: 'green'
        },
        {
            title: 'Total Withdrawals',
            value: `$${stats.totalWithdrawals.toLocaleString()}`,
            icon: TrendingUp,
            color: 'cyan'
        },
        {
            title: 'Pending Actions',
            value: stats.pendingDeposits + stats.pendingWithdrawals,
            subtext: `${stats.pendingDeposits} deposits, ${stats.pendingWithdrawals} withdrawals`,
            icon: Clock,
            color: 'orange'
        }
    ]

    const colorMap = {
        purple: 'from-accent-purple to-pink-500',
        green: 'from-accent-green to-emerald-500',
        cyan: 'from-accent-cyan to-blue-500',
        orange: 'from-accent-orange to-yellow-500'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-card p-6 bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border-accent-purple/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
                        <p className="text-gray-400">Welcome back! Here's what's happening with your platform.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchDashboardData} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <div className="px-4 py-2 rounded-xl bg-accent-green/10 border border-accent-green/30">
                            <span className="text-accent-green text-sm font-medium">🟢 System Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="glass-card-hover p-6 border-accent-purple/10">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400">
                            {stat.title}
                            {stat.subtext && <span className="block text-xs mt-1 text-accent-orange">{stat.subtext}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending actions */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Deposits */}
                <div className="glass-card p-6 border-accent-purple/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-accent-orange" />
                            Pending Deposits
                        </h2>
                        <Link to="/admin/deposits" className="text-accent-cyan text-sm hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {pendingDeposits.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-accent-green" />
                                No pending deposits
                            </div>
                        ) : (
                            pendingDeposits.map((deposit) => (
                                <div key={deposit.id} className="flex items-center justify-between p-4 rounded-xl bg-card-hover">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-accent-green/20 flex items-center justify-center text-accent-green font-medium">
                                            {(deposit.user_name || deposit.userName || 'U').charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{deposit.user_name || deposit.userName || 'Unknown'}</div>
                                            <div className="text-sm text-gray-400">{deposit.method_name || deposit.method || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-accent-green font-bold">${parseFloat(deposit.amount).toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">{new Date(deposit.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pending Withdrawals */}
                <div className="glass-card p-6 border-accent-purple/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-accent-orange" />
                            Pending Withdrawals
                        </h2>
                        <Link to="/admin/withdrawals" className="text-accent-cyan text-sm hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {pendingWithdrawals.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-accent-green" />
                                No pending withdrawals
                            </div>
                        ) : (
                            pendingWithdrawals.map((withdrawal) => (
                                <div key={withdrawal.id} className="flex items-center justify-between p-4 rounded-xl bg-card-hover">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-accent-red/20 flex items-center justify-center text-accent-red font-medium">
                                            {(withdrawal.user_name || withdrawal.userName || 'U').charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{withdrawal.user_name || withdrawal.userName || 'Unknown'}</div>
                                            <div className="text-sm text-gray-400">{withdrawal.method_name || withdrawal.method || 'N/A'}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-accent-red font-bold">${parseFloat(withdrawal.amount).toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">{new Date(withdrawal.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Platform Balance</div>
                    <div className="text-2xl font-bold text-white">
                        ${(stats.totalDeposits - stats.totalWithdrawals).toLocaleString()}
                    </div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Pending Deposits</div>
                    <div className="text-2xl font-bold text-accent-yellow">{stats.pendingDeposits}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Pending Withdrawals</div>
                    <div className="text-2xl font-bold text-accent-yellow">{stats.pendingWithdrawals}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Total Users</div>
                    <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                </div>
            </div>
        </div>
    )
}
