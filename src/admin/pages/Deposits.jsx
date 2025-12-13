import { useState, useEffect } from 'react'
import { Check, X, Eye, Image, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function Deposits() {
    const [deposits, setDeposits] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [selectedDeposit, setSelectedDeposit] = useState(null)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        fetchDeposits()
    }, [])

    const fetchDeposits = async () => {
        setLoading(true)
        try {
            const res = await api.adminGetDeposits()
            if (res.success && Array.isArray(res.data)) {
                setDeposits(res.data)
            } else {
                setDeposits([])
            }
        } catch (error) {
            console.error('Failed to fetch deposits:', error)
            setDeposits([])
        } finally {
            setLoading(false)
        }
    }

    const filteredDeposits = Array.isArray(deposits)
        ? deposits.filter(d => filter === 'all' || d.status === filter)
        : []

    const handleApprove = async (id) => {
        setProcessing(true)
        try {
            const res = await api.adminApproveDeposit(id)
            if (res.success) {
                setDeposits(deposits.map(d => d.id === id ? { ...d, status: 'completed' } : d))
                setSelectedDeposit(null)
            }
        } catch (error) {
            console.error('Failed to approve deposit:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleReject = async (id) => {
        setProcessing(true)
        try {
            const res = await api.adminRejectDeposit(id)
            if (res.success) {
                setDeposits(deposits.map(d => d.id === id ? { ...d, status: 'rejected' } : d))
                setSelectedDeposit(null)
            }
        } catch (error) {
            console.error('Failed to reject deposit:', error)
        } finally {
            setProcessing(false)
        }
    }

    const pendingCount = filteredDeposits.filter(d => d.status === 'pending').length

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
                        <h1 className="text-2xl font-bold text-white">Deposit Management</h1>
                        <p className="text-gray-400">Review and approve user deposits</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-warning">{pendingCount} Pending</span>
                        <button onClick={fetchDeposits} className="btn-secondary flex items-center gap-2">
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

            {/* Deposits table */}
            <div className="glass-card overflow-hidden border-accent-purple/10">
                {filteredDeposits.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No deposits found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm border-b border-glass-border">
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Method</th>
                                    <th className="px-6 py-4 font-medium">Proof</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDeposits.map((deposit) => (
                                    <tr key={deposit.id} className="table-row">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-green to-emerald-500 flex items-center justify-center text-white font-medium">
                                                    {(deposit.user_name || deposit.userName || 'U').charAt(0)}
                                                </div>
                                                <span className="text-white font-medium">{deposit.user_name || deposit.userName || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-accent-green font-bold">${parseFloat(deposit.amount).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-white">{deposit.method_name || deposit.method || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            {deposit.proof ? (
                                                <button
                                                    onClick={() => setSelectedDeposit(deposit)}
                                                    className="flex items-center gap-2 text-accent-cyan hover:underline"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </button>
                                            ) : deposit.tx_hash ? (
                                                <code className="text-xs text-gray-400">{deposit.tx_hash.substring(0, 20)}...</code>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${deposit.status === 'completed' ? 'badge-success' :
                                                deposit.status === 'pending' ? 'badge-warning' :
                                                    'badge-danger'
                                                }`}>
                                                {deposit.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(deposit.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {deposit.status === 'pending' && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleApprove(deposit.id)}
                                                        disabled={processing}
                                                        className="p-2 rounded-lg bg-accent-green/10 text-accent-green hover:bg-accent-green/20 disabled:opacity-50"
                                                        title="Approve"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(deposit.id)}
                                                        disabled={processing}
                                                        className="p-2 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Proof Preview Modal */}
            {selectedDeposit && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-card w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Deposit Details</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between p-3 rounded-xl bg-card-hover">
                                <span className="text-gray-400">User</span>
                                <span className="text-white font-medium">{selectedDeposit.user_name || selectedDeposit.userName}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-card-hover">
                                <span className="text-gray-400">Amount</span>
                                <span className="text-accent-green font-bold">${parseFloat(selectedDeposit.amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-card-hover">
                                <span className="text-gray-400">Method</span>
                                <span className="text-white">{selectedDeposit.method_name || selectedDeposit.method}</span>
                            </div>
                            <div className="flex justify-between p-3 rounded-xl bg-card-hover">
                                <span className="text-gray-400">Proof/TX Hash</span>
                                <span className="text-accent-cyan text-sm">{selectedDeposit.proof || selectedDeposit.tx_hash || 'N/A'}</span>
                            </div>
                        </div>

                        {selectedDeposit.status === 'pending' && (
                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={() => handleApprove(selectedDeposit.id)}
                                    disabled={processing}
                                    className="btn-success flex-1 disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : 'Approve Deposit'}
                                </button>
                                <button
                                    onClick={() => handleReject(selectedDeposit.id)}
                                    disabled={processing}
                                    className="btn-danger flex-1 disabled:opacity-50"
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                        <button onClick={() => setSelectedDeposit(null)} className="btn-secondary w-full">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
