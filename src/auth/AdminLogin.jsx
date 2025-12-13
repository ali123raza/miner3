import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login, isAuthenticated, user } = useAuth()

    // Redirect if already logged in as admin
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            navigate('/admin/dashboard')
        }
    }, [isAuthenticated, user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await login(email, password, true) // true = admin login

            if (result.success) {
                navigate('/admin/dashboard')
            } else {
                setError(result.error || 'Invalid admin credentials')
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background effects - different from user login */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-purple/15 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Admin Badge */}
                <div className="flex items-center justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/30">
                        <Shield className="w-4 h-4 text-accent-purple" />
                        <span className="text-accent-purple text-sm font-medium">Admin Portal</span>
                    </div>
                </div>

                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                        <span className="text-2xl font-bold">₿</span>
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                        CryptoMine
                    </span>
                </Link>

                {/* Login Card */}
                <div className="glass-card p-8 border-accent-purple/20">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
                        <p className="text-gray-400">Access the admin control panel</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Admin Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-12 focus:border-accent-purple focus:ring-accent-purple/20"
                                    placeholder="admin@cryptomine.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-12 pr-12 focus:border-accent-purple focus:ring-accent-purple/20"
                                    placeholder="Enter admin password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-accent-purple to-accent-pink text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-glow-purple hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Access Dashboard
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-glass-border text-center">
                        <p className="text-gray-500 text-sm">
                            This area is restricted to authorized administrators only.
                        </p>
                    </div>
                </div>

                {/* Demo credentials */}
                <div className="mt-6 p-4 rounded-xl bg-accent-purple/5 border border-accent-purple/20">
                    <p className="text-center text-sm text-gray-400">
                        <span className="text-accent-purple font-medium">Demo:</span> admin@cryptomine.com / admin123
                    </p>
                </div>

                {/* Back to main site */}
                <div className="mt-6 text-center">
                    <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                        ← Back to Main Site
                    </Link>
                </div>
            </div>
        </div>
    )
}
