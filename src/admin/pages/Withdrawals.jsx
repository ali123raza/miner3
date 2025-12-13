import { useState, useEffect } from 'react'
import { Check, X, Copy, ExternalLink, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function Withdrawals() {
    const [withdrawals, setWithdrawals] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [copied, setCopied] = useState(null)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        fetchWithdrawals()
    }, [])

    const fetchWithdrawals = async () => {
        setLoading(true)
        try {
            const res = await api.adminGetWithdrawals()
            if (res.success && Array.isArray(res.data)) {
                setWithdrawals(res.data)
            } else {
                setWithdrawals([])
            }
        } catch (error) {
            console.error('Failed to fetch withdrawals:', error)
            setWithdrawals([])
        } finally {
            setLoading(false)
        }
    }

    const filteredWithdrawals = Array.isArray(withdrawals)
        ? withdrawals.filter(w => filter === 'all' || w.status === filter)
        : []
    const pendingCount = filteredWithdrawals.filter(w => w.status === 'pending').length

    const handleApprove = async (id) => {
        setProcessing(true)
        try {
            const txHash = '0x' + Math.random().toString(16).substr(2, 40)
            const res = await api.adminApproveWithdrawal(id, txHash)
            if (res.success) {
                setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: 'completed', tx_hash: txHash } : w))
            }
        } catch (error) {
            console.error('Failed to approve withdrawal:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleReject = async (id) => {
        setProcessing(true)
        try {
            const res = await api.adminRejectWithdrawal(id)
            if (res.success) {
                setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status: 'rejected' } : w))
            }
        } catch (error) {
            console.error('Failed to reject withdrawal:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleCopy = (wallet, id) => {
        navigator.clipboard.writeText(wallet)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
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
                        <h1 className="text-2xl font-bold text-white">Withdrawal Management</h1>
                        <p className="text-gray-400">Process user withdrawal requests</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-warning">{pendingCount} Pending</span>
                        <button onClick={fetchWithdrawals} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 border-accent-purple/10">
                <div className="flex gap-2">
                    {['all', 'pending', 'completed', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === status ? 'bg-accent-purple text-white' : 'bg-card-hover text-gray-400 hover:text-white'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Withdrawals list */}
            {filteredWithdrawals.length === 0 ? (
                <div className="glass-card p-12 text-center text-gray-400">
                    No withdrawals found
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredWithdrawals.map((withdrawal) => (
                        <div key={withdrawal.id} className="glass-card p-6 border-accent-purple/10">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-red to-rose-500 flex items-center justify-center text-white font-bold">
                                        {(withdrawal.user_name || withdrawal.userName || 'U').charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{withdrawal.user_name || withdrawal.userName || 'Unknown'}</div>
                                        <div className="text-sm text-gray-400">{withdrawal.method_name || withdrawal.method || 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="flex-1 lg:text-center">
                                    <div className="text-2xl font-bold text-accent-red">${parseFloat(withdrawal.amount).toLocaleString()}</div>
                                    <div className="text-xs text-gray-400">{new Date(withdrawal.created_at).toLocaleDateString()}</div>
                                </div>

                                <div className="flex-1">
                                    <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm text-accent-cyan bg-card-hover px-3 py-1 rounded-lg truncate max-w-[250px]">
                                            {withdrawal.wallet_address || withdrawal.wallet || 'N/A'}
                                        </code>
                                        <button
                                            onClick={() => handleCopy(withdrawal.wallet_address || withdrawal.wallet, withdrawal.id)}
                                            className="p-2 rounded-lg hover:bg-card-hover text-gray-400 hover:text-white"
                                        >
                                            {copied === withdrawal.id ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`badge ${withdrawal.status === 'completed' ? 'badge-success' :
                                        withdrawal.status === 'pending' ? 'badge-warning' :
                                            'badge-danger'
                                        }`}>
                                        {withdrawal.status}
                                    </span>

                                    {withdrawal.status === 'pending' && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleApprove(withdrawal.id)}
                                                disabled={processing}
                                                className="px-4 py-2 rounded-xl bg-accent-green/10 text-accent-green hover:bg-accent-green/20 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <Check className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(withdrawal.id)}
                                                disabled={processing}
                                                className="px-4 py-2 rounded-xl bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                <X className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {withdrawal.tx_hash && (
                                        <button className="p-2 rounded-lg hover:bg-card-hover text-gray-400 hover:text-white" title="View Transaction">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
