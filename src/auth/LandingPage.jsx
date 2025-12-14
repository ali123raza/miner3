import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, TrendingUp, Users, ChevronRight, Bitcoin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import api from '../services/api'

export default function LandingPage() {
    const { isAuthenticated, user } = useAuth()

    const features = [
        {
            icon: <Bitcoin className="w-8 h-8" />,
            title: 'Multiple Cryptocurrencies',
            description: 'Mine and invest in Bitcoin, Ethereum, USDT, and more with our advanced platform.'
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'High ROI Returns',
            description: 'Earn up to 18% ROI with our premium investment plans. Daily earnings, instant withdrawals.'
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Secure & Transparent',
            description: 'Bank-grade security with full transparency. Your investments are always safe with us.'
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'Instant Processing',
            description: 'Quick deposits, real-time mining, and fast withdrawals. No waiting, no hassle.'
        }
    ]

    const [plans, setPlans] = useState([])

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.getPublicPlans();
                if (response.data && Array.isArray(response.data)) {
                    const formattedPlans = response.data.map(plan => {
                        // Calculate ROI based on daily earning * duration / price
                        const price = parseFloat(plan.price);
                        const daily = parseFloat(plan.daily_earning);
                        const duration = parseInt(plan.duration);

                        let roiString = 'N/A';
                        if (price > 0) {
                            const roiVal = (daily * duration / price) * 100;
                            roiString = `${Math.round(roiVal)}%`;
                        } else {
                            roiString = 'Free';
                        }

                        return {
                            name: plan.name,
                            roi: roiString,
                            daily: `$${daily.toFixed(2)}`,
                            hashRate: parseFloat(plan.hash_rate),
                            hashUnit: plan.hash_unit,
                            duration: `${plan.duration} ${plan.duration_unit.charAt(0).toUpperCase() + plan.duration_unit.slice(1)}`,
                            price: `$${price.toLocaleString()}`,
                            color: plan.color || 'cyan'
                        };
                    });
                    // Limit to 4 plans if you want to maintain the layout or show all
                    setPlans(formattedPlans);
                }
            } catch (error) {
                console.error("Failed to fetch plans", error);
            }
        };
        fetchPlans();
    }, []);

    const stats = [
        { label: 'Total Users', value: '12,500+' },
        { label: 'Total Invested', value: '$25M+' },
        { label: 'Total Payouts', value: '$18M+' },
        { label: 'Active Miners', value: '8,900+' }
    ]

    return (
        <div className="min-h-screen bg-primary overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-accent-cyan/5 to-transparent rounded-full"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                            <span className="text-xl font-bold">₿</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
                            CryptoMine
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a>
                        <a href="#plans" className="text-gray-400 hover:text-white transition-colors">Plans</a>
                        <a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="btn-primary">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 px-6 pt-20 pb-32">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-8">
                        <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                        <span className="text-accent-cyan text-sm font-medium">Live Mining • 24/7 Operations</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="text-white">Start Mining</span>
                        <br />
                        <span className="bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink bg-clip-text text-transparent animate-gradient">
                            Cryptocurrency Today
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                        Join thousands of investors earning passive income through our secure cloud mining platform.
                        No hardware required, instant setup, guaranteed returns.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                            Start Mining Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/login" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                            View Dashboard
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="glass-card p-6 text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative z-10 px-6 py-24 bg-gradient-to-b from-transparent via-primary-light/50 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Why Choose CryptoMine?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Industry-leading features designed for maximum profitability and security
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="glass-card-hover p-8 text-center group">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center mx-auto mb-6 text-accent-cyan group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rigs Section */}
            <section id="plans" className="relative z-10 px-6 py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Mining Rigs</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Choose the perfect hardware for your mining goals
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((rig, index) => (
                            <div
                                key={index}
                                className={`glass-card-hover p-8 relative overflow-hidden group ${index === 2 ? 'ring-2 ring-accent-yellow/50' : ''
                                    }`}
                            >
                                {index === 2 && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-accent-yellow/20 text-accent-yellow text-xs font-medium rounded-full">
                                        Popular
                                    </div>
                                )}
                                <h3 className={`text-2xl font-bold mb-2 text-accent-${rig.color}`}>{rig.name}</h3>
                                <div className="flex items-end gap-2 mb-4">
                                    <span className="text-4xl font-bold text-white">{rig.hashRate}</span>
                                    <span className="text-gray-400 mb-1">{rig.hashUnit}</span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Daily Profit</span>
                                        <span className="text-white font-medium">{rig.daily}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">ROI</span>
                                        <span className="text-accent-green font-medium">{rig.roi}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Duration</span>
                                        <span className="text-white">{rig.duration}</span>
                                    </div>
                                </div>

                                <div className="border-t border-glass-border pt-6 mb-6">
                                    <div className="text-sm text-gray-400">Price</div>
                                    <div className="text-xl font-semibold text-white">{rig.price}</div>
                                </div>
                                <Link
                                    to="/register"
                                    className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${index === 2
                                        ? 'bg-gradient-to-r from-accent-yellow to-accent-orange text-black hover:shadow-lg'
                                        : 'bg-glass-bg border border-glass-border text-white hover:border-accent-cyan/50'
                                        }`}
                                >
                                    Start Mining
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 px-6 py-24">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-mesh opacity-50"></div>
                        <div className="relative z-10">
                            <Users className="w-16 h-16 text-accent-cyan mx-auto mb-6" />
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Ready to Start Earning?
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                Join over 12,500 investors who trust CryptoMine for their passive income needs.
                                Start your mining journey today.
                            </p>
                            <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4">
                                Create Free Account
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-glass-border">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
                            <span className="text-sm font-bold">₿</span>
                        </div>
                        <span className="text-lg font-bold text-white">CryptoMine</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                        © 2024 CryptoMine. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
