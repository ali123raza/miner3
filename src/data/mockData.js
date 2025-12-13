// Mock Users
export const mockUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        balance: 12500.00,
        totalDeposits: 15000.00,
        totalWithdrawals: 5000.00,
        totalEarnings: 2850.50,
        activeInvestments: 3,
        status: 'active',
        joinedAt: '2024-01-15',
        referralCode: 'JOHN2024',
        referredBy: null,
        referralCount: 5
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        balance: 8750.25,
        totalDeposits: 10000.00,
        totalWithdrawals: 2000.00,
        totalEarnings: 1850.25,
        activeInvestments: 2,
        status: 'active',
        joinedAt: '2024-02-20',
        referralCode: 'JANE2024',
        referredBy: 'JOHN2024',
        referralCount: 2
    },
    {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        balance: 5200.00,
        totalDeposits: 5000.00,
        totalWithdrawals: 0,
        totalEarnings: 520.00,
        activeInvestments: 1,
        status: 'active',
        joinedAt: '2024-03-10',
        referralCode: 'MIKE2024',
        referredBy: 'JOHN2024',
        referralCount: 0
    },
    {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        balance: 0,
        totalDeposits: 3000.00,
        totalWithdrawals: 3500.00,
        totalEarnings: 850.00,
        activeInvestments: 0,
        status: 'blocked',
        joinedAt: '2024-01-20',
        referralCode: 'SARAH2024',
        referredBy: null,
        referralCount: 1
    }
]

// Mining Rigs
export const mockRigs = [
    {
        id: 1,
        name: 'Free Miner',
        price: 0,
        hashRate: 10,
        hashUnit: 'MH/s',
        dailyEarning: 0.50,
        powerConsumption: 50,
        duration: 365,
        durationUnit: 'days',
        isActive: true,
        isFree: true,
        icon: '🎁',
        color: 'green',
        features: ['Free Forever', '10 MH/s Hash Power', 'Daily Earnings', 'No Investment Required'],
        maxPurchase: 1
    },
    {
        id: 2,
        name: 'Starter Rig',
        price: 100,
        hashRate: 50,
        hashUnit: 'MH/s',
        dailyEarning: 2.50,
        powerConsumption: 120,
        duration: 30,
        durationUnit: 'days',
        isActive: true,
        isFree: false,
        icon: '⚡',
        color: 'cyan',
        features: ['50 MH/s Hash Power', 'Daily Earnings', '24/7 Support', 'Instant Activation'],
        maxPurchase: 10
    },
    {
        id: 3,
        name: 'Pro Rig',
        price: 500,
        hashRate: 300,
        hashUnit: 'MH/s',
        dailyEarning: 15.00,
        powerConsumption: 450,
        duration: 60,
        durationUnit: 'days',
        isActive: true,
        isFree: false,
        icon: '🔥',
        color: 'purple',
        features: ['300 MH/s Hash Power', 'Hourly Earnings', 'Priority Support', 'Auto Compound'],
        maxPurchase: 5
    },
    {
        id: 4,
        name: 'Elite Rig',
        price: 2000,
        hashRate: 1500,
        hashUnit: 'MH/s',
        dailyEarning: 80.00,
        powerConsumption: 1200,
        duration: 90,
        durationUnit: 'days',
        isActive: true,
        isFree: false,
        icon: '💎',
        color: 'yellow',
        features: ['1.5 GH/s Hash Power', 'Real-time Earnings', 'VIP Support', '2x Mining Boost', 'Auto Compound'],
        maxPurchase: 3
    },
    {
        id: 5,
        name: 'Enterprise Rig',
        price: 10000,
        hashRate: 10000,
        hashUnit: 'MH/s',
        dailyEarning: 500.00,
        powerConsumption: 5500,
        duration: 180,
        durationUnit: 'days',
        isActive: true,
        isFree: false,
        icon: '🏆',
        color: 'pink',
        features: ['10 GH/s Hash Power', 'Real-time Earnings', 'Personal Manager', '5x Mining Boost', 'Auto Compound', 'Exclusive Airdrops'],
        maxPurchase: 1
    }
]

