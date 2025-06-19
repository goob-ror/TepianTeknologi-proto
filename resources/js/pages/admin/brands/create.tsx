import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

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
        title: 'Create',
        href: '/admin/brands/create',
    },
];

export default function CreateBrand() {
    const { data, setData, post, processing, errors } = useForm({
        nama_brand: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/brands');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Brand" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/brands">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Brand</h1>
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
                                    {processing ? 'Creating...' : 'Create Brand'}
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
