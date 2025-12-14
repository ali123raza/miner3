import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, Cpu, Bitcoin, Truck, Database } from 'lucide-react'
import api from '../../services/api'

export default function MiningVisualizer({ hashRate, dailyEarnings, onRewardCollected }) {
    const [accumulated, setAccumulated] = useState(0)
    const [cycleState, setCycleState] = useState('mining') // mining, transferring, depositing
    const [coins, setCoins] = useState([])
    const containerRef = useRef(null)

    // Calculate a small "tick" amount based on daily earnings to show live progress
    // Daily / 24h / 60m / 60s / 10 (tenths of second)
    const tickAmount = dailyEarnings > 0 ? (dailyEarnings / 86400) * 5 : 0.000001

    // Cycle timer
    useEffect(() => {
        if (hashRate === 0) return

        const miningDuration = 8000 // 8 seconds mining
        const transferDuration = 2000 // 2 seconds transfer

        let cycleTimer

        const runCycle = () => {
            setCycleState('mining')

            // Collect for 8 seconds
            setTimeout(() => {
                setCycleState('transferring')

                // Transfer for 2 seconds then deposit
                setTimeout(async () => {
                    setCycleState('depositing')

                    // Trigger backend collection
                    try {
                        const response = await api.collectEarnings()
                        if (response.success) {
                            const earned = parseFloat(response.data.amount)
                            setAccumulated(prev => prev + earned)
                            if (onRewardCollected && earned > 0) {
                                onRewardCollected(response.data)
                            }
                        }
                    } catch (err) {
                        console.error("Mining collection failed", err)
                    }

                    // Reset after deposit animation (1s)
                    setTimeout(() => {
                        setCycleState('mining')
                    }, 1000)

                }, transferDuration)
            }, miningDuration)
        }

        runCycle()
        const interval = setInterval(runCycle, miningDuration + transferDuration + 1000)

        return () => clearInterval(interval)
    }, [hashRate, onRewardCollected])

    // Generate falling coins effect during mining
    useEffect(() => {
        if (cycleState !== 'mining' || hashRate === 0) return

        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance per tick
                const id = Date.now()
                setCoins(prev => [...prev.slice(-10), { id, x: Math.random() * 60 + 20 }]) // Keep falling coins

                // Cleanup old coins
                setTimeout(() => {
                    setCoins(prev => prev.filter(c => c.id !== id))
                }, 1000)
            }
        }, 200)

        return () => clearInterval(interval)
    }, [cycleState, hashRate])

    return (
        <div className="glass-card p-0 overflow-hidden relative min-h-[160px] bg-gradient-to-r from-gray-900 to-black border-accent-cyan/20">
            {/* Background Grid Animation */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 212, 255, 0.1) 1px, transparent 0)',
                backgroundSize: '30px 30px'
            }}></div>

            <div className="relative z-10 p-6 flex items-center justify-between h-full gap-8">

                {/* 1. Hashing Source (Left) */}
                <div className="flex flex-col items-center gap-2 w-32 shrink-0">
                    <div className="relative">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${hashRate > 0 ? 'bg-accent-cyan/20 animate-pulse' : 'bg-gray-800'}`}>
                            <Cpu className={`w-8 h-8 ${hashRate > 0 ? 'text-accent-cyan animate-[spin_4s_linear_infinite]' : 'text-gray-600'}`} />
                        </div>
                        {hashRate > 0 && (
                            <motion.div
                                className="absolute -right-2 -top-2 w-4 h-4 bg-accent-green rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        )}
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400">Hash Power</div>
                        <div className="text-sm font-bold text-white font-mono">{hashRate} MH/s</div>
                        {hashRate > 0 && (
                            <div className="text-[10px] text-accent-cyan font-mono mt-1 overflow-hidden w-24 whitespace-nowrap">
                                {Array(5).fill(0).map((_, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.2, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                                    >01</motion.span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Mining Process (Center) */}
                <div className="flex-1 relative h-32 bg-gray-900/50 rounded-xl border border-white/5 overflow-hidden flex items-end justify-center pb-2" ref={containerRef}>

                    {/* Falling Coins */}
                    <AnimatePresence>
                        {coins.map(coin => (
                            <motion.div
                                key={coin.id}
                                className="absolute top-0 text-accent-yellow"
                                style={{ left: `${coin.x}%` }}
                                initial={{ y: -20, opacity: 0, rotate: 0 }}
                                animate={{ y: 80, opacity: 1, rotate: 360 }}
                                exit={{ y: 100, opacity: 0, scale: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Bitcoin className="w-4 h-4" />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Mine Cart / Bucket */}
                    <motion.div
                        className="relative z-10"
                        animate={{
                            x: cycleState === 'transferring' ? 150 : (cycleState === 'depositing' ? 150 : 0),
                            opacity: cycleState === 'depositing' ? 0 : 1,
                            scale: cycleState === 'transferring' ? 1.1 : 1
                        }}
                        transition={{ type: "spring", stiffness: 50 }}
                    >
                        <div className="w-16 h-12 border-b-4 border-x-4 border-gray-500 rounded-b-xl bg-gray-800/80 flex items-center justify-center relative overflow-hidden">
                            {/* Fill Level */}
                            <motion.div
                                className="absolute bottom-0 w-full bg-accent-yellow/80"
                                animate={{ height: cycleState === 'mining' ? '80%' : '0%' }}
                                transition={{ duration: cycleState === 'mining' ? 8 : 0.5 }}
                            />
                            <div className="absolute font-bold text-xs text-black z-10 mix-blend-overlay">MINING</div>
                        </div>
                        {/* Wheels */}
                        <div className="flex justify-between px-2 -mt-1">
                            <div className="w-3 h-3 bg-gray-400 rounded-full animate-[spin_2s_linear_infinite]"></div>
                            <div className="w-3 h-3 bg-gray-400 rounded-full animate-[spin_2s_linear_infinite]"></div>
                        </div>
                    </motion.div>

                    {/* Progress Track */}
                    <div className="absolute bottom-0 w-full h-1 bg-gray-800"></div>

                    {/* Status Text overlay */}
                    <div className="absolute top-2 w-full text-center">
                        <span className="text-[10px] uppercase tracking-widest text-gray-500">
                            {cycleState === 'mining' ? 'Hashing Blocks...' :
                                cycleState === 'transferring' ? 'Transferring to Wallet...' : 'Confirming Deposit...'}
                        </span>
                    </div>
                </div>

                {/* 3. Wallet Destination (Right) */}
                <div className="flex flex-col items-center gap-2 w-32 shrink-0">
                    <motion.div
                        className="relative"
                        animate={cycleState === 'depositing' ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, -10, 10, 0],
                        } : {}}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
                            <Wallet className="w-8 h-8 text-white" />
                        </div>
                        {cycleState === 'depositing' && (
                            <motion.div
                                className="absolute inset-0 bg-white rounded-2xl"
                                initial={{ opacity: 0.8, scale: 1.2 }}
                                animate={{ opacity: 0, scale: 1.5 }}
                                transition={{ duration: 0.5 }}
                            />
                        )}
                        {/* Floating Coins on Deposit */}
                        {cycleState === 'depositing' && (
                            <>
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        className="absolute top-1/2 left-1/2 text-accent-yellow"
                                        initial={{ y: 0, x: 0, opacity: 1 }}
                                        animate={{ y: -40 - (i * 10), x: (i - 2) * 20, opacity: 0 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <div className="font-bold text-sm">+$</div>
                                    </motion.div>
                                ))}
                            </>
                        )}
                    </motion.div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400">Live Earnings</div>

                        <motion.div
                            key={accumulated}
                            className="text-sm font-bold text-accent-green font-mono"
                            initial={{ scale: 1.2, color: '#fff' }}
                            animate={{ scale: 1, color: '#4ade80' }}
                        >
                            +${accumulated.toFixed(6)}
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    )
}
