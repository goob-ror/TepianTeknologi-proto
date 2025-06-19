import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface Brand {
    id: number;
    nama_brand: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    brand: Brand;
}

export default function EditBrand({ brand }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Brands',
            href: '/admin/brands',
        },
        {
            title: 'Edit',
            href: `/admin/brands/${brand.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nama_brand: brand.nama_brand,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/brands/${brand.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Brand - ${brand.nama_brand}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/brands">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Edit Brand</h1>
                </div>

                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Brand Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="nama_brand">Brand Name</Label>
                                <Input
                                    id="nama_brand"
                                    type="text"
                                    value={data.nama_brand}
                                    onChange={(e) => setData('nama_brand', e.target.value)}
                                    placeholder="Enter brand name"
                                    className={errors.nama_brand ? 'border-red-500' : ''}
                                />
                                {errors.nama_brand && (
                                    <p className="text-sm text-red-500 mt-1">{errors.nama_brand}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Brand'}
                                </Button>
                                <Link href="/admin/brands">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
