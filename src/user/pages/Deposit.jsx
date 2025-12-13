import { useState, useEffect } from 'react'
import { Copy, Check, Upload, AlertCircle, Wallet, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function Deposit() {
    const [paymentMethods, setPaymentMethods] = useState([])
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [amount, setAmount] = useState('')
    const [proof, setProof] = useState('')
    const [copied, setCopied] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchPaymentMethods()
    }, [])

    const fetchPaymentMethods = async () => {
        try {
            const res = await api.getPaymentMethods()
            if (res.success && Array.isArray(res.data)) {
                setPaymentMethods(res.data)
                if (res.data.length > 0) {
                    setSelectedMethod(res.data[0])
                }
            }
        } catch (err) {
            console.error('Failed to fetch payment methods:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedMethod?.wallet_address || '')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        try {
            const res = await api.createDeposit(parseFloat(amount), selectedMethod.id, proof || 'pending')

            if (res.success) {
                setSubmitted(true)
                setTimeout(() => {
                    setSubmitted(false)
                    setAmount('')
                    setProof('')
                }, 3000)
            } else {
                setError(res.error || 'Failed to submit deposit')
            }
        } catch (err) {
            setError(err.message || 'Failed to submit deposit')
        } finally {
            setSubmitting(false)
        }
    }

    const quickAmounts = [100, 500, 1000, 5000]

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-accent-cyan animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-emerald-500 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Deposit Funds</h1>
                        <p className="text-gray-400">Add funds to your wallet to start investing</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Payment method selection */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Select Payment Method</h2>

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
                                        ? 'bg-accent-cyan/10 border-2 border-accent-cyan'
                                        : 'bg-card-hover border-2 border-transparent hover:border-glass-border'
                                        }`}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                        style={{ backgroundColor: `${method.color || '#00bcd4'}20` }}
                                    >
                                        {method.icon || '💰'}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-white font-medium">{method.name}</div>
                                        <div className="text-gray-400 text-sm">{method.symbol}</div>
                                    </div>
                                    {selectedMethod?.id === method.id && (
                                        <div className="w-6 h-6 rounded-full bg-accent-cyan flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Deposit form */}
                <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Deposit Details</h2>

                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-accent-green" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Deposit Submitted!</h3>
                            <p className="text-gray-400">
                                Your deposit is being processed. It will be credited once confirmed by admin.
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
                                    Send {selectedMethod.symbol} to this address
                                </label>
                                <div className="flex items-center gap-2 p-4 rounded-xl bg-primary-light border border-glass-border">
                                    <code className="flex-1 text-accent-cyan text-sm break-all">
                                        {selectedMethod.wallet_address}
                                    </code>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="p-2 rounded-lg bg-card-hover hover:bg-accent-cyan/20 transition-colors"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5 text-accent-green" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
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
                                    min={selectedMethod.min_deposit || 10}
                                    required
                                />
                                <div className="flex gap-2 mt-3">
                                    {quickAmounts.map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setAmount(amt.toString())}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${amount === amt.toString()
                                                ? 'bg-accent-cyan text-white'
                                                : 'bg-card-hover text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            ${amt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Transaction Hash / Proof */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Transaction Hash (optional)
                                </label>
                                <input
                                    type="text"
                                    value={proof}
                                    onChange={(e) => setProof(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter transaction hash after payment"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20">
                                <AlertCircle className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-400">
                                    <p className="text-accent-cyan font-medium mb-1">Important:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Minimum deposit: ${selectedMethod.min_deposit || 10}</li>
                                        <li>Send exact amount to the address above</li>
                                        <li>Admin will approve your deposit after verification</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={!amount || submitting}
                                className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Deposit Request'
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
        </div>
    )
}
