import { useState } from 'react'
import { Shield, Users, Edit2, Trash2, Plus, Check } from 'lucide-react'
import { adminRoles } from '../../data/mockData'

export default function Roles() {
    const [roles, setRoles] = useState(adminRoles)
    const [showModal, setShowModal] = useState(false)
    const [editingRole, setEditingRole] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        permissions: [],
        color: 'purple'
    })

    const allPermissions = [
        { id: 'users', label: 'User Management' },
        { id: 'deposits', label: 'Deposit Management' },
        { id: 'withdrawals', label: 'Withdrawal Management' },
        { id: 'transactions', label: 'View Transactions' },
        { id: 'plans', label: 'Manage Plans' },
        { id: 'mining', label: 'Mining Controls' },
        { id: 'settings', label: 'System Settings' },
        { id: 'roles', label: 'Admin Roles' },
        { id: 'tickets', label: 'Support Tickets' },
    ]

    const colorOptions = ['purple', 'green', 'cyan', 'pink', 'orange', 'yellow']

    const colorMap = {
        purple: 'bg-accent-purple',
        green: 'bg-accent-green',
        cyan: 'bg-accent-cyan',
        pink: 'bg-accent-pink',
        orange: 'bg-accent-orange',
        yellow: 'bg-accent-yellow'
    }

    const handleEdit = (role) => {
        setEditingRole(role)
        setFormData({
            name: role.name,
            slug: role.slug,
            permissions: role.permissions,
            color: role.color
        })
        setShowModal(true)
    }

    const handleCreate = () => {
        setEditingRole(null)
        setFormData({
            name: '',
            slug: '',
            permissions: [],
            color: 'purple'
        })
        setShowModal(true)
    }

    const handleSave = () => {
        const newRole = {
            id: editingRole?.id || Date.now(),
            ...formData,
            slug: formData.name.toLowerCase().replace(/\s+/g, '_')
        }

        if (editingRole) {
            setRoles(roles.map(r => r.id === editingRole.id ? newRole : r))
        } else {
            setRoles([...roles, newRole])
        }
        setShowModal(false)
    }

    const handleDelete = (id) => {
        if (id === 1) {
            alert('Cannot delete Super Admin role')
            return
        }
        if (confirm('Are you sure you want to delete this role?')) {
            setRoles(roles.filter(r => r.id !== id))
        }
    }

    const togglePermission = (permId) => {
        if (formData.permissions.includes('all')) {
            setFormData({ ...formData, permissions: [permId] })
        } else if (formData.permissions.includes(permId)) {
            setFormData({ ...formData, permissions: formData.permissions.filter(p => p !== permId) })
        } else {
            setFormData({ ...formData, permissions: [...formData.permissions, permId] })
        }
    }

    const selectAllPermissions = () => {
        setFormData({ ...formData, permissions: ['all'] })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-card p-6 border-accent-purple/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Admin Roles</h1>
                        <p className="text-gray-400">Manage admin roles and permissions</p>
                    </div>
                    <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Role
                    </button>
                </div>
            </div>

            {/* Roles grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                    <div key={role.id} className="glass-card p-6 border-accent-purple/10">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${colorMap[role.color]} flex items-center justify-center`}>
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(role)}
                                    className="p-2 rounded-lg hover:bg-card-hover text-gray-400 hover:text-white"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(role.id)}
                                    className="p-2 rounded-lg hover:bg-accent-red/10 text-gray-400 hover:text-accent-red"
                                    disabled={role.id === 1}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{role.name}</h3>
                        <code className="text-xs text-gray-400 bg-card-hover px-2 py-1 rounded mb-4 inline-block">
                            {role.slug}
                        </code>

                        <div className="space-y-2 mt-4">
                            <div className="text-sm text-gray-400 mb-2">Permissions:</div>
                            {role.permissions.includes('all') ? (
                                <span className="badge badge-success">All Permissions</span>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((perm) => (
                                        <span key={perm} className="badge badge-purple text-xs">{perm}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingRole ? 'Edit Role' : 'Create New Role'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Content Manager"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                                <div className="flex gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-10 h-10 rounded-xl ${colorMap[color]} transition-all ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-primary' : ''
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-300">Permissions</label>
                                    <button
                                        type="button"
                                        onClick={selectAllPermissions}
                                        className="text-xs text-accent-cyan hover:underline"
                                    >
                                        Select All
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    <div
                                        onClick={selectAllPermissions}
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${formData.permissions.includes('all') ? 'bg-accent-green/20 border border-accent-green/30' : 'bg-card-hover hover:bg-card'
                                            }`}
                                    >
                                        <span className="text-white font-medium">All Permissions (Super Admin)</span>
                                        {formData.permissions.includes('all') && <Check className="w-5 h-5 text-accent-green" />}
                                    </div>

                                    {allPermissions.map((perm) => (
                                        <div
                                            key={perm.id}
                                            onClick={() => togglePermission(perm.id)}
                                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${formData.permissions.includes(perm.id) && !formData.permissions.includes('all')
                                                    ? 'bg-accent-purple/20 border border-accent-purple/30'
                                                    : 'bg-card-hover hover:bg-card'
                                                }`}
                                        >
                                            <span className="text-white">{perm.label}</span>
                                            {formData.permissions.includes(perm.id) && !formData.permissions.includes('all') && (
                                                <Check className="w-5 h-5 text-accent-purple" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="btn-primary flex-1">
                                {editingRole ? 'Save Changes' : 'Create Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
