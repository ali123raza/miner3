import { useState, useEffect } from 'react'
import {
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Clock,
    Download,
    RefreshCw
} from 'lucide-react'
import api from '../../services/api'

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [stats, setStats] = useState({ totalDeposits: 0, totalWithdrawals: 0, totalEarnings: 0 })

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await api.getTransactions()
            if (res.success && Array.isArray(res.data)) {
                setTransactions(res.data)

                // Calculate stats
                const deposits = res.data.filter(t => t.type === 'deposit' && t.status === 'completed')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                const withdrawals = res.data.filter(t => t.type === 'withdrawal' && t.status === 'completed')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                const earnings = res.data.filter(t => t.type === 'earning')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

                setStats({ totalDeposits: deposits, totalWithdrawals: withdrawals, totalEarnings: earnings })
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error)
        } finally {
            setLoading(false)
        }
    }

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'deposit', label: 'Deposits' },
        { id: 'withdrawal', label: 'Withdrawals' },
        { id: 'earning', label: 'Earnings' },
    ]

    const filteredTransactions = transactions.filter(tx => {
        if (filter !== 'all' && tx.type !== filter) return false
        if (searchQuery && !tx.type.includes(searchQuery.toLowerCase())) return false
        return true
    })

    const getTypeIcon = (type) => {
        switch (type) {
            case 'deposit':
            case 'earning':
            case 'referral':
                return <ArrowDownRight className="w-5 h-5" />
            default:
                return <ArrowUpRight className="w-5 h-5" />
        }
    }

    const getTypeColor = (type) => {
        switch (type) {
            case 'deposit':
                return 'bg-accent-green/20 text-accent-green'
            case 'withdrawal':
                return 'bg-accent-red/20 text-accent-red'
            case 'earning':
                return 'bg-accent-cyan/20 text-accent-cyan'
            case 'investment':
                return 'bg-accent-purple/20 text-accent-purple'
            case 'referral':
                return 'bg-accent-yellow/20 text-accent-yellow'
            default:
                return 'bg-gray-500/20 text-gray-400'
        }
    }

    const getAmountColor = (type) => {
        return type === 'withdrawal' || type === 'investment' ? 'text-accent-red' : 'text-accent-green'
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return 'badge-success'
            case 'pending':
                return 'badge-warning'
            case 'active':
                return 'badge-info'
            case 'failed':
            case 'rejected':
                return 'badge-danger'
            default:
                return 'badge'
        }
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
            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Transactions</h1>
                        <p className="text-gray-400">View your complete transaction history</p>
                    </div>
                    <button onClick={fetchTransactions} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                            <ArrowDownRight className="w-5 h-5 text-accent-green" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Total Deposits</div>
                            <div className="text-xl font-bold text-accent-green">${stats.totalDeposits.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-red/20 flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-accent-red" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Total Withdrawals</div>
                            <div className="text-xl font-bold text-accent-red">${stats.totalWithdrawals.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                            <ArrowDownRight className="w-5 h-5 text-accent-cyan" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Total Earnings</div>
                            <div className="text-xl font-bold text-accent-cyan">${stats.totalEarnings.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === tab.id
                                    ? 'bg-accent-cyan text-white'
                                    : 'bg-card-hover text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1 flex gap-4">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search transactions..."
                                className="w-full pl-10 pr-4 py-2 bg-primary-light border border-glass-border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-cyan text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-glass-border">
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Details</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="table-row">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(tx.type)}`}>
                                                    {getTypeIcon(tx.type)}
                                                </div>
                                                <span className="capitalize text-white font-medium">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${getAmountColor(tx.type)}`}>
                                                {tx.type === 'withdrawal' || tx.type === 'investment' ? '-' : '+'}
                                                ${parseFloat(tx.amount).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {tx.description || tx.method || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${getStatusBadge(tx.status)}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
