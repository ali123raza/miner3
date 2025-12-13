import { useState } from 'react'
import {
    User,
    Mail,
    Phone,
    Lock,
    Wallet,
    Copy,
    Check,
    Eye,
    EyeOff,
    Camera,
    Shield,
    Bell
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
    const { user, updateUser } = useAuth()
    const [activeTab, setActiveTab] = useState('profile')
    const [copied, setCopied] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [saved, setSaved] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        btcWallet: '',
        ethWallet: '',
        usdtWallet: ''
    })

    const tabs = [
        { id: 'profile', label: 'Profile Info', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'wallets', label: 'Wallets', icon: Wallet },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ]

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = (e) => {
        e.preventDefault()
        // Mock save
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const handleCopyReferral = () => {
        navigator.clipboard.writeText(user?.referralCode || 'CRYPTO2024')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header with avatar */}
            <div className="glass-card p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-white text-3xl font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent-cyan flex items-center justify-center text-white hover:bg-accent-cyan/80 transition-colors">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
                        <p className="text-gray-400">{user?.email || 'user@example.com'}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 text-accent-green text-sm">
                                <span className="w-2 h-2 rounded-full bg-accent-green"></span>
                                Verified
                            </div>
                            <div className="text-gray-400 text-sm">
                                Member since Jan 2024
                            </div>
                        </div>
                    </div>
                    {/* Referral code */}
                    <div className="glass-card p-4 bg-gradient-mesh">
                        <div className="text-xs text-gray-400 mb-1">Your Referral Code</div>
                        <div className="flex items-center gap-2">
                            <code className="text-lg font-bold text-accent-cyan">{user?.referralCode || 'CRYPTO2024'}</code>
                            <button onClick={handleCopyReferral} className="p-1 hover:bg-card-hover rounded">
                                {copied ? <Check className="w-4 h-4 text-accent-green" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="glass-card p-2">
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-accent-cyan text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-card-hover'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div className="glass-card p-6">
                {activeTab === 'profile' && (
                    <form onSubmit={handleSave} className="space-y-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field pl-12"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field pl-12"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field pl-12"
                                        placeholder="+1 234 567 8900"
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary flex items-center gap-2">
                            {saved ? <Check className="w-5 h-5" /> : null}
                            {saved ? 'Saved!' : 'Save Changes'}
                        </button>
                    </form>
                )}

                {activeTab === 'security' && (
                    <form onSubmit={handleSave} className="space-y-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="input-field pl-12 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="input-field pl-12"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="input-field pl-12"
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">Update Password</button>
                    </form>
                )}

                {activeTab === 'wallets' && (
                    <form onSubmit={handleSave} className="space-y-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Withdrawal Wallets</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Add your wallet addresses for quick withdrawals. These will be used as default addresses.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <span className="flex items-center gap-2">
                                        <span className="text-orange-500">₿</span> Bitcoin Wallet
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="btcWallet"
                                    value={formData.btcWallet}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="bc1q..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <span className="flex items-center gap-2">
                                        <span className="text-blue-500">Ξ</span> Ethereum Wallet
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="ethWallet"
                                    value={formData.ethWallet}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="0x..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <span className="flex items-center gap-2">
                                        <span className="text-green-500">₮</span> USDT Wallet (TRC20)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="usdtWallet"
                                    value={formData.usdtWallet}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="T..."
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">Save Wallets</button>
                    </form>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Notification Preferences</h2>

                        <div className="space-y-4">
                            {[
                                { label: 'Email notifications for deposits', description: 'Receive email when deposit is confirmed' },
                                { label: 'Email notifications for withdrawals', description: 'Receive email when withdrawal is processed' },
                                { label: 'Email notifications for earnings', description: 'Daily earning summary via email' },
                                { label: 'Marketing emails', description: 'News about new features and promotions' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-card-hover">
                                    <div>
                                        <div className="text-white font-medium">{item.label}</div>
                                        <div className="text-gray-400 text-sm">{item.description}</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
