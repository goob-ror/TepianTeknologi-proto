import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { StockBadge } from '@/components/admin/StockBadge';

interface Product {
    id: number;
    nama_produk: string;
    brand_produk: string;
    harga_produk: number;
    stock_produk: number;
    created_at: string;
}

interface RecentProductsTableProps {
    products: Product[];
    className?: string;
}

export function RecentProductsTable({ products, className }: RecentProductsTableProps) {
    return (
        <Card className={cn('border-2 border-green-500/20 shadow-lg', className)}>
            <CardHeader className="bg-gradient-to-r from-green-600/10 to-cyan-600/10">
                <CardTitle className="text-light-text flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Recent Products
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-cyan-500/30 bg-gradient-to-r from-cyan-600/5 to-blue-600/5">
                                <th className="text-left font-medium p-3 text-cyan-300">Name</th>
                                <th className="text-left font-medium p-3 text-blue-300">Brand</th>
                                <th className="text-left font-medium p-3 text-green-300">Price</th>
                                <th className="text-left font-medium p-3 text-yellow-300">Stock</th>
                                <th className="text-left font-medium p-3 text-purple-300">Added</th>
                                <th className="text-right font-medium p-3 text-pink-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && Array.isArray(products) ? products.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-muted/20 transition-colors">
                                    <td className="p-2 text-light-text">{product.nama_produk}</td>
                                    <td className="p-2 text-light-text">{product.brand_produk || 'N/A'}</td>
                                    <td className="p-2 text-light-text">Rp {product.harga_produk.toLocaleString()}</td>
                                    <td className="p-2">
                                        <StockBadge
                                            stock={product.stock_produk}
                                            size="sm"
                                            showIcon={true}
                                            showText={true}
                                        />
                                    </td>
                                    <td className="p-2 text-light-text">{new Date(product.created_at).toLocaleDateString()}</td>
                                    <td className="p-2 text-right">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="text-blue-500 hover:underline text-xs mr-2"
                                        >
                                            Edit
                                        </Link>
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="text-green-500 hover:underline text-xs"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            )) : null}
                            {(!products || products.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="p-2 text-center text-light-text opacity-70">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-right">
                    <Link
                        href="/admin/products"
                        className="text-sm text-blue-500 hover:underline"
                    >
                        View all products →
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
