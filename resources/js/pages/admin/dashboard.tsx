import { StatCard } from '@/components/admin/dashboard/StatCard';
import { ProductsChart } from '@/components/admin/dashboard/ProductsChart';
import { RecentProductsTable } from '@/components/admin/dashboard/RecentProductsTable';
import { LowStockProducts } from '@/components/admin/dashboard/LowStockProducts';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Package, ShoppingCart, TrendingUp, Tag, Store } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

interface Category {
    id: number;
    nama_kategori: string;
}

interface Brand {
    id: number;
    nama_brand: string;
}

interface Product {
    id: number;
    nama_produk: string;
    deskripsi: string;
    harga: string;
    stok: number;
    category: Category;
    brand: Brand;
    created_at: string;
}

interface Stats {
    totalUsers: number;
    totalProducts: number;
    totalCategories: number;
    totalBrands: number;
    totalOrders: number;
    dailySales: number;
    pendingOrders: number;
    completedOrders: number;
}

interface SalesData {
    month: string;
    sales: number;
}

interface Props {
    stats: Stats;
    lowStockProducts: Product[];
    recentProducts: Product[];
    salesData: SalesData[];
}

export default function Dashboard({ stats, lowStockProducts, recentProducts, salesData }: Props) {
    // Transform salesData for chart component
    const chartData = salesData && Array.isArray(salesData) ? salesData.map(item => ({
        name: item.month,
        value: item.sales / 1000000 // Convert to millions for better display
    })) : [];

    // Format currency for display
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Transform products for legacy components
    const transformedLowStock = lowStockProducts && Array.isArray(lowStockProducts) ? lowStockProducts.map(product => ({
        id: product.id,
        nama_produk: product.nama_produk,
        brand_produk: product.brand?.nama_brand || 'Unknown',
        harga_produk: parseFloat(product.harga),
        stock_produk: product.stok,
        created_at: product.created_at,
    })) : [];

    const transformedRecent = recentProducts && Array.isArray(recentProducts) ? recentProducts.map(product => ({
        id: product.id,
        nama_produk: product.nama_produk,
        brand_produk: product.brand?.nama_brand || 'Unknown',
        harga_produk: parseFloat(product.harga),
        stock_produk: product.stok,
        created_at: product.created_at,
    })) : [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrders?.toString() || '0'}
                        icon={ShoppingCart}
                        description="All time orders"
                        colorTheme="blue"
                    />
                    <StatCard
                        title="Today's Sales"
                        value={formatCurrency(stats.dailySales || 0)}
                        icon={TrendingUp}
                        description="Today's completed orders"
                        colorTheme="green"
                    />
                    <StatCard
                        title="Pending Orders"
                        value={stats.pendingOrders?.toString() || '0'}
                        icon={Package}
                        description="Awaiting payment"
                        colorTheme="yellow"
                    />
                    <StatCard
                        title="Completed Orders"
                        value={stats.completedOrders?.toString() || '0'}
                        icon={Users}
                        description="Successfully delivered"
                        colorTheme="purple"
                    />
                </div>

                {/* Secondary Stats Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers.toString()}
                        icon={Users}
                        description="Registered users"
                        colorTheme="pink"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats.totalProducts.toString()}
                        icon={Package}
                        description="In catalog"
                        colorTheme="orange"
                    />
                    <StatCard
                        title="Categories"
                        value={stats.totalCategories.toString()}
                        icon={Tag}
                        description="Product categories"
                        colorTheme="blue"
                    />
                    <StatCard
                        title="Brands"
                        value={stats.totalBrands.toString()}
                        icon={Store}
                        description="Available brands"
                        colorTheme="green"
                    />
                </div>

                {/* Chart and Low Stock Products */}
                <div className="grid gap-4 md:grid-cols-3">
                    <ProductsChart
                        data={chartData}
                        title="Monthly Sales Revenue (Last 6 Months)"
                        className="md:col-span-2"
                    />
                    <LowStockProducts products={transformedLowStock} />
                </div>

                {/* Recent Products Table */}
                <RecentProductsTable products={transformedRecent} />
            </div>
        </AppLayout>
    );
}
