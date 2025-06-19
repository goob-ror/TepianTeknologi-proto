import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountBadge } from '@/components/admin/CountBadge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Brand {
    id: number;
    nama_brand: string;
    products_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    brands: Brand[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Brands',
        href: '/admin/brands',
    },
];

export default function BrandsIndex({ brands }: Props) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete brand "${name}"?`)) {
            router.delete(`/admin/brands/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brands" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Brands</h1>
                    <Link href="/admin/brands/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Brand
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Brands</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">ID</th>
                                        <th className="text-left p-2">Name</th>
                                        <th className="text-left p-2">Products Count</th>
                                        <th className="text-left p-2">Created At</th>
                                        <th className="text-left p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {brands.map((brand) => (
                                        <tr key={brand.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-2">{brand.id}</td>
                                            <td className="p-2 font-medium">{brand.nama_brand}</td>
                                            <td className="p-2">
                                                <CountBadge
                                                    count={brand.products_count}
                                                    type="products"
                                                    size="sm"
                                                    showIcon={true}
                                                />
                                            </td>
                                            <td className="p-2">
                                                {new Date(brand.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-2">
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/brands/${brand.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(brand.id, brand.nama_brand)}
                                                        disabled={brand.products_count > 0}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {brands.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No brands found. <Link href="/admin/brands/create" className="text-blue-600 hover:underline">Create your first brand</Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
