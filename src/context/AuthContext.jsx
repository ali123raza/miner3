import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for existing token and validate
        const checkAuth = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const response = await api.getMe()
                    if (response.data?.user) {
                        setUser(response.data.user)
                        setIsAuthenticated(true)
                    }
                } catch (error) {
                    // Token invalid, clear it
                    localStorage.removeItem('token')
                }
            }
            setLoading(false)
        }
        checkAuth()
    }, [])

    const login = async (email, password, isAdmin = false) => {
        try {
            const endpoint = isAdmin ? '/auth/admin-login' : '/auth/login'
            const response = await api.request(endpoint, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            })

            // API returns { success, message, data: { token, user } }
            if (response.success && response.data?.token) {
                api.setToken(response.data.token)
                setUser(response.data.user)
                setIsAuthenticated(true)
                return { success: true, user: response.data.user }
            }
            return { success: false, error: response.error || 'Login failed' }
        } catch (error) {
            return { success: false, error: error.message || 'Login failed' }
        }
    }

    const register = async (name, email, password, referredBy = null) => {
        try {
            const response = await api.register(name, email, password, referredBy)

            if (response.success && response.data?.token) {
                // Token is already set by api.register
                setUser(response.data.user)
                setIsAuthenticated(true)
                return { success: true, user: response.data.user }
            }
            return { success: false, error: response.error || 'Registration failed' }
        } catch (error) {
            return { success: false, error: error.message || 'Registration failed' }
        }
    }

    const logout = () => {
        api.logout()
        setUser(null)
        setIsAuthenticated(false)
    }

    const updateUser = (updates) => {
        setUser(prev => ({ ...prev, ...updates }))
    }

    const refreshUser = async () => {
        try {
            const response = await api.getMe()
            if (response.data?.user) {
                setUser(response.data.user)
            }
        } catch (error) {
            console.error('Failed to refresh user:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"></div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            updateUser,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}
