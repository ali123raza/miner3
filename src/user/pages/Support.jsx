import { useState, useEffect } from 'react'
import { Plus, MessageSquare, Clock, Send, X, AlertCircle, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function Support() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [creating, setCreating] = useState(false)
    const [newTicket, setNewTicket] = useState({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: ''
    })

    const categories = [
        { value: 'general', label: 'General Inquiry' },
        { value: 'deposit', label: 'Deposit Issue' },
        { value: 'withdrawal', label: 'Withdrawal Issue' },
        { value: 'account', label: 'Account Related' },
        { value: 'technical', label: 'Technical Problem' }
    ]

    const priorityColors = {
        low: 'bg-accent-green/20 text-accent-green',
        medium: 'bg-accent-yellow/20 text-accent-yellow',
        high: 'bg-accent-red/20 text-accent-red'
    }

    const statusColors = {
        open: 'badge-info',
        pending: 'badge-warning',
        closed: 'badge-success'
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await api.getTickets()
            if (res.success && Array.isArray(res.data)) {
                setTickets(res.data)
            } else {
                setTickets([])
            }
        } catch (error) {
            console.error('Failed to fetch tickets:', error)
            setTickets([])
        } finally {
            setLoading(false)
        }
    }

    const fetchTicketDetails = async (ticketId) => {
        try {
            const res = await api.getTicket(ticketId)
            if (res.success && res.data) {
                setSelectedTicket(res.data)
            }
        } catch (error) {
            console.error('Failed to fetch ticket:', error)
        }
    }

    const handleCreateTicket = async () => {
        setCreating(true)
        try {
            const res = await api.createTicket(
                newTicket.subject,
                newTicket.category,
                newTicket.priority,
                newTicket.message
            )
            if (res.success) {
                fetchTickets()
                setShowCreateModal(false)
                setNewTicket({ subject: '', category: 'general', priority: 'medium', message: '' })
            }
        } catch (error) {
            console.error('Failed to create ticket:', error)
        } finally {
            setCreating(false)
        }
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return
        setSending(true)

        try {
            const res = await api.sendTicketMessage(selectedTicket.id, newMessage)
            if (res.success) {
                await fetchTicketDetails(selectedTicket.id)
                setNewMessage('')
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setSending(false)
        }
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
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
            <div className="glass-card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Support Center</h1>
                        <p className="text-gray-400">Get help with your account and transactions</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchTickets} className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="glass-card p-4">
                    <div className="text-sm text-gray-400 mb-1">Open Tickets</div>
                    <div className="text-2xl font-bold text-accent-cyan">{tickets.filter(t => t.status === 'open').length}</div>
                </div>
                <div className="glass-card p-4">
                    <div className="text-sm text-gray-400 mb-1">Pending Response</div>
                    <div className="text-2xl font-bold text-accent-yellow">{tickets.filter(t => t.status === 'pending').length}</div>
                </div>
                <div className="glass-card p-4">
                    <div className="text-sm text-gray-400 mb-1">Resolved</div>
                    <div className="text-2xl font-bold text-accent-green">{tickets.filter(t => t.status === 'closed').length}</div>
                </div>
            </div>

            {/* Ticket List & Chat */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Ticket List */}
                <div className="glass-card p-4 lg:col-span-1">
                    <h2 className="text-lg font-semibold text-white mb-4">Your Tickets</h2>

                    {tickets.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400">No tickets yet</p>
                            <button onClick={() => setShowCreateModal(true)} className="text-accent-cyan text-sm mt-2">
                                Create your first ticket
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {tickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => fetchTicketDetails(ticket.id)}
                                    className={`w-full text-left p-4 rounded-xl transition-all ${selectedTicket?.id === ticket.id
                                        ? 'bg-accent-cyan/10 border border-accent-cyan/30'
                                        : 'bg-card-hover hover:bg-card'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className={`badge ${statusColors[ticket.status]}`}>{ticket.status}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[ticket.priority]}`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-medium mb-1 truncate">{ticket.subject}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(ticket.updated_at || ticket.created_at)}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="glass-card p-4 lg:col-span-2 flex flex-col h-[600px]">
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-glass-border">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{selectedTicket.subject}</h2>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className="capitalize">{selectedTicket.category}</span>
                                        <span>•</span>
                                        <span>Created {formatDate(selectedTicket.created_at)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="lg:hidden p-2 rounded-lg hover:bg-card-hover"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                                {(selectedTicket.messages || []).map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] ${msg.sender === 'user'
                                            ? 'bg-accent-cyan/20 text-white'
                                            : 'bg-card-hover text-gray-200'
                                            } rounded-2xl px-4 py-3`}>
                                            <p className="text-sm">{msg.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(msg.created_at || msg.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            {selectedTicket.status !== 'closed' && (
                                <div className="flex gap-2 pt-4 border-t border-glass-border">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..."
                                        className="input-field flex-1"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() || sending}
                                        className="btn-primary px-4 disabled:opacity-50"
                                    >
                                        {sending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </button>
                                </div>
                            )}

                            {selectedTicket.status === 'closed' && (
                                <div className="flex items-center gap-2 py-4 text-gray-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    This ticket has been closed
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">Select a ticket to view the conversation</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-card w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Create Support Ticket</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    className="input-field"
                                    placeholder="Brief description of your issue"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={newTicket.category}
                                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                        className="input-field"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={newTicket.priority}
                                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <textarea
                                    value={newTicket.message}
                                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                                    className="input-field min-h-[120px] resize-none"
                                    placeholder="Describe your issue in detail..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateTicket}
                                disabled={!newTicket.subject || !newTicket.message || creating}
                                className="btn-primary flex-1 disabled:opacity-50"
                            >
                                {creating ? 'Creating...' : 'Submit Ticket'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
