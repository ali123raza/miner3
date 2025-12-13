import { useState, useEffect } from 'react'
import { Search, MessageSquare, Clock, Send, CheckCircle, RefreshCw } from 'lucide-react'
import api from '../../services/api'

export default function AdminTickets() {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [priorityFilter, setPriorityFilter] = useState('all')
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await api.adminGetTickets()
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

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ticket.user_name || '').toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
    })

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

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return
        setSending(true)

        try {
            const res = await api.adminReplyTicket(selectedTicket.id, newMessage)
            if (res.success) {
                await fetchTickets()
                const updated = tickets.find(t => t.id === selectedTicket.id)
                if (updated) setSelectedTicket({ ...updated, messages: [...(updated.messages || []), { id: Date.now(), sender: 'admin', message: newMessage, created_at: new Date().toISOString() }] })
                setNewMessage('')
            }
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setSending(false)
        }
    }

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const res = await api.adminCloseTicket(ticketId)
            if (res.success) {
                setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t))
                if (selectedTicket?.id === ticketId) {
                    setSelectedTicket({ ...selectedTicket, status: 'closed' })
                }
            }
        } catch (error) {
            console.error('Failed to update ticket:', error)
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

    const openCount = tickets.filter(t => t.status === 'open').length
    const pendingCount = tickets.filter(t => t.status === 'pending').length
    const highPriorityCount = tickets.filter(t => t.priority === 'high' && t.status !== 'closed').length

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
            <div className="glass-card p-6 border-accent-purple/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
                        <p className="text-gray-400">Manage and respond to user support requests</p>
                    </div>
                    <button onClick={fetchTickets} className="btn-secondary flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-4 gap-4">
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Total Tickets</div>
                    <div className="text-2xl font-bold text-white">{tickets.length}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Open</div>
                    <div className="text-2xl font-bold text-accent-cyan">{openCount}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">Pending Response</div>
                    <div className="text-2xl font-bold text-accent-yellow">{pendingCount}</div>
                </div>
                <div className="glass-card p-4 border-accent-purple/10">
                    <div className="text-sm text-gray-400 mb-1">High Priority</div>
                    <div className="text-2xl font-bold text-accent-red">{highPriorityCount}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 border-accent-purple/10">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field w-full md:w-40"
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="input-field w-full md:w-40"
                    >
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            {/* Tickets Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Ticket List */}
                <div className="glass-card p-4 border-accent-purple/10 lg:col-span-1 max-h-[700px] overflow-y-auto">
                    <h2 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-primary-light py-2">
                        Tickets ({filteredTickets.length})
                    </h2>

                    {filteredTickets.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">No tickets found</div>
                    ) : (
                        <div className="space-y-2">
                            {filteredTickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`w-full text-left p-4 rounded-xl transition-all ${selectedTicket?.id === ticket.id
                                        ? 'bg-accent-purple/10 border border-accent-purple/30'
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
                                    <p className="text-sm text-gray-400 mb-2">{ticket.user_name || 'Unknown User'}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(ticket.updated_at || ticket.created_at)}
                                        <span className="ml-auto flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            {(ticket.messages || []).length}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Chat Area */}
                <div className="glass-card p-4 border-accent-purple/10 lg:col-span-2 flex flex-col h-[700px]">
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="flex items-start justify-between pb-4 border-b border-glass-border">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-lg font-semibold text-white">{selectedTicket.subject}</h2>
                                        <span className={`badge ${statusColors[selectedTicket.status]}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                                        <span>{selectedTicket.user_name || 'Unknown'}</span>
                                        <span>•</span>
                                        <span className="capitalize">{selectedTicket.category}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {selectedTicket.status !== 'closed' && (
                                        <button
                                            onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                                            className="px-3 py-2 rounded-lg bg-accent-green/10 text-accent-green hover:bg-accent-green/20 flex items-center gap-2 text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Close
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                                {(selectedTicket.messages || []).map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] ${msg.sender === 'admin'
                                            ? 'bg-accent-purple/20 text-white'
                                            : 'bg-card-hover text-gray-200'
                                            } rounded-2xl px-4 py-3`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium text-gray-400">
                                                    {msg.sender === 'admin' ? 'You' : selectedTicket.user_name || 'User'}
                                                </span>
                                            </div>
                                            <p className="text-sm">{msg.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(msg.created_at || msg.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input */}
                            {selectedTicket.status !== 'closed' && (
                                <div className="flex gap-2 pt-4 border-t border-glass-border">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your reply..."
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
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400">Select a ticket to view and respond</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
