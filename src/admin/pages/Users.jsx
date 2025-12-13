import { useState, useEffect } from 'react'
import {
    Search,
    Eye,
    Ban,
    CheckCircle,
    DollarSign,
    RefreshCw
} from 'lucide-react'
import api from '../../services/api'

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await api.adminGetUsers()
            if (res.success && Array.isArray(res.data)) {
                setUsers(res.data)
            } else {
                setUsers([])
            }
        } catch (error) {
            console.error('Failed to fetch users:', error)
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = users.filter(user => {
        if (statusFilter !== 'all' && user.status !== statusFilter) return false
        if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    const handleToggleBlock = async (userId) => {
        setProcessing(true)
        try {
            const user = users.find(u => u.id === userId)
            const newStatus = user.status === 'active' ? 'blocked' : 'active'
            const res = await api.adminUpdateUser(userId, { status: newStatus })
            if (res.success) {
                setUsers(users.map(u =>
                    u.id === userId ? { ...u, status: newStatus } : u
                ))
            }
        } catch (error) {
            console.error('Failed to update user:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleViewUser = (user) => {
        setSelectedUser(user)
        setShowModal(true)
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
                        <h1 className="text-2xl font-bold text-white">User Management</h1>
                        <p className="text-gray-400">Manage all registered users</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-success">{users.filter(u => u.status === 'active').length} Active</span>
                        <span className="badge badge-danger">{users.filter(u => u.status === 'blocked').length} Blocked</span>
                        <button onClick={fetchUsers} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 border-accent-purple/10">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-primary-light border border-glass-border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-purple text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'active', 'blocked'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${statusFilter === status
                                    ? 'bg-accent-purple text-white'
                                    : 'bg-card-hover text-gray-400 hover:text-white'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users table */}
            <div className="glass-card overflow-hidden border-accent-purple/10">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        No users found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-400 text-sm border-b border-glass-border">
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Balance</th>
                                    <th className="px-6 py-4 font-medium">Deposits</th>
                                    <th className="px-6 py-4 font-medium">Earnings</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="table-row">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white font-medium">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{user.name}</div>
                                                    <div className="text-sm text-gray-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-medium">${parseFloat(user.balance || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-accent-green">${parseFloat(user.total_deposits || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-accent-cyan">${parseFloat(user.total_earnings || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={user.status === 'active' ? 'badge-success' : 'badge-danger'}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewUser(user)}
                                                    className="p-2 rounded-lg hover:bg-card-hover text-gray-400 hover:text-white"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleBlock(user.id)}
                                                    disabled={processing}
                                                    className={`p-2 rounded-lg hover:bg-card-hover disabled:opacity-50 ${user.status === 'active' ? 'text-gray-400 hover:text-accent-red' : 'text-accent-red hover:text-accent-green'
                                                        }`}
                                                    title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                                                >
                                                    {user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-card w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{selectedUser.name}</h2>
                                    <p className="text-gray-400">{selectedUser.email}</p>
                                    <span className={selectedUser.status === 'active' ? 'badge-success' : 'badge-danger'}>
                                        {selectedUser.status}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-card-hover">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm">Balance</span>
                                </div>
                                <div className="text-2xl font-bold text-white">${parseFloat(selectedUser.balance || 0).toLocaleString()}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-card-hover">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm">Total Earnings</span>
                                </div>
                                <div className="text-2xl font-bold text-accent-green">${parseFloat(selectedUser.total_earnings || 0).toLocaleString()}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-card-hover">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm">Total Deposits</span>
                                </div>
                                <div className="text-2xl font-bold text-white">${parseFloat(selectedUser.total_deposits || 0).toLocaleString()}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-card-hover">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span className="text-sm">Total Withdrawals</span>
                                </div>
                                <div className="text-2xl font-bold text-accent-red">${parseFloat(selectedUser.total_withdrawals || 0).toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-card-hover">
                                <span className="text-gray-400">Referral Code</span>
                                <code className="text-accent-cyan">{selectedUser.referral_code || 'N/A'}</code>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-card-hover">
                                <span className="text-gray-400">Referred By</span>
                                <span className="text-white">{selectedUser.referred_by || 'None'}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-card-hover">
                                <span className="text-gray-400">Joined</span>
                                <span className="text-white">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    handleToggleBlock(selectedUser.id)
                                    setShowModal(false)
                                }}
                                disabled={processing}
                                className={selectedUser.status === 'active' ? 'btn-danger flex-1' : 'btn-success flex-1'}
                            >
                                {selectedUser.status === 'active' ? 'Block User' : 'Unblock User'}
                            </button>
                            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
