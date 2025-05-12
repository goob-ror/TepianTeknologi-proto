// resources/js/pages/admin/category/create.tsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import Swal from 'sweetalert2';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Categories',
    href: '/admin/categories',
  },
  {
    title: 'Add Category',
    href: '/admin/categories/add',
  },
];

export default function AddCategory() {
  const { data, setData, post, processing, errors } = useForm({
    jenis_kategori: '',
    deskripsi: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/categories', {
      onSuccess: () => {
        Swal.fire('Success!', 'Category added successfully.', 'success');
        setData('jenis_kategori', '');
        setData('deskripsi', '');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Category" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="jenis_kategori">
                  Category Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="jenis_kategori"
                  type="text"
                  value={data.jenis_kategori}
                  onChange={(e) => setData('jenis_kategori', e.target.value)}
                  required
                />
                {errors.jenis_kategori && (
                  <div className="text-destructive text-sm">{errors.jenis_kategori}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi">Description</Label>
                <Input
                  id="deskripsi"
                  type="text"
                  value={data.deskripsi}
                  onChange={(e) => setData('deskripsi', e.target.value)}
                  placeholder="Enter category description (optional)"
                />
                {errors.deskripsi && (
                  <div className="text-destructive text-sm">{errors.deskripsi}</div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                >
                  {processing ? 'Saving...' : 'Save Category'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
