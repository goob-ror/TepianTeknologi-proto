import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StockBadge } from '@/components/admin/StockBadge';
import { ArrowLeft, Edit, Package, Tag, DollarSign, Archive, Calendar, CheckCircle, XCircle } from 'lucide-react';

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

interface Props {
    product: Product;
}

export default function ShowProduct({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Products',
            href: '/admin/products',
        },
        {
            title: product.nama_produk,
            href: `/admin/products/${product.id}`,
        },
    ];

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(parseFloat(price));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product - ${product.nama_produk}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/products">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{product.nama_produk}</h1>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? (
                                <>
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Active
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Inactive
                                </>
                            )}
                        </Badge>
                    </div>
                    <Link href={`/admin/products/${product.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.gambar ? (
                                <img
                                    src={`/storage/${product.gambar}`}
                                    alt={product.nama_produk}
                                    className="w-full h-64 object-cover rounded-lg border"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                        <Package className="mx-auto h-12 w-12 mb-2" />
                                        <p>No image available</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-1">Product Name</h3>
                                    <p className="text-lg font-semibold">{product.nama_produk}</p>
                                </div>

                                {product.deskripsi && (
                                    <div>
                                        <h3 className="font-medium text-gray-700 mb-1">Description</h3>
                                        <p className="text-gray-600 leading-relaxed">{product.deskripsi}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Product Specifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Specifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Tag className="h-5 w-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Category</p>
                                                <Badge variant="outline">{product.category.nama_kategori}</Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Package className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Brand</p>
                                                <Badge variant="outline">{product.brand.nama_brand}</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-5 w-5 text-yellow-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Price</p>
                                                <p className="text-lg font-semibold text-green-600">
                                                    {formatPrice(product.harga)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Archive className="h-5 w-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Stock</p>
                                                <StockBadge
                                                    stock={product.stok}
                                                    size="md"
                                                    showIcon={true}
                                                    showText={true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Timestamps</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Created At</p>
                                            <p className="font-medium">{formatDate(product.created_at)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-gray-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Last Updated</p>
                                            <p className="font-medium">{formatDate(product.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
