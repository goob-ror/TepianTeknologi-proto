import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, X, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback } from 'react';

interface Order {
    id: number;
    user: {
        id: number;
        nama_lengkap?: string;
        name?: string;
        email: string;
    };
    nama_penerima: string;
    alamat: string;
    no_hp_penerima?: string;
    catatan?: string;
    status: 'menunggu';
    total_harga: number;
    created_at: string;
    updated_at: string;
    details_count?: number;
}

interface Props {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Orders',
        href: '/admin/orders',
    },
    {
        title: 'Pending Orders',
        href: '/admin/orders/pending',
    },
];

export default function PendingOrders({ orders, filters = {} }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [currentTime, setCurrentTime] = useState(new Date());

    const handleSearch = useCallback(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        router.get(`/admin/orders/pending?${params.toString()}`);
    }, [searchTerm]);

    const handleClearFilters = () => {
        setSearchTerm('');
        router.get('/admin/orders/pending');
    };

    const handleQuickApprove = (orderId: number, customerName: string) => {
        if (confirm(`Mark order #${orderId} from ${customerName} as paid?`)) {
            router.patch(`/admin/orders/${orderId}/status`, {
                status: 'dibayar',
                catatan: 'Quick approved from pending orders page'
            }, {
                onSuccess: () => {
                    router.reload();
                }
            });
        }
    };

    // Real-time clock update every 30 seconds for more accurate age display
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm, filters.search, handleSearch]);

    const formatCurrency = (amount: number | string | null | undefined) => {
        const numericAmount = parseFloat(amount?.toString() || '0') || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(numericAmount);
    };

    const getOrderAge = (createdAt: string) => {
        const orderDate = new Date(createdAt);
        const diffInMs = currentTime.getTime() - orderDate.getTime();
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInSeconds < 30) return 'Just now';
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays === 1) return '1 day ago';
        return `${diffInDays} days ago`;
    };

    const isUrgent = (createdAt: string) => {
        const orderDate = new Date(createdAt);
        const diffInHours = (currentTime.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
        return diffInHours > 24; // Orders older than 24 hours are urgent
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Pending Orders</h1>
                        <p className="text-gray-400">Orders waiting for payment confirmation</p>
                    </div>
                    <Link href="/admin/orders">
                        <Button variant="outline">
                            View All Orders
                        </Button>
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <Clock className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Total Pending</p>
                                    <p className="text-2xl font-bold text-yellow-400">{orders.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg">
                                    <AlertTriangle className="h-5 w-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Urgent (&gt;24h)</p>
                                    <p className="text-2xl font-bold text-red-400">
                                        {orders.data.filter(order => isUrgent(order.created_at)).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Total Value</p>
                                    <p className="text-lg font-bold text-green-400">
                                        {formatCurrency(orders.data.reduce((sum, order) => {
                                            const price = parseFloat(order.total_harga?.toString() || '0');
                                            return sum + (isNaN(price) ? 0 : price);
                                        }, 0))}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-yellow-300 flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Pending Orders ({orders.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search Section */}
                        <div className="mb-6">
                            <div className="flex gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search pending orders..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Clear
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium text-blue-300">Order ID</th>
                                        <th className="text-left p-3 font-medium text-green-300">Customer</th>
                                        <th className="text-left p-3 font-medium text-yellow-300">Recipient</th>
                                        <th className="text-left p-3 font-medium text-purple-300">Total</th>
                                        <th className="text-left p-3 font-medium text-pink-300">Age</th>
                                        <th className="text-left p-3 font-medium text-cyan-300">Priority</th>
                                        <th className="text-right p-3 font-medium text-orange-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.length > 0 ? orders.data.map((order) => {
                                        const urgent = isUrgent(order.created_at);
                                        return (
                                            <tr key={order.id} className={`border-b hover:bg-muted/20 transition-colors ${urgent ? 'bg-red-500/5' : ''}`}>
                                                <td className="p-3">
                                                    <div className="font-medium">#{order.id}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div>
                                                        <div className="font-medium">{order.user.nama_lengkap || order.user.name}</div>
                                                        <div className="text-sm text-gray-400">{order.user.email}</div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div>
                                                        <div className="font-medium">{order.nama_penerima}</div>
                                                        {order.no_hp_penerima && (
                                                            <div className="text-sm text-gray-400">{order.no_hp_penerima}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-medium">{formatCurrency(order.total_harga)}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm">{getOrderAge(order.created_at)}</div>
                                                </td>
                                                <td className="p-3">
                                                    {urgent ? (
                                                        <Badge variant="outline" className="border-red-500 text-red-300">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Urgent
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-yellow-500 text-yellow-300">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            Normal
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2 justify-end">
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleQuickApprove(order.id, order.user.nama_lengkap || order.user.name || 'Unknown')}
                                                            className="admin-bg-green"
                                                            title="Quick Approve"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle className="h-12 w-12 text-green-500" />
                                                    <p>No pending orders! All orders are processed.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-400">
                                    Showing {((orders.current_page - 1) * orders.per_page) + 1} to {Math.min(orders.current_page * orders.per_page, orders.total)} of {orders.total} pending orders
                                </div>
                                <div className="flex gap-2">
                                    {orders.current_page > 1 && (
                                        <Link href={`/admin/orders/pending?page=${orders.current_page - 1}`}>
                                            <Button variant="outline" size="sm">Previous</Button>
                                        </Link>
                                    )}
                                    {orders.current_page < orders.last_page && (
                                        <Link href={`/admin/orders/pending?page=${orders.current_page + 1}`}>
                                            <Button variant="outline" size="sm">Next</Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
