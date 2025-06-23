import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StockBadge } from '@/components/admin/StockBadge';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Search, Filter, X, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { useState, useEffect, useCallback } from 'react';

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
    gambar: string;
    is_active: boolean;
    category: Category;
    brand: Brand;
    created_at: string;
    updated_at: string;
}

interface FilterOptions {
    search?: string;
    category_id?: string;
    brand_id?: string;
    stock_status?: string;
    status?: string;
    sort_by?: string;
    sort_order?: string;
}

interface PaginatedProducts {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    filters: FilterOptions;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Products',
        href: '/admin/products',
    },
];

export default function ProductsIndex({ products, categories, brands, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || 'all');
    const [selectedBrand, setSelectedBrand] = useState(filters.brand_id || 'all');
    const [selectedStockStatus, setSelectedStockStatus] = useState(filters.stock_status || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'id');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'asc');

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete product "${name}"?`)) {
            router.delete(`/admin/products/${id}`);
        }
    };

    const handleToggleStatus = (id: number) => {
        router.patch(`/admin/products/${id}/toggle-status`);
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(parseFloat(price));
    };

    const handleSearch = useCallback(() => {
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory && selectedCategory !== 'all') params.append('category_id', selectedCategory);
        if (selectedBrand && selectedBrand !== 'all') params.append('brand_id', selectedBrand);
        if (selectedStockStatus && selectedStockStatus !== 'all') params.append('stock_status', selectedStockStatus);
        if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);

        router.get(`/admin/products?${params.toString()}`);
    }, [searchTerm, selectedCategory, selectedBrand, selectedStockStatus, selectedStatus, sortBy, sortOrder]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedBrand('all');
        setSelectedStockStatus('all');
        setSelectedStatus('all');
        setSortBy('id');
        setSortOrder('asc');
        router.get('/admin/products');
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
        if (selectedCategory && selectedCategory !== 'all') params.append('category_id', selectedCategory);
        if (selectedBrand && selectedBrand !== 'all') params.append('brand_id', selectedBrand);
        if (selectedStockStatus && selectedStockStatus !== 'all') params.append('stock_status', selectedStockStatus);
        if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);
        params.append('sort_by', column);
        params.append('sort_order', newSortOrder);

        router.get(`/admin/products?${params.toString()}`);
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) {
            return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
        }
        return sortOrder === 'asc'
            ? <ChevronUp className="h-4 w-4 text-blue-600" />
            : <ChevronDown className="h-4 w-4 text-blue-600" />;
    };

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm, filters.search, handleSearch]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Link href="/admin/products/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search and Filter Section */}
                        <div className="mb-6 space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search products..."
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* Category Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Category</label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.nama_kategori}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Brand Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Brand</label>
                                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Brands" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Brands</SelectItem>
                                            {brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                                    {brand.nama_brand}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Stock Status Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Stock Status</label>
                                    <Select value={selectedStockStatus} onValueChange={setSelectedStockStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Stock" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Stock</SelectItem>
                                            <SelectItem value="in_stock">In Stock (&gt;10)</SelectItem>
                                            <SelectItem value="low_stock">Low Stock (1-10)</SelectItem>
                                            <SelectItem value="out_of_stock">Out of Stock (0)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Active Status Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Status</label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="flex justify-end">
                                <Button onClick={handleSearch} className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">
                                            <button
                                                onClick={() => handleSort('id')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
                                            >
                                                ID
                                                {getSortIcon('id')}
                                            </button>
                                        </th>
                                        <th className="text-left p-2">
                                            <button
                                                onClick={() => handleSort('nama_produk')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
                                            >
                                                Name
                                                {getSortIcon('nama_produk')}
                                            </button>
                                        </th>
                                        <th className="text-left p-2">Category</th>
                                        <th className="text-left p-2">Brand</th>
                                        <th className="text-left p-2">
                                            <button
                                                onClick={() => handleSort('harga')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
                                            >
                                                Price
                                                {getSortIcon('harga')}
                                            </button>
                                        </th>
                                        <th className="text-left p-2">
                                            <button
                                                onClick={() => handleSort('stok')}
                                                className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
                                            >
                                                Stock
                                                {getSortIcon('stok')}
                                            </button>
                                        </th>
                                        <th className="text-left p-2">Status</th>
                                        <th className="text-left p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data && Array.isArray(products.data) ? products.data.map((product) => (
                                        <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-2">{product.id}</td>
                                            <td className="p-2">
                                                <div className="font-medium">{product.nama_produk}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {product.deskripsi}
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                <Badge variant="outline">
                                                    {product.category.nama_kategori}
                                                </Badge>
                                            </td>
                                            <td className="p-2">
                                                <Badge variant="outline">
                                                    {product.brand.nama_brand}
                                                </Badge>
                                            </td>
                                            <td className="p-2 font-medium">
                                                {formatPrice(product.harga)}
                                            </td>
                                            <td className="p-2">
                                                <StockBadge
                                                    stock={product.stok}
                                                    size="md"
                                                    showIcon={true}
                                                    showText={true}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(product.id)}
                                                >
                                                    {product.is_active ? (
                                                        <ToggleRight className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </Button>
                                            </td>
                                            <td className="p-2">
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/products/${product.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(product.id, product.nama_produk)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={8} className="text-center py-8 text-gray-500">
                                                No products available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {products.data && products.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No products found. <Link href="/admin/products/create" className="text-blue-600 hover:underline">Create your first product</Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.data && products.data.length > 0 && (
                            <div className="mt-6">
                                <Pagination data={products} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
