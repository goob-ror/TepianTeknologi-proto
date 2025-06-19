import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Search, Filter, X, Download, Calendar, ShoppingCart, Package, Truck, CheckCircle, XCircle, Clock, FileSpreadsheet, AlertTriangle, ChevronsUpDown, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
    status: 'menunggu' | 'dibayar' | 'dikirim' | 'selesai' | 'dibatalkan';
    total_harga: number;
    created_at: string;
    updated_at: string;
    details_count?: number;
}

interface Props {
    orders: {
        data?: Order[];
        current_page?: number;
        last_page?: number;
        per_page?: number;
        total?: number;
    };
    filters?: {
        search?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
        sort_by?: string;
        sort_order?: string;
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
];

const statusConfig = {
    menunggu: { label: 'Pending', color: 'border-yellow-500 text-yellow-300', icon: Clock },
    dibayar: { label: 'Paid', color: 'border-blue-500 text-blue-300', icon: CheckCircle },
    dikirim: { label: 'Shipped', color: 'border-purple-500 text-purple-300', icon: Truck },
    selesai: { label: 'Completed', color: 'border-green-500 text-green-300', icon: Package },
    dibatalkan: { label: 'Cancelled', color: 'border-red-500 text-red-300', icon: XCircle },
};

export default function OrdersIndex({ orders, filters = {} }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'asc');
    const [pendingInfo, setPendingInfo] = useState({ pending_count: 0, has_pending: false, message: 'Loading...' });
    const [isLoadingPending, setIsLoadingPending] = useState(true);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);

        router.get(`/admin/orders?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        setDateFrom('');
        setDateTo('');
        setSortBy('id');
        setSortOrder('asc');
        router.get('/admin/orders');
    };

    const handleExport = (format: 'csv' | 'excel' = 'csv') => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        params.append('format', format);

        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = `/admin/orders/export?${params.toString()}`;
        link.download = `orders_export_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSort = (column: string) => {
        let newSortOrder = 'asc';

        if (sortBy === column) {
            newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }

        setSortBy(column);
        setSortOrder(newSortOrder);

        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        params.append('sort_by', column);
        params.append('sort_order', newSortOrder);

        router.get(`/admin/orders?${params.toString()}`);
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) {
            return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
        }
        return sortOrder === 'asc'
            ? <ChevronUp className="h-4 w-4 text-blue-600" />
            : <ChevronDown className="h-4 w-4 text-blue-600" />;
    };

    const fetchPendingInfo = async () => {
        try {
            setIsLoadingPending(true);
            const response = await axios.get('/admin/orders/pending-count');
            setPendingInfo(response.data);
        } catch (error) {
            console.error('Failed to fetch pending orders info:', error);
            setPendingInfo({ pending_count: 0, has_pending: false, message: 'Error loading' });
        } finally {
            setIsLoadingPending(false);
        }
    };

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    useEffect(() => {
        fetchPendingInfo();
        // Refresh pending info every 30 seconds
        const interval = setInterval(fetchPendingInfo, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Orders Management</h1>
                    <div className="flex gap-2">
                        {/* Export Dropdown */}
                        <div className="relative group">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="p-1">
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Export as CSV
                                    </button>
                                    <button
                                        onClick={() => handleExport('excel')}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded flex items-center gap-2"
                                    >
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Export as Excel
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Pending Orders Button */}
                        <Link href="/admin/orders/pending">
                            <Button
                                className={`flex items-center gap-2 ${
                                    isLoadingPending
                                        ? 'admin-bg-gray'
                                        : pendingInfo.has_pending
                                            ? 'admin-bg-yellow'
                                            : 'admin-bg-green'
                                }`}
                                disabled={isLoadingPending}
                            >
                                {isLoadingPending ? (
                                    <>
                                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                                        Loading...
                                    </>
                                ) : pendingInfo.has_pending ? (
                                    <>
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        {pendingInfo.message}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {pendingInfo.message}
                                    </>
                                )}
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-blue-300 flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            All Orders ({orders?.total || 0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search and Filter Section */}
                        <div className="mb-6 space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by customer, recipient, or phone..."
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
                                    Clear Filters
                                </Button>
                            </div>

                            {/* Filter Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Status Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Status</label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="menunggu">Pending</SelectItem>
                                            <SelectItem value="dibayar">Paid</SelectItem>
                                            <SelectItem value="dikirim">Shipped</SelectItem>
                                            <SelectItem value="selesai">Completed</SelectItem>
                                            <SelectItem value="dibatalkan">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Date From Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">From Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Date To Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">To Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="flex justify-end">
                                <Button onClick={handleSearch} className="flex items-center gap-2 admin-bg-blue">
                                    <Filter className="h-4 w-4" />
                                    Apply Filters
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3">
                                            <button
                                                onClick={() => handleSort('id')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium text-blue-300"
                                            >
                                                Order ID
                                                {getSortIcon('id')}
                                            </button>
                                        </th>
                                        <th className="text-left p-3 font-medium text-green-300">Customer</th>
                                        <th className="text-left p-3">
                                            <button
                                                onClick={() => handleSort('nama_penerima')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium text-yellow-300"
                                            >
                                                Recipient
                                                {getSortIcon('nama_penerima')}
                                            </button>
                                        </th>
                                        <th className="text-left p-3">
                                            <button
                                                onClick={() => handleSort('status')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium text-purple-300"
                                            >
                                                Status
                                                {getSortIcon('status')}
                                            </button>
                                        </th>
                                        <th className="text-left p-3">
                                            <button
                                                onClick={() => handleSort('total_harga')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium text-pink-300"
                                            >
                                                Total
                                                {getSortIcon('total_harga')}
                                            </button>
                                        </th>
                                        <th className="text-left p-3">
                                            <button
                                                onClick={() => handleSort('created_at')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium text-cyan-300"
                                            >
                                                Date
                                                {getSortIcon('created_at')}
                                            </button>
                                        </th>
                                        <th className="text-right p-3 font-medium text-orange-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!orders ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                                Loading orders...
                                            </td>
                                        </tr>
                                    ) : orders?.data && Array.isArray(orders.data) && orders.data.length > 0 ? orders.data.map((order) => {
                                        const StatusIcon = statusConfig[order.status]?.icon || Clock;
                                        return (
                                            <tr key={order.id} className="border-b hover:bg-muted/20 transition-colors">
                                                <td className="p-3">
                                                    <div className="font-medium">#{order.id}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div>
                                                        <div className="font-medium">{order.user?.nama_lengkap || order.user?.name || 'N/A'}</div>
                                                        <div className="text-sm text-gray-400">{order.user?.email || 'N/A'}</div>
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
                                                    <Badge variant="outline" className={statusConfig[order.status]?.color || 'border-gray-500 text-gray-300'}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {statusConfig[order.status]?.label || order.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <div className="font-medium">{formatCurrency(order.total_harga)}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm">
                                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2 justify-end">
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                                No orders found. Orders will appear here when customers place them.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {orders?.last_page && orders.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-gray-400">
                                    Showing {((orders.current_page - 1) * orders.per_page) + 1} to {Math.min(orders.current_page * orders.per_page, orders.total)} of {orders.total} orders
                                </div>
                                <div className="flex gap-2">
                                    {orders.current_page > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const params = new URLSearchParams();
                                                if (searchTerm) params.append('search', searchTerm);
                                                if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
                                                if (dateFrom) params.append('date_from', dateFrom);
                                                if (dateTo) params.append('date_to', dateTo);
                                                if (sortBy) params.append('sort_by', sortBy);
                                                if (sortOrder) params.append('sort_order', sortOrder);
                                                params.append('page', (orders.current_page - 1).toString());
                                                router.get(`/admin/orders?${params.toString()}`);
                                            }}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {orders.current_page < orders.last_page && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const params = new URLSearchParams();
                                                if (searchTerm) params.append('search', searchTerm);
                                                if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
                                                if (dateFrom) params.append('date_from', dateFrom);
                                                if (dateTo) params.append('date_to', dateTo);
                                                if (sortBy) params.append('sort_by', sortBy);
                                                if (sortOrder) params.append('sort_order', sortOrder);
                                                params.append('page', (orders.current_page + 1).toString());
                                                router.get(`/admin/orders?${params.toString()}`);
                                            }}
                                        >
                                            Next
                                        </Button>
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
