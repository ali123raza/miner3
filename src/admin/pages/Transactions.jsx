import { useState, useEffect } from 'react'
import { Search, Download, ArrowUpRight, ArrowDownRight, Clock, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await api.adminGetTransactions()
            if (res.success && Array.isArray(res.data)) {
                setTransactions(res.data)
            } else {
                setTransactions([])
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error)
            setTransactions([])
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
            default:
                return 'bg-gray-500/20 text-gray-400'
        }
    }

    const stats = {
        total: transactions.length,
        deposits: transactions.filter(t => t.type === 'deposit').length,
        withdrawals: transactions.filter(t => t.type === 'withdrawal').length,
        volume: transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
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
            <div className="glass-card p-6 border-accent-purple/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">All Transactions</h1>
                        <p className="text-gray-400">Complete system transaction history</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchTransactions} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4">
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Total Transactions</div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Deposits</div>
                    <div className="text-2xl font-bold text-accent-green">{stats.deposits}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Withdrawals</div>
                    <div className="text-2xl font-bold text-accent-red">{stats.withdrawals}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Total Volume</div>
                    <div className="text-2xl font-bold text-accent-purple">${stats.volume.toLocaleString()}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 border-accent-purple/10">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === tab.id ? 'bg-accent-purple text-white' : 'bg-card-hover text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 flex gap-4">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 bg-primary-light border border-glass-border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-purple text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden border-accent-purple/10">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No transactions found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm border-b border-glass-border">
                                    <th className="px-6 py-4 font-medium">#</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Details</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="table-row">
                                        <td className="px-6 py-4 text-gray-400">#{tx.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(tx.type)}`}>
                                                    {getTypeIcon(tx.type)}
                                                </div>
                                                <span className="capitalize text-white font-medium">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {tx.user_name || `User #${tx.user_id}`}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${tx.type === 'withdrawal' || tx.type === 'investment' ? 'text-accent-red' : 'text-accent-green'
                                                }`}>
                                                {tx.type === 'withdrawal' || tx.type === 'investment' ? '-' : '+'}${parseFloat(tx.amount).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {tx.description || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${tx.status === 'completed' ? 'badge-success' :
                                                tx.status === 'pending' ? 'badge-warning' :
                                                    tx.status === 'active' ? 'badge-info' :
                                                        'badge-danger'
                                                }`}>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
