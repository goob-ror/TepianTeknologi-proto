import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CountBadge } from '@/components/admin/CountBadge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
    id: number;
    nama_kategori: string;
    products_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Categories',
        href: '/admin/categories',
    },
];

export default function CategoriesIndex({ categories }: Props) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete category "${name}"?`)) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Link href="/admin/categories/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
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
                                    {categories.map((category) => (
                                        <tr key={category.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="p-2">{category.id}</td>
                                            <td className="p-2 font-medium">{category.nama_kategori}</td>
                                            <td className="p-2">
                                                <CountBadge
                                                    count={category.products_count}
                                                    type="products"
                                                    size="sm"
                                                    showIcon={true}
                                                />
                                            </td>
                                            <td className="p-2">
                                                {new Date(category.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-2">
                                                <div className="flex gap-2">
                                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(category.id, category.nama_kategori)}
                                                        disabled={category.products_count > 0}
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
                        {categories.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No categories found. <Link href="/admin/categories/create" className="text-blue-600 hover:underline">Create your first category</Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
