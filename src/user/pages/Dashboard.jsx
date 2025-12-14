import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Wallet,
    Cpu,
    ArrowDownToLine,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    RefreshCw
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import MiningVisualizer from '../components/MiningVisualizer'

export default function Dashboard() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        balance: 0,
        activeRigs: 0,
        totalHashRate: 0,
        hashUnit: 'MH/s',
        totalEarnings: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        pendingWithdrawals: 0,
        dailyEarnings: 0
    })
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const [dashboardRes, transactionsRes] = await Promise.all([
                api.getDashboard(),
                api.getTransactions()
            ])

            if (dashboardRes.success && dashboardRes.data) {
                setStats({
                    balance: parseFloat(dashboardRes.data.balance || 0),
                    activeRigs: dashboardRes.data.active_rigs || 0,
                    totalHashRate: dashboardRes.data.total_hash_rate || 0,
                    hashUnit: 'MH/s',
                    totalEarnings: parseFloat(dashboardRes.data.total_earnings || 0),
                    totalDeposits: parseFloat(dashboardRes.data.total_deposits || 0),
                    totalWithdrawals: parseFloat(dashboardRes.data.total_withdrawals || 0),
                    pendingWithdrawals: parseFloat(dashboardRes.data.pending_withdrawals || 0),
                    dailyEarnings: parseFloat(dashboardRes.data.daily_earnings || 0)
                })
            }

            if (transactionsRes.success && transactionsRes.data) {
                setTransactions(transactionsRes.data.slice(0, 5))
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Wallet Balance',
            value: `$${stats.balance.toLocaleString()}`,
            icon: Wallet,
            color: 'cyan'
        },
        {
            title: 'Active Rigs',
            value: stats.activeRigs,
            subtext: `${stats.totalHashRate} ${stats.hashUnit} total`,
            icon: Cpu,
            color: 'purple'
        },
        {
            title: 'Total Earnings',
            value: `$${stats.totalEarnings.toLocaleString()}`,
            icon: ArrowDownToLine,
            color: 'green'
        },
        {
            title: 'Mining Power',
            value: `${stats.totalHashRate} ${stats.hashUnit}`,
            subtext: 'Active mining',
            icon: Zap,
            color: 'yellow'
        }
    ]

    const colorMap = {
        cyan: 'from-accent-cyan to-blue-500',
        purple: 'from-accent-purple to-pink-500',
        green: 'from-accent-green to-emerald-500',
        yellow: 'from-accent-yellow to-orange-500'
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
            {/* Welcome section */}
            <div className="glass-card p-6 bg-gradient-mesh">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1">
                            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                        </h1>
                        <p className="text-gray-400">
                            Your mining rigs are running efficiently. Here's your portfolio overview.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/deposit" className="btn-primary">
                            Deposit Funds
                        </Link>
                        <Link to="/rigs" className="btn-secondary">
                            View Rigs
                        </Link>
                    </div>
                </div>
            </div>

            {/* Live Mining Visualizer */}
            <MiningVisualizer
                hashRate={stats.totalHashRate}
                dailyEarnings={stats.dailyEarnings}
                onRewardCollected={(data) => {
                    setStats(prev => ({
                        ...prev,
                        balance: data.new_balance,
                        totalEarnings: data.total_earnings
                    }))
                }}
            />

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="glass-card-hover p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[stat.color]} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.title}</div>
                        {stat.subtext && (
                            <div className="text-xs text-gray-500 mt-1">{stat.subtext}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-6">
                    <div className="text-gray-400 text-sm mb-2">Total Deposits</div>
                    <div className="text-2xl font-bold text-accent-green">
                        ${stats.totalDeposits.toLocaleString()}
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="text-gray-400 text-sm mb-2">Total Withdrawals</div>
                    <div className="text-2xl font-bold text-accent-red">
                        ${stats.totalWithdrawals.toLocaleString()}
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="text-gray-400 text-sm mb-2">Pending Withdrawals</div>
                    <div className="text-2xl font-bold text-accent-yellow">
                        ${stats.pendingWithdrawals.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                    <Link to="/transactions" className="text-accent-cyan hover:underline text-sm">
                        View All
                    </Link>
                </div>

                {transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        No transactions yet
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((tx, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-accent-green/20 text-accent-green' :
                                        tx.type === 'withdrawal' ? 'bg-accent-red/20 text-accent-red' :
                                            'bg-accent-cyan/20 text-accent-cyan'
                                        }`}>
                                        {tx.type === 'deposit' ? <ArrowDownToLine className="w-5 h-5" /> :
                                            tx.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5" /> :
                                                <Zap className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white capitalize">{tx.type}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`font-bold ${tx.type === 'deposit' || tx.type === 'earning' ? 'text-accent-green' : 'text-accent-red'
                                        }`}>
                                        {tx.type === 'deposit' || tx.type === 'earning' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                    </div>
                                    <div className={`text-xs capitalize ${tx.status === 'completed' ? 'text-accent-green' :
                                        tx.status === 'pending' ? 'text-accent-yellow' : 'text-accent-red'
                                        }`}>
                                        {tx.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
