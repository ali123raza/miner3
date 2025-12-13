import { useState, useEffect } from 'react'
import { Check, Zap, Activity, Cpu, RefreshCw } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Rigs() {
    const { refreshUser } = useAuth()
    const [rigs, setRigs] = useState([])
    const [userStats, setUserStats] = useState({ hashRate: 0, dailyEarnings: 0, activeRigs: 0 })
    const [loading, setLoading] = useState(true)
    const [selectedRig, setSelectedRig] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [purchasing, setPurchasing] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchRigs()
    }, [])

    const fetchRigs = async () => {
        setLoading(true)
        try {
            const [rigsRes, dashRes] = await Promise.all([
                api.getRigs(),
                api.getDashboard()
            ])

            if (rigsRes.success && rigsRes.data) {
                // rigsRes.data contains { available: [], owned: [] }
                setRigs(rigsRes.data.available || [])
            }

            if (dashRes.success && dashRes.data) {
                setUserStats({
                    hashRate: dashRes.data.total_hash_rate || 0,
                    dailyEarnings: parseFloat(dashRes.data.daily_earnings || 0),
                    activeRigs: dashRes.data.active_rigs || 0
                })
            }
        } catch (err) {
            console.error('Failed to fetch rigs:', err)
        } finally {
            setLoading(false)
        }
    }

    const handlePurchase = (rig) => {
        setSelectedRig(rig)
        setShowModal(true)
        setError('')
    }

    const confirmPurchase = async () => {
        setPurchasing(true)
        setError('')

        try {
            const response = await api.purchaseRig(selectedRig.id)

            if (response.success) {
                setSuccess(true)
                refreshUser()
                setTimeout(() => {
                    setShowModal(false)
                    setSuccess(false)
                    setSelectedRig(null)
                    fetchRigs() // Refresh rigs list
                }, 2000)
            } else {
                setError(response.error || 'Purchase failed')
            }
        } catch (err) {
            setError(err.message || 'Purchase failed')
        } finally {
            setPurchasing(false)
        }
    }

    const formatHashRate = (rate, unit) => {
        if (rate >= 1000) {
            return `${(rate / 1000).toFixed(1)} GH/s`
        }
        return `${rate} ${unit || 'MH/s'}`
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
                        <h1 className="text-2xl font-bold text-white">Mining Rigs</h1>
                        <p className="text-gray-400">Purchase mining rigs to earn cryptocurrency</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-xl bg-accent-green/10 border border-accent-green/30">
                            <span className="text-accent-green text-sm font-medium flex items-center gap-2">
                                <Activity className="w-4 h-4 animate-pulse" />
                                Mining Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hash Rate Overview */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-accent-cyan" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Your Hash Rate</div>
                            <div className="text-xl font-bold text-white">{formatHashRate(userStats.hashRate)}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-accent-green" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Daily Earnings</div>
                            <div className="text-xl font-bold text-accent-green">${userStats.dailyEarnings.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-accent-purple" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Active Rigs</div>
                            <div className="text-xl font-bold text-white">{userStats.activeRigs}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rigs Grid */}
            {rigs.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <Cpu className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Rigs Available</h3>
                    <p className="text-gray-400">Check back later for new mining rigs</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rigs.map((rig) => (
                        <div
                            key={rig.id}
                            className={`glass-card-hover p-6 relative overflow-hidden ${rig.is_free ? 'border-accent-green/30 bg-gradient-to-br from-accent-green/5 to-transparent' : ''
                                }`}
                        >
                            {/* Free Badge */}
                            {rig.is_free && (
                                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent-green text-white text-xs font-bold">
                                    FREE
                                </div>
                            )}

                            {/* Rig Icon */}
                            <div className="text-5xl mb-4">{rig.icon || '⚡'}</div>

                            {/* Rig Name */}
                            <h3 className={`text-xl font-bold text-accent-${rig.color || 'cyan'} mb-2`}>{rig.name}</h3>

                            {/* Hash Rate */}
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-3xl font-bold text-white">{formatHashRate(rig.hash_rate, rig.hash_unit)}</span>
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                                {rig.is_free ? (
                                    <span className="text-2xl font-bold text-accent-green">FREE</span>
                                ) : (
                                    <span className="text-2xl font-bold text-white">${parseFloat(rig.price).toLocaleString()}</span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Daily Earnings</span>
                                    <span className="text-accent-green font-medium">${parseFloat(rig.daily_earning).toFixed(2)}/day</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Duration</span>
                                    <span className="text-white">{rig.duration} {rig.duration_unit}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Power</span>
                                    <span className="text-white">{rig.power_consumption}W</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Total Return</span>
                                    <span className="text-accent-cyan font-medium">
                                        ${(parseFloat(rig.daily_earning) * rig.duration).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Purchase Button */}
                            <button
                                onClick={() => handlePurchase(rig)}
                                className={`w-full py-3 rounded-xl font-semibold transition-all ${rig.is_free
                                    ? 'bg-accent-green hover:bg-accent-green/80 text-white'
                                    : 'btn-primary'
                                    }`}
                            >
                                {rig.is_free ? 'Claim Free Rig' : 'Purchase Rig'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Purchase Modal */}
            {showModal && selectedRig && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-card w-full max-w-md p-6">
                        {success ? (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-10 h-10 text-accent-green" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {selectedRig.is_free ? 'Rig Claimed!' : 'Purchase Successful!'}
                                </h2>
                                <p className="text-gray-400">Your mining rig is now active</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-white mb-6">
                                    {selectedRig.is_free ? 'Claim Free Rig' : 'Confirm Purchase'}
                                </h2>

                                {error && (
                                    <div className="mb-4 p-4 rounded-xl bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="glass-card p-4 mb-6 bg-gradient-mesh">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{selectedRig.icon || '⚡'}</div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{selectedRig.name}</h3>
                                            <p className="text-accent-cyan">{formatHashRate(selectedRig.hash_rate, selectedRig.hash_unit)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between p-3 rounded-xl bg-card-hover">
                                        <span className="text-gray-400">Price</span>
                                        <span className={`font-bold ${selectedRig.is_free ? 'text-accent-green' : 'text-white'}`}>
                                            {selectedRig.is_free ? 'FREE' : `$${parseFloat(selectedRig.price).toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-xl bg-card-hover">
                                        <span className="text-gray-400">Daily Earnings</span>
                                        <span className="text-accent-green">${parseFloat(selectedRig.daily_earning).toFixed(2)}/day</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-xl bg-card-hover">
                                        <span className="text-gray-400">Duration</span>
                                        <span className="text-white">{selectedRig.duration} {selectedRig.duration_unit}</span>
                                    </div>
                                    <div className="flex justify-between p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30">
                                        <span className="text-gray-400">Total Return</span>
                                        <span className="text-accent-cyan font-bold">
                                            ${(parseFloat(selectedRig.daily_earning) * selectedRig.duration).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="btn-secondary flex-1"
                                        disabled={purchasing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmPurchase}
                                        disabled={purchasing}
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${selectedRig.is_free
                                            ? 'bg-accent-green hover:bg-accent-green/80 text-white'
                                            : 'btn-primary'
                                            }`}
                                    >
                                        {purchasing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            selectedRig.is_free ? 'Claim Now' : 'Confirm Purchase'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
