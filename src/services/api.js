const API_BASE_URL = 'http://localhost:8000';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    removeToken() {
        localStorage.removeItem('token');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = this.getToken();

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.data?.token) {
            this.setToken(data.data.token);
        }
        return data;
    }

    async getPublicPlans() {
        return this.request('/plans');
    }

    async register(name, email, password, referredBy = null) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, referred_by: referredBy }),
        });
        if (data.data?.token) {
            this.setToken(data.data.token);
        }
        return data;
    }

    async getMe() {
        return this.request('/auth/me');
    }

    logout() {
        this.removeToken();
    }

    // User endpoints
    async getDashboard() {
        return this.request('/user/dashboard');
    }

    async getRigs() {
        return this.request('/user/rigs');
    }

    async purchaseRig(rigId) {
        return this.request('/user/rigs/purchase', {
            method: 'POST',
            body: JSON.stringify({ rig_id: rigId }),
        });
    }

    async collectEarnings() {
        return this.request('/user/collect-earnings', {
            method: 'POST'
        });
    }

    async getDeposits() {
        return this.request('/user/deposits');
    }

    async createDeposit(amount, methodId, proof) {
        return this.request('/user/deposits', {
            method: 'POST',
            body: JSON.stringify({ amount, method_id: methodId, proof }),
        });
    }

    async getWithdrawals() {
        return this.request('/user/withdrawals');
    }

    async createWithdrawal(amount, methodId, walletAddress) {
        return this.request('/user/withdrawals', {
            method: 'POST',
            body: JSON.stringify({ amount, method_id: methodId, wallet_address: walletAddress }),
        });
    }

    async getTransactions() {
        return this.request('/user/transactions');
    }

    async getNotifications() {
        return this.request('/user/notifications');
    }

    async markNotificationRead(id) {
        return this.request(`/user/notifications/${id}/read`, { method: 'PUT' });
    }

    async markAllNotificationsRead() {
        return this.request('/user/notifications/read-all', { method: 'PUT' });
    }

    // Tickets
    async getTickets() {
        return this.request('/tickets');
    }

    async createTicket(subject, category, priority, message) {
        return this.request('/tickets', {
            method: 'POST',
            body: JSON.stringify({ subject, category, priority, message }),
        });
    }

    async getTicket(id) {
        return this.request(`/tickets/${id}`);
    }

    async sendTicketMessage(ticketId, message) {
        return this.request(`/tickets/${ticketId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    }

    // Payment Methods
    async getPaymentMethods() {
        return this.request('/payment-methods');
    }

    // Admin endpoints
    async adminGetDashboard() {
        return this.request('/admin/dashboard');
    }

    async adminGetTransactions() {
        return this.request('/admin/transactions');
    }

    async adminGetUsers() {
        return this.request('/admin/users');
    }

    async adminUpdateUser(id, data) {
        return this.request(`/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async adminGetRigs() {
        return this.request('/admin/rigs');
    }

    async adminCreateRig(data) {
        return this.request('/admin/rigs', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async adminUpdateRig(id, data) {
        return this.request(`/admin/rigs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async adminDeleteRig(id) {
        return this.request(`/admin/rigs/${id}`, { method: 'DELETE' });
    }

    async adminGetDeposits() {
        return this.request('/admin/deposits');
    }

    async adminApproveDeposit(id) {
        return this.request(`/admin/deposits/${id}/approve`, { method: 'PUT' });
    }

    async adminRejectDeposit(id) {
        return this.request(`/admin/deposits/${id}/reject`, { method: 'PUT' });
    }

    async adminGetWithdrawals() {
        return this.request('/admin/withdrawals');
    }

    async adminApproveWithdrawal(id, txHash) {
        return this.request(`/admin/withdrawals/${id}/approve`, {
            method: 'PUT',
            body: JSON.stringify({ tx_hash: txHash }),
        });
    }

    async adminRejectWithdrawal(id) {
        return this.request(`/admin/withdrawals/${id}/reject`, { method: 'PUT' });
    }

    async adminGetTickets() {
        return this.request('/admin/tickets');
    }

    async adminReplyTicket(id, message) {
        return this.request(`/admin/tickets/${id}/reply`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    }

    async adminCloseTicket(id) {
        return this.request(`/admin/tickets/${id}/close`, { method: 'PUT' });
    }

    async adminGetSettings() {
        return this.request('/admin/settings');
    }

    async adminUpdateSettings(settings) {
        return this.request('/admin/settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    // Admin Payment Methods
    async adminCreatePaymentMethod(data) {
        return this.request('/admin/payment-methods', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async adminUpdatePaymentMethod(id, data) {
        return this.request(`/admin/payment-methods/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async adminDeletePaymentMethod(id) {
        return this.request(`/admin/payment-methods/${id}`, { method: 'DELETE' });
    }
}

export const api = new ApiService();
export default api;
