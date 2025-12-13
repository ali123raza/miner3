import { useState } from 'react'
import { Settings as SettingsIcon, Image, DollarSign, Shield, Bell, Save, AlertTriangle } from 'lucide-react'
import { systemSettings } from '../../data/mockData'

export default function Settings() {
    const [settings, setSettings] = useState(systemSettings)
    const [saved, setSaved] = useState(false)
    const [activeTab, setActiveTab] = useState('general')

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'financial', label: 'Financial', icon: DollarSign },
        { id: 'security', label: 'Security', icon: Shield },
    ]

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-card p-6 border-accent-purple/10">
                <h1 className="text-2xl font-bold text-white">System Settings</h1>
                <p className="text-gray-400">Configure platform settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="glass-card p-2 border-accent-purple/10">
                <div className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-accent-purple text-white' : 'text-gray-400 hover:text-white hover:bg-card-hover'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Settings content */}
            <div className="glass-card p-6 border-accent-purple/10">
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-white mb-4">General Settings</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">App Name</label>
                                <input
                                    type="text"
                                    value={settings.appName}
                                    onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">App Logo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                                        <Image className="w-6 h-6 text-white" />
                                    </div>
                                    <button className="btn-secondary">Upload Logo</button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-card-hover">
                                <div>
                                    <div className="text-white font-medium">Maintenance Mode</div>
                                    <div className="text-sm text-gray-400">Disable access to the platform</div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                    className={`w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-accent-red' : 'bg-gray-600'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-card-hover">
                                <div>
                                    <div className="text-white font-medium">User Registration</div>
                                    <div className="text-sm text-gray-400">Allow new users to register</div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })}
                                    className={`w-12 h-6 rounded-full transition-colors ${settings.registrationEnabled ? 'bg-accent-green' : 'bg-gray-600'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${settings.registrationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'financial' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Financial Settings</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Deposit ($)</label>
                                <input
                                    type="number"
                                    value={settings.minDeposit}
                                    onChange={(e) => setSettings({ ...settings, minDeposit: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Deposit ($)</label>
                                <input
                                    type="number"
                                    value={settings.maxDeposit}
                                    onChange={(e) => setSettings({ ...settings, maxDeposit: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Withdrawal ($)</label>
                                <input
                                    type="number"
                                    value={settings.minWithdrawal}
                                    onChange={(e) => setSettings({ ...settings, minWithdrawal: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Withdrawal ($)</label>
                                <input
                                    type="number"
                                    value={settings.maxWithdrawal}
                                    onChange={(e) => setSettings({ ...settings, maxWithdrawal: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Withdrawal Fee (%)</label>
                                <input
                                    type="number"
                                    value={settings.withdrawalFee}
                                    onChange={(e) => setSettings({ ...settings, withdrawalFee: parseFloat(e.target.value) })}
                                    className="input-field"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Referral Bonus (%)</label>
                                <input
                                    type="number"
                                    value={settings.referralBonus}
                                    onChange={(e) => setSettings({ ...settings, referralBonus: parseInt(e.target.value) })}
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Security Settings</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-card-hover">
                                <div>
                                    <div className="text-white font-medium">Email Verification Required</div>
                                    <div className="text-sm text-gray-400">Users must verify email to access account</div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, emailVerificationRequired: !settings.emailVerificationRequired })}
                                    className={`w-12 h-6 rounded-full transition-colors ${settings.emailVerificationRequired ? 'bg-accent-green' : 'bg-gray-600'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${settings.emailVerificationRequired ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-card-hover">
                                <div>
                                    <div className="text-white font-medium">KYC Required</div>
                                    <div className="text-sm text-gray-400">Users must complete KYC for withdrawals</div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, kycRequired: !settings.kycRequired })}
                                    className={`w-12 h-6 rounded-full transition-colors ${settings.kycRequired ? 'bg-accent-green' : 'bg-gray-600'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${settings.kycRequired ? 'translate-x-6' : 'translate-x-0.5'
                                        }`}></div>
                                </button>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-accent-orange/5 border border-accent-orange/30">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-accent-orange font-medium">Security Recommendation</p>
                                    <p className="text-sm text-gray-400">
                                        Enable both email verification and KYC for production environments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Save button */}
            <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}
