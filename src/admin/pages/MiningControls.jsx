import { useState } from 'react'
import { Zap, Pause, Play, TrendingUp, DollarSign, Settings, AlertTriangle } from 'lucide-react'
import { miningSettings } from '../../data/mockData'

export default function MiningControls() {
    const [settings, setSettings] = useState(miningSettings)
    const [saved, setSaved] = useState(false)

    const handleToggleMining = () => {
        setSettings({ ...settings, miningActive: !settings.miningActive })
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-card p-6 border-accent-purple/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Mining Controls</h1>
                        <p className="text-gray-400">Manage global mining and ROI settings</p>
                    </div>
                    <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${settings.miningActive ? 'bg-accent-green/10 border border-accent-green/30' : 'bg-accent-red/10 border border-accent-red/30'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${settings.miningActive ? 'bg-accent-green animate-pulse' : 'bg-accent-red'}`}></span>
                        <span className={settings.miningActive ? 'text-accent-green' : 'text-accent-red'}>
                            {settings.miningActive ? 'Mining Active' : 'Mining Paused'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main toggle */}
            <div className="glass-card p-8 border-accent-purple/10 text-center">
                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center transition-all ${settings.miningActive
                        ? 'bg-gradient-to-br from-accent-green to-emerald-500 shadow-glow-green'
                        : 'bg-gray-700'
                    }`}>
                    <Zap className={`w-12 h-12 ${settings.miningActive ? 'text-white animate-pulse' : 'text-gray-400'}`} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    {settings.miningActive ? 'Mining is Running' : 'Mining is Paused'}
                </h2>
                <p className="text-gray-400 mb-6">
                    {settings.miningActive
                        ? 'All users are earning based on their investment plans'
                        : 'User earnings are currently paused'}
                </p>
                <button
                    onClick={handleToggleMining}
                    className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-all ${settings.miningActive
                            ? 'bg-accent-red hover:bg-accent-red/80 text-white'
                            : 'bg-accent-green hover:bg-accent-green/80 text-white'
                        }`}
                >
                    {settings.miningActive ? (
                        <>
                            <Pause className="w-5 h-5" />
                            Pause Mining
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Resume Mining
                        </>
                    )}
                </button>
            </div>

            {/* Settings grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* ROI Settings */}
                <div className="glass-card p-6 border-accent-purple/10">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent-cyan" />
                        ROI Settings
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Global ROI Multiplier (%)
                            </label>
                            <input
                                type="number"
                                value={settings.globalROI}
                                onChange={(e) => setSettings({ ...settings, globalROI: parseInt(e.target.value) })}
                                className="input-field"
                                min={0}
                                max={200}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                100% = normal ROI, 50% = half ROI, 200% = double ROI
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Earnings Cap (% of investment)
                            </label>
                            <input
                                type="number"
                                value={settings.earningsCap}
                                onChange={(e) => setSettings({ ...settings, earningsCap: parseInt(e.target.value) })}
                                className="input-field"
                                min={100}
                                max={1000}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Maximum total earnings as percentage of investment
                            </p>
                        </div>
                    </div>
                </div>

                {/* Earning Limits */}
                <div className="glass-card p-6 border-accent-purple/10">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-accent-green" />
                        Earning Limits
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Max Daily Earnings per User ($)
                            </label>
                            <input
                                type="number"
                                value={settings.maxDailyEarnings}
                                onChange={(e) => setSettings({ ...settings, maxDailyEarnings: parseInt(e.target.value) })}
                                className="input-field"
                                min={0}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-card-hover">
                            <div>
                                <div className="text-white font-medium">Auto-Compound Feature</div>
                                <div className="text-sm text-gray-400">Allow users to auto-reinvest earnings</div>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, autoCompoundEnabled: !settings.autoCompoundEnabled })}
                                className={`w-12 h-6 rounded-full transition-colors ${settings.autoCompoundEnabled ? 'bg-accent-green' : 'bg-gray-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${settings.autoCompoundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                                    }`}></div>
                            </button>
                        </div>

                        {settings.autoCompoundEnabled && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Compound Bonus (%)
                                </label>
                                <input
                                    type="number"
                                    value={settings.compoundBonus}
                                    onChange={(e) => setSettings({ ...settings, compoundBonus: parseInt(e.target.value) })}
                                    className="input-field"
                                    min={0}
                                    max={10}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div className="glass-card p-4 border-accent-orange/30 bg-accent-orange/5">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-accent-orange font-medium">Important Notice</p>
                        <p className="text-sm text-gray-400">
                            Changes to mining settings will affect all users immediately. Review carefully before saving.
                        </p>
                    </div>
                </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Settings'}
                </button>
            </div>
        </div>
    )
}
