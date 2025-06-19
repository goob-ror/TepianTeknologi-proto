// resources/js/pages/admin/category/index.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Category {
  id: number;
  jenis_kategori: string;
  deskripsi?: string;
}

interface Props {
  categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Categories',
    href: '/admin/categories',
  },
];

export default function ViewCategories({ categories }: Props) {
  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/admin/categories/${id}`, {
          onSuccess: () => {
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          },
          onError: (errors) => {
            Swal.fire('Error!', errors.error || 'Failed to delete category.', 'error');
          }
        });
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Categories" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Categories</CardTitle>
            <Button asChild>
              <Link href="/admin/categories/add" className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Add Category
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{category.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{category.jenis_kategori}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {category.deskripsi || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-primary"
                            >
                              <Link href={`/admin/categories/${category.id}/edit`}>
                                <Pencil className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-destructive"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
