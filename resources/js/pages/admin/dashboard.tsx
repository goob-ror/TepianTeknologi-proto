import { StatCard } from '@/components/admin/dashboard/StatCard';
import { ProductsChart } from '@/components/admin/dashboard/ProductsChart';
import { RecentProductsTable } from '@/components/admin/dashboard/RecentProductsTable';
import { LowStockProducts } from '@/components/admin/dashboard/LowStockProducts';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Sample data - in a real app, this would come from the backend
const sampleProducts = [
    {
        id: 1,
        nama_produk: 'Arduino Uno',
        brand_produk: 'Arduino',
        harga_produk: 150000,
        stock_produk: 25,
        created_at: '2025-04-01T00:00:00.000Z',
    },
    {
        id: 2,
        nama_produk: 'Raspberry Pi 4',
        brand_produk: 'Raspberry Pi',
        harga_produk: 850000,
        stock_produk: 8,
        created_at: '2025-04-05T00:00:00.000Z',
    },
    {
        id: 3,
        nama_produk: 'ESP32 Development Board',
        brand_produk: 'Espressif',
        harga_produk: 75000,
        stock_produk: 15,
        created_at: '2025-04-10T00:00:00.000Z',
    },
    {
        id: 4,
        nama_produk: 'Servo Motor SG90',
        brand_produk: 'Tower Pro',
        harga_produk: 15000,
        stock_produk: 5,
        created_at: '2025-04-15T00:00:00.000Z',
    },
    {
        id: 5,
        nama_produk: 'Breadboard 830 Points',
        brand_produk: 'Generic',
        harga_produk: 25000,
        stock_produk: 30,
        created_at: '2025-04-20T00:00:00.000Z',
    },
];

const salesData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1900 },
    { name: 'Mar', value: 1500 },
    { name: 'Apr', value: 2400 },
    { name: 'May', value: 2100 },
    { name: 'Jun', value: 3000 },
];

export default function Dashboard() {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [recentProducts, setRecentProducts] = useState([]);
    
    useEffect(() => {
        // Filter products with stock less than 10
        setLowStockProducts(sampleProducts.filter(product => product.stock_produk < 10));
        
        // Get the 5 most recent products
        setRecentProducts([...sampleProducts].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 5));
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                
                {/* Stats Row */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Total Users" 
                        value="120" 
                        icon={Users}
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard 
                        title="Total Products" 
                        value="45" 
                        icon={Package}
                        trend={{ value: 8, isPositive: true }}
                    />
                    <StatCard 
                        title="Monthly Sales" 
                        value="Rp 24,500,000" 
                        icon={ShoppingCart}
                        trend={{ value: 5, isPositive: true }}
                    />
                    <StatCard 
                        title="Revenue Growth" 
                        value="18%" 
                        icon={TrendingUp}
                        description="Year over year growth"
                        trend={{ value: 3, isPositive: false }}
                    />
                </div>
                
                {/* Chart and Low Stock Products */}
                <div className="grid gap-4 md:grid-cols-3">
                    <ProductsChart 
                        data={salesData} 
                        title="Monthly Sales"
                        className="md:col-span-2"
                    />
                    <LowStockProducts products={lowStockProducts} />
                </div>
                
                {/* Recent Products Table */}
                <RecentProductsTable products={recentProducts} />
            </div>
        </AppLayout>
    );
}
