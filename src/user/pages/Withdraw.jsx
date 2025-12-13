import { useState, useEffect } from 'react'
import { ArrowDownToLine, Wallet, AlertTriangle, Check, Clock, RefreshCw } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function Withdraw() {
    const { user } = useAuth()
    const [paymentMethods, setPaymentMethods] = useState([])
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [amount, setAmount] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [balance, setBalance] = useState(0)

    const minWithdrawal = 20
    const maxWithdrawal = 50000
    const fee = 2.5

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [methodsRes, dashRes] = await Promise.all([
                api.getPaymentMethods(),
                api.getDashboard()
            ])

            if (methodsRes.success && Array.isArray(methodsRes.data)) {
                setPaymentMethods(methodsRes.data)
                if (methodsRes.data.length > 0) {
                    setSelectedMethod(methodsRes.data[0])
                }
            }

            if (dashRes.success && dashRes.data) {
                setBalance(parseFloat(dashRes.data.balance || 0))
            }
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            const res = await api.createWithdrawal(parseFloat(amount), selectedMethod.id, walletAddress)

            if (res.success) {
                setSubmitted(true)
                setBalance(prev => prev - parseFloat(amount))
                setTimeout(() => {
                    setSubmitted(false)
                    setAmount('')
                    setWalletAddress('')
                }, 3000)
            } else {
                setError(res.error || 'Failed to submit withdrawal')
            }
        } catch (err) {
            setError(err.message || 'Failed to submit withdrawal')
        } finally {
            setSubmitting(false)
        }
    }

    const calculateReceive = () => {
        const amt = parseFloat(amount) || 0
        const feeAmount = (amt * fee) / 100
        return Math.max(0, amt - feeAmount).toFixed(2)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header with balance */}
            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-pink-500 flex items-center justify-center">
                            <ArrowDownToLine className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
                            <p className="text-gray-400">Transfer funds from your wallet</p>
                        </div>
                    </div>
                    <div className="glass-card p-4 bg-gradient-mesh">
                        <div className="text-sm text-gray-400">Available Balance</div>
                        <div className="text-2xl font-bold text-white">${balance.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Payment method selection */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Select Withdrawal Method</h2>

                    {paymentMethods.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            No payment methods available
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${selectedMethod?.id === method.id
                                        ? 'bg-accent-purple/10 border-2 border-accent-purple'
                                        : 'bg-card-hover border-2 border-transparent hover:border-glass-border'
                                        }`}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ backgroundColor: `${method.color || '#9b59b6'}20` }}
                                    >
                                        {method.icon || '💸'}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-white font-medium">{method.name}</div>
                                        <div className="text-gray-400 text-sm">{method.symbol}</div>
                                    </div>
                                    {selectedMethod?.id === method.id && (
                                        <div className="w-6 h-6 rounded-full bg-accent-purple flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Withdrawal form */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Withdrawal Details</h2>

                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-6">
                                <Clock className="w-10 h-10 text-accent-green" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Withdrawal Requested!</h3>
                            <p className="text-gray-400">
                                Your withdrawal is being processed. Admin will review and send within 24 hours.
                            </p>
                        </div>
                    ) : selectedMethod ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 rounded-xl bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Wallet address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your {selectedMethod.symbol} Wallet Address
                                </label>
                                <div className="relative">
                                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={walletAddress}
                                        onChange={(e) => setWalletAddress(e.target.value)}
                                        className="input-field pl-12"
                                        placeholder={`Enter your ${selectedMethod.symbol} address`}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Amount (USD)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter amount"
                                    min={minWithdrawal}
                                    max={Math.min(balance, maxWithdrawal)}
                                    required
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>Min: ${minWithdrawal}</span>
                                    <span>Max: ${Math.min(balance, maxWithdrawal).toLocaleString()}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setAmount(Math.min(balance, maxWithdrawal).toString())}
                                    className="mt-2 text-accent-purple text-sm hover:underline"
                                >
                                    Withdraw Max
                                </button>
                            </div>

                            {/* Summary */}
                            <div className="p-4 rounded-xl bg-card-hover space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Amount</span>
                                    <span className="text-white">${parseFloat(amount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Fee ({fee}%)</span>
                                    <span className="text-accent-red">
                                        -${((parseFloat(amount || 0) * fee) / 100).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-glass-border">
                                    <span className="text-gray-400">You'll Receive</span>
                                    <span className="text-accent-green font-bold">${calculateReceive()}</span>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-orange/5 border border-accent-orange/20">
                                <AlertTriangle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-400">
                                    <p className="text-accent-orange font-medium mb-1">Please verify your wallet address</p>
                                    <p>Withdrawals sent to incorrect addresses cannot be recovered.</p>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!amount || !walletAddress || parseFloat(amount) > balance || submitting}
                                className="w-full py-3 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-glow-purple hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Request Withdrawal'
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            Select a payment method to continue
                        </div>
                    )}
                </div>
            </div>

            {/* Limits info */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Withdrawal Information</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-card-hover text-center">
                        <div className="text-sm text-gray-400 mb-1">Minimum</div>
                        <div className="text-xl font-bold text-white">${minWithdrawal}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card-hover text-center">
                        <div className="text-sm text-gray-400 mb-1">Maximum</div>
                        <div className="text-xl font-bold text-white">${maxWithdrawal.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-card-hover text-center">
                        <div className="text-sm text-gray-400 mb-1">Processing Time</div>
                        <div className="text-xl font-bold text-white">1-24 Hours</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