// Payment Methods
export const paymentMethods = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', address: 'bc1q42lja79elem0anu8q8s3h2n687re9jax556pcc', icon: '₿', color: '#f7931a' },
    { id: 2, name: 'Ethereum', symbol: 'ETH', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45', icon: 'Ξ', color: '#627eea' },
    { id: 3, name: 'USDT (TRC20)', symbol: 'USDT', address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9', icon: '₮', color: '#26a17b' },
    { id: 4, name: 'USDT (ERC20)', symbol: 'USDT', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45', icon: '₮', color: '#26a17b' },
    { id: 5, name: 'BNB', symbol: 'BNB', address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2', icon: '⬡', color: '#f3ba2f' }
]

// Mock Transactions
export const mockTransactions = [
    { id: 1, type: 'deposit', amount: 5000, status: 'completed', method: 'Bitcoin', date: '2024-12-10', userId: 1 },
    { id: 2, type: 'earning', amount: 250.50, status: 'completed', plan: 'Gold', date: '2024-12-11', userId: 1 },
    { id: 3, type: 'withdrawal', amount: 1000, status: 'pending', method: 'USDT', date: '2024-12-12', userId: 1 },
    { id: 4, type: 'deposit', amount: 3000, status: 'pending', method: 'Ethereum', date: '2024-12-12', userId: 2, proof: 'proof1.jpg' },
    { id: 5, type: 'investment', amount: 5000, status: 'active', plan: 'Gold', date: '2024-12-08', userId: 1 },
    { id: 6, type: 'earning', amount: 180.25, status: 'completed', plan: 'Silver', date: '2024-12-11', userId: 2 },
    { id: 7, type: 'withdrawal', amount: 500, status: 'completed', method: 'Bitcoin', date: '2024-12-09', userId: 2 },
    { id: 8, type: 'deposit', amount: 10000, status: 'completed', method: 'USDT', date: '2024-12-05', userId: 1 },
    { id: 9, type: 'referral', amount: 50, status: 'completed', from: 'Jane Smith', date: '2024-12-10', userId: 1 }
]

// Mock Deposits
export const mockDeposits = [
    { id: 1, userId: 1, userName: 'John Doe', amount: 5000, method: 'Bitcoin', status: 'completed', date: '2024-12-10', txHash: '0x1a2b3c...', proof: null },
    { id: 2, userId: 2, userName: 'Jane Smith', amount: 3000, method: 'Ethereum', status: 'pending', date: '2024-12-12', txHash: null, proof: 'payment_proof.jpg' },
    { id: 3, userId: 3, userName: 'Mike Johnson', amount: 1000, method: 'USDT', status: 'pending', date: '2024-12-12', txHash: null, proof: 'deposit_receipt.png' },
    { id: 4, userId: 1, userName: 'John Doe', amount: 10000, method: 'USDT', status: 'completed', date: '2024-12-05', txHash: '0x4d5e6f...', proof: null }
]

// Mock Withdrawals
export const mockWithdrawals = [
    { id: 1, userId: 1, userName: 'John Doe', amount: 1000, method: 'USDT', wallet: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9', status: 'pending', date: '2024-12-12' },
    { id: 2, userId: 2, userName: 'Jane Smith', amount: 500, method: 'Bitcoin', wallet: 'bc1q42lja79elem0anu8q8s3h2n687re9jax556pcc', status: 'completed', date: '2024-12-09', txHash: '0x7g8h9i...' },
    { id: 3, userId: 3, userName: 'Mike Johnson', amount: 250, method: 'Ethereum', wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD45', status: 'pending', date: '2024-12-11' }
]

// Admin Roles
export const adminRoles = [
    { id: 1, name: 'Super Admin', slug: 'super_admin', permissions: ['all'], color: 'purple' },
    { id: 2, name: 'Finance Admin', slug: 'finance_admin', permissions: ['deposits', 'withdrawals', 'transactions'], color: 'green' },
    { id: 3, name: 'Support Admin', slug: 'support_admin', permissions: ['users', 'tickets'], color: 'cyan' }
]

// Dashboard Stats
export const dashboardStats = {
    user: {
        balance: 12500.00,
        activeRigs: 3,
        totalHashRate: 1850,
        hashUnit: 'MH/s',
        totalInvested: 15000.00,
        totalEarnings: 2850.50,
        pendingWithdrawals: 1000.00,
        miningPower: 850,
        dailyEarning: 125.50,
        monthlyEarning: 3765.00,
        rigsOwned: [
            { rigId: 1, name: 'Free Miner', hashRate: 10, status: 'mining' },
            { rigId: 3, name: 'Pro Rig', hashRate: 300, status: 'mining' },
            { rigId: 4, name: 'Elite Rig', hashRate: 1500, status: 'mining' }
        ]
    },
    admin: {
        totalUsers: 1250,
        activeUsers: 892,
        totalHashRate: 125000000,
        totalRigsSold: 3500,
        totalDeposits: 2500000,
        totalWithdrawals: 1850000,
        pendingDeposits: 45,
        pendingWithdrawals: 28,
        totalInvestments: 3200000,
        totalEarnings: 480000,
        newUsersToday: 15,
        revenueToday: 12500
    }
}

// Chart Data
export const earningsChartData = [
    { name: 'Mon', earnings: 85.50 },
    { name: 'Tue', earnings: 125.75 },
    { name: 'Wed', earnings: 98.20 },
    { name: 'Thu', earnings: 145.00 },
    { name: 'Fri', earnings: 178.30 },
    { name: 'Sat', earnings: 156.80 },
    { name: 'Sun', earnings: 135.45 }
]

export const adminChartData = {
    deposits: [
        { name: 'Jan', amount: 45000 },
        { name: 'Feb', amount: 52000 },
        { name: 'Mar', amount: 48000 },
        { name: 'Apr', amount: 61000 },
        { name: 'May', amount: 55000 },
        { name: 'Jun', amount: 67000 },
        { name: 'Jul', amount: 72000 },
        { name: 'Aug', amount: 85000 },
        { name: 'Sep', amount: 78000 },
        { name: 'Oct', amount: 92000 },
        { name: 'Nov', amount: 105000 },
        { name: 'Dec', amount: 125000 }
    ],
    users: [
        { name: 'Jan', count: 120 },
        { name: 'Feb', count: 185 },
        { name: 'Mar', count: 240 },
        { name: 'Apr', count: 310 },
        { name: 'May', count: 425 },
        { name: 'Jun', count: 520 },
        { name: 'Jul', count: 650 },
        { name: 'Aug', count: 780 },
        { name: 'Sep', count: 890 },
        { name: 'Oct', count: 1020 },
        { name: 'Nov', count: 1150 },
        { name: 'Dec', count: 1250 }
    ]
}

// System Settings
export const systemSettings = {
    appName: 'CryptoMine',
    appLogo: null,
    minDeposit: 100,
    maxDeposit: 100000,
    minWithdrawal: 50,
    maxWithdrawal: 50000,
    withdrawalFee: 2.5,
    referralBonus: 5,
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: false,
    kycRequired: false
}

// Mining Settings
export const miningSettings = {
    globalROI: 100,
    miningActive: true,
    maxDailyEarnings: 1000,
    earningsCap: 300,
    autoCompoundEnabled: true,
    compoundBonus: 2
}

// Support Tickets
export const mockTickets = [
    {
        id: 1,
        userId: 1,
        userName: 'John Doe',
        userEmail: 'john@example.com',
        subject: 'Withdrawal not received',
        category: 'withdrawal',
        priority: 'high',
        status: 'open',
        createdAt: '2024-12-12T10:30:00',
        updatedAt: '2024-12-12T14:00:00',
        messages: [
            { id: 1, sender: 'user', message: 'I made a withdrawal request 3 days ago but haven\'t received the funds yet. Transaction ID: WD-12345', timestamp: '2024-12-12T10:30:00' },
            { id: 2, sender: 'admin', message: 'Hello John, we are looking into this matter. Could you please provide the wallet address you used?', timestamp: '2024-12-12T14:00:00' }
        ]
    },
    {
        id: 2,
        userId: 2,
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        subject: 'How to purchase a mining rig?',
        category: 'general',
        priority: 'low',
        status: 'closed',
        createdAt: '2024-12-10T09:00:00',
        updatedAt: '2024-12-10T11:30:00',
        messages: [
            { id: 1, sender: 'user', message: 'Hi, I\'m new to the platform. Can you explain how I can purchase a mining rig?', timestamp: '2024-12-10T09:00:00' },
            { id: 2, sender: 'admin', message: 'Welcome Jane! Go to Mining Rigs section, choose your preferred rig, and click Purchase. You can use your wallet balance.', timestamp: '2024-12-10T10:15:00' },
            { id: 3, sender: 'user', message: 'Thank you! I got it working now.', timestamp: '2024-12-10T11:30:00' }
        ]
    },
    {
        id: 3,
        userId: 3,
        userName: 'Mike Johnson',
        userEmail: 'mike@example.com',
        subject: 'Deposit not showing in balance',
        category: 'deposit',
        priority: 'high',
        status: 'pending',
        createdAt: '2024-12-11T15:45:00',
        updatedAt: '2024-12-11T15:45:00',
        messages: [
            { id: 1, sender: 'user', message: 'I deposited $500 via Bitcoin 2 hours ago but my balance is still showing $0. Here is the TX hash: 0x1234abcd...', timestamp: '2024-12-11T15:45:00' }
        ]
    },
    {
        id: 4,
        userId: 1,
        userName: 'John Doe',
        userEmail: 'john@example.com',
        subject: 'Request for account verification',
        category: 'account',
        priority: 'medium',
        status: 'open',
        createdAt: '2024-12-09T12:00:00',
        updatedAt: '2024-12-09T12:00:00',
        messages: [
            { id: 1, sender: 'user', message: 'I would like to verify my account to increase my withdrawal limit. What documents do I need?', timestamp: '2024-12-09T12:00:00' }
        ]
    }
]

// Notifications
export const mockNotifications = [
    {
        id: 1,
        userId: 1,
        type: 'deposit',
        title: 'Deposit Approved',
        message: 'Your deposit of $5,000 has been approved and credited to your account.',
        isRead: false,
        createdAt: '2024-12-12T14:30:00'
    },
    {
        id: 2,
        userId: 1,
        type: 'earning',
        title: 'Mining Earnings',
        message: 'You earned $125.50 from your mining rigs today.',
        isRead: false,
        createdAt: '2024-12-12T12:00:00'
    },
    {
        id: 3,
        userId: 1,
        type: 'rig',
        title: 'Rig Activated',
        message: 'Your Pro Rig has been activated and is now mining.',
        isRead: true,
        createdAt: '2024-12-11T10:00:00'
    },
    {
        id: 4,
        userId: 1,
        type: 'withdrawal',
        title: 'Withdrawal Processing',
        message: 'Your withdrawal request of $1,000 is being processed.',
        isRead: true,
        createdAt: '2024-12-10T16:45:00'
    },
    {
        id: 5,
        userId: 1,
        type: 'system',
        title: 'System Maintenance',
        message: 'Scheduled maintenance on Dec 15, 2024 from 2:00 AM to 4:00 AM UTC.',
        isRead: true,
        createdAt: '2024-12-09T09:00:00'
    },
    {
        id: 6,
        userId: 1,
        type: 'referral',
        title: 'New Referral Bonus',
        message: 'You earned $50 referral bonus from Jane Smith\'s deposit.',
        isRead: false,
        createdAt: '2024-12-08T11:30:00'
    },
    {
        id: 7,
        userId: 1,
        type: 'promo',
        title: 'Special Offer',
        message: 'Get 20% bonus on deposits this weekend! Limited time offer.',
        isRead: true,
        createdAt: '2024-12-07T08:00:00'
    }
]

// Admin Notifications
export const adminNotifications = [
    {
        id: 1,
        type: 'deposit',
        title: 'New Deposit Request',
        message: 'Jane Smith submitted a deposit of $3,000',
        isRead: false,
        createdAt: '2024-12-12T14:00:00'
    },
    {
        id: 2,
        type: 'withdrawal',
        title: 'Withdrawal Request',
        message: 'John Doe requested withdrawal of $1,000',
        isRead: false,
        createdAt: '2024-12-12T11:30:00'
    },
    {
        id: 3,
        type: 'ticket',
        title: 'New Support Ticket',
        message: 'Mike Johnson created a high priority ticket',
        isRead: false,
        createdAt: '2024-12-11T15:45:00'
    },
    {
        id: 4,
        type: 'user',
        title: 'New User Registered',
        message: 'A new user has registered on the platform',
        isRead: true,
        createdAt: '2024-12-11T09:00:00'
    },
    {
        id: 5,
        type: 'system',
        title: 'Server Alert',
        message: 'High CPU usage detected on mining server',
        isRead: true,
        createdAt: '2024-12-10T22:00:00'
    }
]

