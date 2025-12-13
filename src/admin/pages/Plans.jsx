import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Zap, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function AdminRigs() {
    const [rigs, setRigs] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingRig, setEditingRig] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        hash_rate: '',
        hash_unit: 'MH/s',
        daily_earning: '',
        power_consumption: '',
        duration: '',
        duration_unit: 'days',
        is_free: false,
        icon: '⚡',
        color: 'cyan',
        max_purchase: 10
    })

    const colorOptions = ['cyan', 'purple', 'yellow', 'pink', 'green', 'orange']
    const iconOptions = ['⚡', '🔥', '💎', '🏆', '🎁', '🚀', '⭐', '💰']
    const hashUnits = ['MH/s', 'GH/s', 'TH/s']

    useEffect(() => {
        fetchRigs()
    }, [])

    const fetchRigs = async () => {
        setLoading(true)
        try {
            const res = await api.adminGetRigs()
            if (res.success && Array.isArray(res.data)) {
                setRigs(res.data)
            } else {
                setRigs([])
            }
        } catch (error) {
            console.error('Failed to fetch rigs:', error)
            setRigs([])
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (rig) => {
        setEditingRig(rig)
        setFormData({
            name: rig.name,
            price: rig.price.toString(),
            hash_rate: rig.hash_rate.toString(),
            hash_unit: rig.hash_unit,
            daily_earning: rig.daily_earning.toString(),
            power_consumption: rig.power_consumption.toString(),
            duration: rig.duration.toString(),
            duration_unit: rig.duration_unit,
            is_free: rig.is_free,
            icon: rig.icon || '⚡',
            color: rig.color || 'cyan',
            max_purchase: rig.max_purchase || 10
        })
        setShowModal(true)
    }

    const handleCreate = () => {
        setEditingRig(null)
        setFormData({
            name: '',
            price: '',
            hash_rate: '',
            hash_unit: 'MH/s',
            daily_earning: '',
            power_consumption: '',
            duration: '',
            duration_unit: 'days',
            is_free: false,
            icon: '⚡',
            color: 'cyan',
            max_purchase: 10
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        setProcessing(true)
        try {
            const rigData = {
                name: formData.name,
                price: parseFloat(formData.price) || 0,
                hash_rate: parseFloat(formData.hash_rate),
                hash_unit: formData.hash_unit,
                daily_earning: parseFloat(formData.daily_earning),
                power_consumption: parseInt(formData.power_consumption),
                duration: parseInt(formData.duration),
                duration_unit: formData.duration_unit,
                is_free: formData.is_free,
                icon: formData.icon,
                color: formData.color,
                max_purchase: parseInt(formData.max_purchase)
            }

            let res
            if (editingRig) {
                res = await api.adminUpdateRig(editingRig.id, rigData)
            } else {
                res = await api.adminCreateRig(rigData)
            }

            if (res.success) {
                fetchRigs()
                setShowModal(false)
            }
        } catch (error) {
            console.error('Failed to save rig:', error)
        } finally {
            setProcessing(false)
        }
    }

    const handleToggle = async (rigId) => {
        const rig = rigs.find(r => r.id === rigId)
        try {
            const res = await api.adminUpdateRig(rigId, { is_active: !rig.is_active })
            if (res.success) {
                setRigs(rigs.map(r => r.id === rigId ? { ...r, is_active: !r.is_active } : r))
            }
        } catch (error) {
            console.error('Failed to toggle rig:', error)
        }
    }

    const handleDelete = async (rigId) => {
        if (confirm('Are you sure you want to delete this rig?')) {
            try {
                const res = await api.adminDeleteRig(rigId)
                if (res.success) {
                    setRigs(rigs.filter(r => r.id !== rigId))
                }
            } catch (error) {
                console.error('Failed to delete rig:', error)
            }
        }
    }

    const colorMap = {
        cyan: 'bg-accent-cyan',
        purple: 'bg-accent-purple',
        yellow: 'bg-accent-yellow',
        pink: 'bg-accent-pink',
        green: 'bg-accent-green',
        orange: 'bg-accent-orange'
    }

    const formatHashRate = (rate, unit) => {
        if (rate >= 1000 && unit === 'MH/s') {
            return `${(rate / 1000).toFixed(1)} GH/s`
        }
        return `${rate} ${unit}`
    }

    const totalHashRate = rigs.filter(r => r.is_active).reduce((sum, r) => sum + parseFloat(r.hash_rate || 0), 0)

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
                        <h1 className="text-2xl font-bold text-white">Mining Rigs</h1>
                        <p className="text-gray-400">Manage mining rigs and hash rates</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchRigs} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Rig
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4">
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Total Rigs</div>
                    <div className="text-2xl font-bold text-white">{rigs.length}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Active Rigs</div>
                    <div className="text-2xl font-bold text-accent-green">{rigs.filter(r => r.is_active).length}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Free Rigs</div>
                    <div className="text-2xl font-bold text-accent-cyan">{rigs.filter(r => r.is_free).length}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Total Hash Power</div>
                    <div className="text-2xl font-bold text-accent-purple">{formatHashRate(totalHashRate, 'MH/s')}</div>
                </div>
            </div>

            {/* Rigs grid */}
            {rigs.length === 0 ? (
                <div className="glass-card p-12 text-center text-gray-400">
                    No rigs found. Create one to get started.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rigs.map((rig) => (
                        <div
                            key={rig.id}
                            className={`glass-card p-6 border-accent-purple/10 relative ${!rig.is_active ? 'opacity-60' : ''}`}
                        >
                            {/* Badges */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                {rig.is_free && (
                                    <span className="px-2 py-1 rounded-full bg-accent-green text-white text-xs font-bold">FREE</span>
                                )}
                                <button
                                    onClick={() => handleToggle(rig.id)}
                                    className={`p-1 rounded transition-colors ${rig.is_active ? 'text-accent-green' : 'text-gray-500'}`}
                                >
                                    {rig.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                </button>
                            </div>

                            {/* Rig info */}
                            <div className="text-4xl mb-4">{rig.icon || '⚡'}</div>
                            <h3 className={`text-xl font-bold text-accent-${rig.color || 'cyan'} mb-2`}>{rig.name}</h3>

                            {/* Hash Rate */}
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-accent-cyan" />
                                <span className="text-lg font-bold text-white">{formatHashRate(parseFloat(rig.hash_rate), rig.hash_unit)}</span>
                            </div>

                            {/* Price */}
                            <div className="text-2xl font-bold mb-4">
                                {rig.is_free ? (
                                    <span className="text-accent-green">FREE</span>
                                ) : (
                                    <span className="text-white">${parseFloat(rig.price).toLocaleString()}</span>
                                )}
                            </div>

                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Daily Earning</span>
                                    <span className="text-accent-green">${parseFloat(rig.daily_earning).toFixed(2)}/day</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Duration</span>
                                    <span className="text-white">{rig.duration} {rig.duration_unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Power</span>
                                    <span className="text-white">{rig.power_consumption}W</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Max Purchase</span>
                                    <span className="text-white">{rig.max_purchase}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(rig)}
                                    className="flex-1 py-2 rounded-xl bg-card-hover text-gray-400 hover:text-white flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(rig.id)}
                                    className="py-2 px-3 rounded-xl bg-accent-red/10 text-accent-red hover:bg-accent-red/20"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
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
                            {editingRig ? 'Edit Mining Rig' : 'Create New Mining Rig'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rig Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Pro Miner"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_free}
                                        onChange={(e) => setFormData({ ...formData, is_free: e.target.checked, price: e.target.checked ? '0' : formData.price })}
                                        className="w-5 h-5 rounded bg-card-hover border-glass-border text-accent-green focus:ring-accent-green"
                                    />
                                    <span className="text-white">Free Rig</span>
                                </label>
                            </div>

                            {!formData.is_free && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="input-field"
                                        placeholder="500"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Hash Rate</label>
                                    <input
                                        type="number"
                                        value={formData.hash_rate}
                                        onChange={(e) => setFormData({ ...formData, hash_rate: e.target.value })}
                                        className="input-field"
                                        placeholder="300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Unit</label>
                                    <select
                                        value={formData.hash_unit}
                                        onChange={(e) => setFormData({ ...formData, hash_unit: e.target.value })}
                                        className="input-field"
                                    >
                                        {hashUnits.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Daily Earning ($)</label>
                                    <input
                                        type="number"
                                        value={formData.daily_earning}
                                        onChange={(e) => setFormData({ ...formData, daily_earning: e.target.value })}
                                        className="input-field"
                                        placeholder="15.00"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Power (Watts)</label>
                                    <input
                                        type="number"
                                        value={formData.power_consumption}
                                        onChange={(e) => setFormData({ ...formData, power_consumption: e.target.value })}
                                        className="input-field"
                                        placeholder="450"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="input-field flex-1"
                                            placeholder="60"
                                        />
                                        <select
                                            value={formData.duration_unit}
                                            onChange={(e) => setFormData({ ...formData, duration_unit: e.target.value })}
                                            className="input-field w-24"
                                        >
                                            <option value="days">Days</option>
                                            <option value="months">Months</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Purchase</label>
                                    <input
                                        type="number"
                                        value={formData.max_purchase}
                                        onChange={(e) => setFormData({ ...formData, max_purchase: e.target.value })}
                                        className="input-field"
                                        placeholder="5"
                                    />
                                </div>
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
                                            className={`w-10 h-10 rounded-xl ${colorMap[color]} transition-all ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-primary' : ''
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={processing}
                                className="btn-primary flex-1 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : (editingRig ? 'Save Changes' : 'Create Rig')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
