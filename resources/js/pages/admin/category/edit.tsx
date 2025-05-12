// resources/js/pages/admin/category/edit.tsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import Swal from 'sweetalert2';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
  id: number;
  jenis_kategori: string;
  deskripsi?: string;
}

interface Props {
  category: Category;
}

export default function EditCategory({ category }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Categories',
      href: '/admin/categories',
    },
    {
      title: 'Edit Category',
      href: `/admin/categories/${category.id}/edit`,
    },
  ];

  const { data, setData, put, processing, errors } = useForm({
    jenis_kategori: category.jenis_kategori,
    deskripsi: category.deskripsi || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/admin/categories/${category.id}`, {
      onSuccess: () => {
        Swal.fire('Success!', 'Category updated successfully.', 'success');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Category" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Category: {category.jenis_kategori}</CardTitle>
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
                  {processing ? 'Updating...' : 'Update Category'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}