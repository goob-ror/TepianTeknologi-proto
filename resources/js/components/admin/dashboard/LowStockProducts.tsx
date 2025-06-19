import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { StockBadge } from '@/components/admin/StockBadge';

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
        <Card className={cn('border-2 border-orange-500/20 shadow-lg', className)}>
            <CardHeader className="bg-gradient-to-r from-orange-600/10 to-red-600/10">
                <CardTitle className="text-light-text flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                    Low Stock Products
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products && Array.isArray(products) ? products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between border-b pb-2">
                            <div>
                                <div className="font-medium text-light-text">{product.nama_produk}</div>
                                <div className="text-xs text-light-text opacity-70">{product.brand_produk || 'N/A'}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StockBadge
                                    stock={product.stock_produk}
                                    size="sm"
                                    showIcon={true}
                                    showText={true}
                                />
                                <Link
                                    href={`/admin/products/${product.id}/edit`}
                                    className="text-xs px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Restock
                                </Link>
                            </div>
                        </div>
                    )) : null}
                    {(!products || products.length === 0) && (
                        <div className="text-center text-light-text opacity-70 py-4">
                            No low stock products
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
