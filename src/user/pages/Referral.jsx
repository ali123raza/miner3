import { useState, useEffect } from 'react'
import { Users, Copy, Check, TrendingUp, Gift, RefreshCw, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function Referral() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [referralData, setReferralData] = useState({
        referrals: [],
        totalEarnings: 0,
        totalReferrals: 0,
        bonusPercentage: 5
    })

    const referralLink = `${window.location.origin}/register?ref=${user?.referral_code || ''}`

    useEffect(() => {
        fetchReferralData()
    }, [])

    const fetchReferralData = async () => {
        setLoading(true)
        try {
            // Fetch referral data from user's dashboard which includes referral info
            const dashRes = await api.getDashboard()

            if (dashRes.success && dashRes.data) {
                setReferralData({
                    referrals: dashRes.data.referrals || [],
                    totalEarnings: parseFloat(dashRes.data.referral_earnings || 0),
                    totalReferrals: dashRes.data.total_referrals || 0,
                    bonusPercentage: dashRes.data.referral_bonus || 5
                })
            }
        } catch (error) {
            console.error('Failed to fetch referral data:', error)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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
            <div className="glass-card p-6 bg-gradient-mesh">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Referral Program</h1>
                        <p className="text-gray-400">Invite friends and earn {referralData.bonusPercentage}% of their deposits</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-xl bg-accent-purple/10 border border-accent-purple/30">
                            <span className="text-accent-purple text-sm font-medium flex items-center gap-2">
                                <Gift className="w-4 h-4" />
                                {referralData.bonusPercentage}% Bonus
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-accent-cyan" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Total Referrals</div>
                            <div className="text-2xl font-bold text-white">{referralData.totalReferrals}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-accent-green" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Total Earnings</div>
                            <div className="text-2xl font-bold text-accent-green">${referralData.totalEarnings.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
                <div className="glass-card p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center">
                            <Gift className="w-6 h-6 text-accent-purple" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-400">Bonus Rate</div>
                            <div className="text-2xl font-bold text-accent-purple">{referralData.bonusPercentage}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Link Section */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Your Referral Link</h2>

                <div className="space-y-4">
                    {/* Referral Code */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Referral Code</label>
                        <div className="flex gap-3">
                            <div className="flex-1 px-4 py-3 rounded-xl bg-glass-bg border border-glass-border text-white font-mono">
                                {user?.referral_code || 'N/A'}
                            </div>
                            <button
                                onClick={() => copyToClipboard(user?.referral_code || '')}
                                className="btn-secondary flex items-center gap-2"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Referral Link */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Referral Link</label>
                        <div className="flex gap-3">
                            <div className="flex-1 px-4 py-3 rounded-xl bg-glass-bg border border-glass-border text-accent-cyan font-mono text-sm overflow-hidden text-ellipsis">
                                {referralLink}
                            </div>
                            <button
                                onClick={() => copyToClipboard(referralLink)}
                                className="btn-primary flex items-center gap-2"
                            >
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it Works */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-6">How It Works</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-cyan/20 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-cyan">1</span>
                        </div>
                        <h3 className="font-semibold text-white mb-2">Share Your Link</h3>
                        <p className="text-gray-400 text-sm">Share your unique referral link with friends and family</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-purple/20 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-purple">2</span>
                        </div>
                        <h3 className="font-semibold text-white mb-2">They Register & Deposit</h3>
                        <p className="text-gray-400 text-sm">When they sign up and make their first deposit</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-accent-green">3</span>
                        </div>
                        <h3 className="font-semibold text-white mb-2">Earn Bonus</h3>
                        <p className="text-gray-400 text-sm">You earn {referralData.bonusPercentage}% of their deposit as bonus</p>
                    </div>
                </div>
            </div>

            {/* Referral Tree / List */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Your Referrals</h2>
                    <span className="text-sm text-gray-400">{referralData.referrals.length} total</span>
                </div>

                {referralData.referrals.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Referrals Yet</h3>
                        <p className="text-gray-400">Share your referral link to start earning bonuses</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {referralData.referrals.map((ref, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                                        <span className="text-accent-cyan font-bold">{ref.name?.charAt(0) || 'U'}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{ref.name || 'User'}</div>
                                        <div className="text-xs text-gray-400">
                                            Joined {new Date(ref.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-accent-green font-bold">+${parseFloat(ref.bonus_earned || 0).toFixed(2)}</div>
                                    <div className="text-xs text-gray-400">Bonus earned</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
