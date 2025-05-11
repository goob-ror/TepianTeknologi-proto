import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    nama_produk: string;
    brand_produk: string;
    stock_produk: number;
}

interface LowStockProductsProps {
    products: Product[];
    className?: string;
}

export function LowStockProducts({ products, className }: LowStockProductsProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between border-b pb-2">
                            <div>
                                <div className="font-medium">{product.nama_produk}</div>
                                <div className="text-xs text-muted-foreground">{product.brand_produk}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-red-500 font-bold">{product.stock_produk}</div>
                                <Link
                                    href={`/products/${product.id}/edit`}
                                    className="text-xs text-blue-500 hover:underline"
                                >
                                    Restock
                                </Link>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            No low stock products
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
