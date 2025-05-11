import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

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
        <Card className={className}>
            <CardHeader>
                <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left font-medium p-2">Name</th>
                                <th className="text-left font-medium p-2">Brand</th>
                                <th className="text-left font-medium p-2">Price</th>
                                <th className="text-left font-medium p-2">Stock</th>
                                <th className="text-left font-medium p-2">Added</th>
                                <th className="text-right font-medium p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-muted/50">
                                    <td className="p-2">{product.nama_produk}</td>
                                    <td className="p-2">{product.brand_produk}</td>
                                    <td className="p-2">Rp {product.harga_produk.toLocaleString()}</td>
                                    <td className="p-2">
                                        <span className={product.stock_produk < 10 ? 'text-red-500 font-medium' : ''}>
                                            {product.stock_produk}
                                        </span>
                                    </td>
                                    <td className="p-2">{new Date(product.created_at).toLocaleDateString()}</td>
                                    <td className="p-2 text-right">
                                        <Link 
                                            href={`/products/${product.id}/edit`}
                                            className="text-blue-500 hover:underline text-xs mr-2"
                                        >
                                            Edit
                                        </Link>
                                        <Link 
                                            href={`/products/${product.id}`}
                                            className="text-green-500 hover:underline text-xs"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-2 text-center text-muted-foreground">
                                        No products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-right">
                    <Link 
                        href="/products/view"
                        className="text-sm text-blue-500 hover:underline"
                    >
                        View all products →
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
