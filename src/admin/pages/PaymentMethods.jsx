import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Copy, Check, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function PaymentMethods() {
    const [methods, setMethods] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingMethod, setEditingMethod] = useState(null)
    const [copied, setCopied] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        wallet_address: '',
        network: '',
        icon: '₿',
        color: '#f7931a',
        min_deposit: 100,
        min_withdrawal: 50,
        deposit_fee: 0,
        withdrawal_fee: 2.5
    })

    const iconOptions = ['₿', 'Ξ', '₮', '⬡', '◎', '✦', '⚡', '🪙']
    const colorOptions = ['#f7931a', '#627eea', '#26a17b', '#f3ba2f', '#8247e5', '#e84142', '#00d4ff', '#a855f7']

    useEffect(() => {
        fetchMethods()
    }, [])

    const fetchMethods = async () => {
        setLoading(true)
        try {
            const res = await api.getPaymentMethods()
            if (res.success && Array.isArray(res.data)) {
                setMethods(res.data)
            } else {
                setMethods([])
            }
        } catch (error) {
            console.error('Failed to fetch payment methods:', error)
            setMethods([])
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingMethod(null)
        setFormData({
            name: '',
            symbol: '',
            wallet_address: '',
            network: '',
            icon: '₿',
            color: '#f7931a',
            min_deposit: 100,
            min_withdrawal: 50,
            deposit_fee: 0,
            withdrawal_fee: 2.5
        })
        setShowModal(true)
    }

    const handleEdit = (method) => {
        setEditingMethod(method)
        setFormData({
            name: method.name,
            symbol: method.symbol,
            wallet_address: method.wallet_address,
            network: method.network || '',
            icon: method.icon || '₿',
            color: method.color || '#f7931a',
            min_deposit: parseFloat(method.min_deposit) || 100,
            min_withdrawal: parseFloat(method.min_withdrawal) || 50,
            deposit_fee: parseFloat(method.deposit_fee) || 0,
            withdrawal_fee: parseFloat(method.withdrawal_fee) || 2.5
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        setProcessing(true)
        try {
            const methodData = {
                name: formData.name,
                symbol: formData.symbol,
                wallet_address: formData.wallet_address,
                network: formData.network,
                icon: formData.icon,
                color: formData.color,
                min_deposit: parseFloat(formData.min_deposit),
                min_withdrawal: parseFloat(formData.min_withdrawal),
                deposit_fee: parseFloat(formData.deposit_fee),
                withdrawal_fee: parseFloat(formData.withdrawal_fee),
                is_active: editingMethod?.is_active ?? true
            }

            let res
            if (editingMethod) {
                res = await api.adminUpdatePaymentMethod(editingMethod.id, methodData)
            } else {
                res = await api.adminCreatePaymentMethod(methodData)
            }

            if (res.success) {
                fetchMethods()
                setShowModal(false)
            }
        } catch (error) {
            console.error('Failed to save method:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleToggle = async (id) => {
        const method = methods.find(m => m.id === id)
        try {
            const res = await api.adminUpdatePaymentMethod(id, { is_active: !method.is_active })
            if (res.success) {
                setMethods(methods.map(m => m.id === id ? { ...m, is_active: !m.is_active } : m))
            }
        } catch (error) {
            console.error('Failed to toggle method:', error)
        }
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this payment method?')) {
            try {
                const res = await api.adminDeletePaymentMethod(id)
                if (res.success) {
                    setMethods(methods.filter(m => m.id !== id))
                }
            } catch (error) {
                console.error('Failed to delete method:', error)
            }
        }
    }

    const handleCopy = (address, id) => {
        navigator.clipboard.writeText(address)
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
                        <h1 className="text-2xl font-bold text-white">Payment Methods</h1>
                        <p className="text-gray-400">Manage deposit and withdrawal payment methods</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchMethods} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Method
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Total Methods</div>
                    <div className="text-2xl font-bold text-white">{methods.length}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Active</div>
                    <div className="text-2xl font-bold text-accent-green">{methods.filter(m => m.is_active).length}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Inactive</div>
                    <div className="text-2xl font-bold text-accent-red">{methods.filter(m => !m.is_active).length}</div>
                </div>
            </div>

            {/* Methods list */}
            {methods.length === 0 ? (
                <div className="glass-card p-12 text-center text-gray-400">
                    No payment methods found. Add one to get started.
                </div>
            ) : (
                <div className="space-y-4">
                    {methods.map((method) => (
                        <div
                            key={method.id}
                            className={`glass-card p-6 border-accent-purple/10 ${!method.is_active ? 'opacity-60' : ''}`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Method info */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ backgroundColor: `${method.color || '#f7931a'}20` }}
                                    >
                                        {method.icon || '₿'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-white">{method.name}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded bg-card-hover text-gray-400">{method.symbol}</span>
                                        </div>
                                        {method.network && (
                                            <div className="text-sm text-gray-400">Network: {method.network}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Wallet address */}
                                <div className="flex-1">
                                    <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm text-accent-cyan bg-card-hover px-3 py-1.5 rounded-lg truncate max-w-[300px]">
                                            {method.wallet_address}
                                        </code>
                                        <button
                                            onClick={() => handleCopy(method.wallet_address, method.id)}
                                            className="p-2 rounded-lg hover:bg-card-hover text-gray-400 hover:text-white"
                                        >
                                            {copied === method.id ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Fees */}
                                <div className="flex gap-4">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">Min Deposit</div>
                                        <div className="text-white font-medium">${parseFloat(method.min_deposit || 100).toLocaleString()}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">Min Withdraw</div>
                                        <div className="text-white font-medium">${parseFloat(method.min_withdrawal || 50).toLocaleString()}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-400">Withdraw Fee</div>
                                        <div className="text-white font-medium">{parseFloat(method.withdrawal_fee || 2.5)}%</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggle(method.id)}
                                        className={`p-2 rounded-lg transition-colors ${method.is_active ? 'text-accent-green' : 'text-gray-500'}`}
                                        title={method.is_active ? 'Active - Click to disable' : 'Inactive - Click to enable'}
                                    >
                                        {method.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(method)}
                                        className="p-2 rounded-lg hover:bg-card-hover text-gray-400 hover:text-white"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(method.id)}
                                        className="p-2 rounded-lg hover:bg-accent-red/10 text-gray-400 hover:text-accent-red"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                        </h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., Bitcoin"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                                    <input
                                        type="text"
                                        value={formData.symbol}
                                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                                        className="input-field"
                                        placeholder="e.g., BTC"
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address</label>
                                <input
                                    type="text"
                                    value={formData.wallet_address}
                                    onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter wallet address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Network (optional)</label>
                                <input
                                    type="text"
                                    value={formData.network}
                                    onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., TRC20, ERC20, BEP20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                                <div className="flex gap-2 flex-wrap">
                                    {iconOptions.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${formData.icon === icon ? 'bg-accent-purple ring-2 ring-accent-purple' : 'bg-card-hover hover:bg-card'
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-10 h-10 rounded-xl transition-all ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-primary' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Deposit ($)</label>
                                    <input
                                        type="number"
                                        value={formData.min_deposit}
                                        onChange={(e) => setFormData({ ...formData, min_deposit: parseFloat(e.target.value) })}
                                        className="input-field"
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Withdrawal ($)</label>
                                    <input
                                        type="number"
                                        value={formData.min_withdrawal}
                                        onChange={(e) => setFormData({ ...formData, min_withdrawal: parseFloat(e.target.value) })}
                                        className="input-field"
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Deposit Fee (%)</label>
                                    <input
                                        type="number"
                                        value={formData.deposit_fee}
                                        onChange={(e) => setFormData({ ...formData, deposit_fee: parseFloat(e.target.value) })}
                                        className="input-field"
                                        min={0}
                                        step={0.1}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Withdrawal Fee (%)</label>
                                    <input
                                        type="number"
                                        value={formData.withdrawal_fee}
                                        onChange={(e) => setFormData({ ...formData, withdrawal_fee: parseFloat(e.target.value) })}
                                        className="input-field"
                                        min={0}
                                        step={0.1}
                                    />
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="p-4 rounded-xl bg-card-hover">
                                <div className="text-xs text-gray-400 mb-2">Preview</div>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                        style={{ backgroundColor: `${formData.color}20` }}
                                    >
                                        {formData.icon}
                                    </div>
                                    <div>
                                        <div className="text-white font-medium">{formData.name || 'Method Name'}</div>
                                        <div className="text-sm text-gray-400">{formData.symbol || 'SYM'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.name || !formData.symbol || !formData.wallet_address || processing}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Saving...' : (editingMethod ? 'Save Changes' : 'Add Method')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
