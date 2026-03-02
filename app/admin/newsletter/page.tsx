'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Users,
    UserCheck,
    UserX,
    Search,
    Filter,
    Download,
    Plus,
    Edit,
    Trash2,
    Eye,
    Calendar,
    TrendingUp,
    MoreVertical
} from 'lucide-react';

interface Subscriber {
    _id: string;
    email: string;
    name: string;
    status: 'active' | 'unsubscribed' | 'bounced';
    source: string;
    subscribedAt: string;
    unsubscribedAt?: string;
    preferences: {
        productUpdates: boolean;
        promotions: boolean;
        healthTips: boolean;
        weeklyNewsletter: boolean;
    };
    tags: string[];
}

interface Statistics {
    total: number;
    active: number;
    unsubscribed: number;
    bounced: number;
}

export default function AdminNewsletterPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [statistics, setStatistics] = useState<Statistics>({
        total: 0,
        active: 0,
        unsubscribed: 0,
        bounced: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchSubscribers();
    }, [currentPage, statusFilter, searchTerm]);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '20',
                status: statusFilter,
                search: searchTerm,
            });

            const response = await fetch(`/api/admin/newsletter?${params}`);
            if (response.ok) {
                const data = await response.json();
                setSubscribers(data.subscribers);
                setStatistics(data.statistics);
                setTotalPages(data.pagination.pages);
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSubscriber = async (subscriberId: string) => {
        if (!confirm('Are you sure you want to delete this subscriber?')) return;

        try {
            const response = await fetch(`/api/admin/newsletter?id=${subscriberId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchSubscribers();
            } else {
                alert('Failed to delete subscriber');
            }
        } catch (error) {
            console.error('Error deleting subscriber:', error);
            alert('Failed to delete subscriber');
        }
    };

    const handleUpdateSubscriber = async (subscriberId: string, updates: Partial<Subscriber>) => {
        try {
            const response = await fetch(`/api/admin/newsletter/${subscriberId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                fetchSubscribers();
                setShowEditModal(false);
                setSelectedSubscriber(null);
            } else {
                alert('Failed to update subscriber');
            }
        } catch (error) {
            console.error('Error updating subscriber:', error);
            alert('Failed to update subscriber');
        }
    };

    const exportSubscribers = async () => {
        try {
            const params = new URLSearchParams({
                status: statusFilter,
                search: searchTerm,
                export: 'true',
            });

            const response = await fetch(`/api/admin/newsletter/export?${params}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error exporting subscribers:', error);
            alert('Failed to export subscribers');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-400 bg-green-400/20 border-green-400/30';
            case 'unsubscribed':
                return 'text-red-400 bg-red-400/20 border-red-400/30';
            case 'bounced':
                return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
            default:
                return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
                        Newsletter Management
                    </h1>
                    <p className="text-gray-400">Manage your newsletter subscribers and campaigns</p>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={exportSubscribers}
                        className="flex items-center space-x-2 border border-white/20 text-white px-4 py-2 font-bold uppercase tracking-wider text-sm hover:border-primary-400 hover:text-primary-400 transition-colors"
                    >
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center space-x-2 bg-primary-400 text-black px-4 py-2 font-bold uppercase tracking-wider text-sm hover:bg-primary-500 transition-colors"
                    >
                        <Plus size={16} />
                        <span>Add Subscriber</span>
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Subscribers', value: statistics.total, icon: Users, color: 'text-blue-400' },
                    { label: 'Active', value: statistics.active, icon: UserCheck, color: 'text-green-400' },
                    { label: 'Unsubscribed', value: statistics.unsubscribed, icon: UserX, color: 'text-red-400' },
                    { label: 'Bounced', value: statistics.bounced, icon: Mail, color: 'text-yellow-400' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-jet-900 border border-white/20 p-6 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-primary-400/20"></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value.toLocaleString('en-IN')}</p>
                            </div>
                            <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filters and Search */}
            <div className="bg-jet-900 border border-white/20 p-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search subscribers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-black border border-white/20 text-white pl-10 pr-4 py-2 focus:border-primary-400 focus:outline-none transition-colors w-full sm:w-64"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-black border border-white/20 text-white px-4 py-2 focus:border-primary-400 focus:outline-none transition-colors"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="unsubscribed">Unsubscribed</option>
                            <option value="bounced">Bounced</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Subscribers Table */}
            <div className="bg-jet-900 border border-white/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black border-b border-white/20">
                            <tr>
                                <th className="text-left py-4 px-6 text-white font-bold uppercase tracking-wider text-sm">
                                    Subscriber
                                </th>
                                <th className="text-left py-4 px-6 text-white font-bold uppercase tracking-wider text-sm">
                                    Status
                                </th>
                                <th className="text-left py-4 px-6 text-white font-bold uppercase tracking-wider text-sm">
                                    Source
                                </th>
                                <th className="text-left py-4 px-6 text-white font-bold uppercase tracking-wider text-sm">
                                    Subscribed
                                </th>
                                <th className="text-left py-4 px-6 text-white font-bold uppercase tracking-wider text-sm">
                                    Preferences
                                </th>
                                <th className="text-right py-4 px-6 text-white font-bold uppercase tracking-wider text-sm">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        No subscribers found
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((subscriber) => (
                                    <tr key={subscriber._id} className="border-b border-white/10 hover:bg-white/5">
                                        <td className="py-4 px-6">
                                            <div>
                                                <div className="text-white font-medium">{subscriber.name || 'N/A'}</div>
                                                <div className="text-gray-400 text-sm">{subscriber.email}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border ${getStatusColor(subscriber.status)}`}>
                                                {subscriber.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-300 capitalize">{subscriber.source}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-300 text-sm">
                                                {new Date(subscriber.subscribedAt).toLocaleDateString('en-IN')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex space-x-1">
                                                {Object.entries(subscriber.preferences).map(([key, value]) => (
                                                    value && (
                                                        <span key={key} className="w-2 h-2 bg-primary-400 rounded-full" title={key}></span>
                                                    )
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubscriber(subscriber);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="text-gray-400 hover:text-primary-400 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSubscriber(subscriber._id)}
                                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
                        <div className="text-gray-400 text-sm">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-400 hover:text-primary-400 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-400 hover:text-primary-400 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}