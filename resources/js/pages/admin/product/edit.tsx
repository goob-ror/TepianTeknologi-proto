// resources/js/pages/admin/product/edit.tsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import Swal from 'sweetalert2';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Product {
  id: number;
  nama_produk: string;
  brand_produk: string;
  kategori_id: number;
  deskripsi_produk: string;
  harga_produk: string;
  stock_produk: number;
  gambar_produk?: string;
}

interface Category {
  id: number;
  jenis_kategori: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Products',
    href: '/admin/products',
  },
  {
    title: 'Edit Product',
    href: '#',
  },
];

interface Props {
  product: Product;
  categories: Category[];
}

const EditProduct = ({ product, categories }: Props) => {

  const { data, setData, post, processing, errors } = useForm({
    _method: 'PUT',
    nama_produk: product.nama_produk,
    brand_produk: product.brand_produk,
    kategori_id: product.kategori_id,
    deskripsi_produk: product.deskripsi_produk,
    harga_produk: product.harga_produk,
    stock_produk: product.stock_produk,
    gambar_produk: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/admin/products/${product.id}`, {
      onSuccess: () => Swal.fire('Updated!', 'Product updated successfully.', 'success'),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Product" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product: {product.nama_produk}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama_produk">
                    Product Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nama_produk"
                    type="text"
                    value={data.nama_produk}
                    onChange={(e) => setData('nama_produk', e.target.value)}
                    required
                  />
                  {errors.nama_produk && <div className="text-destructive text-sm">{errors.nama_produk}</div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand_produk">
                    Brand <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="brand_produk"
                    type="text"
                    value={data.brand_produk}
                    onChange={(e) => setData('brand_produk', e.target.value)}
                    required
                  />
                  {errors.brand_produk && <div className="text-destructive text-sm">{errors.brand_produk}</div>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori_id">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={data.kategori_id.toString()}
                  onValueChange={(value) => setData('kategori_id', Number(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select Category --" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.jenis_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.kategori_id && <div className="text-destructive text-sm">{errors.kategori_id}</div>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deskripsi_produk">Description</Label>
                <Input
                  id="deskripsi_produk"
                  value={data.deskripsi_produk || ''}
                  onChange={(e) => setData('deskripsi_produk', e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Enter product description..."
                />
                {errors.deskripsi_produk && <div className="text-destructive text-sm">{errors.deskripsi_produk}</div>}
              </div>

              {product.gambar_produk && (
                <div className="space-y-2">
                  <Label>Current Image</Label>
                  <div className="border rounded p-2 w-40 h-40 flex items-center justify-center bg-muted">
                    <img
                      src={`/storage/${product.gambar_produk}`}
                      alt={product.nama_produk}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="gambar_produk">
                  Change Image {!product.gambar_produk && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="gambar_produk"
                  type="file"
                  onChange={(e) => setData('gambar_produk', e.target.files?.[0] || null)}
                  accept="image/*"
                  required={!product.gambar_produk}
                />
                {errors.gambar_produk && <div className="text-destructive text-sm">{errors.gambar_produk}</div>}
                <p className="text-muted-foreground text-xs">Upload a new product image (JPG, PNG, or GIF)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="harga_produk">
                    Price (Rp) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="harga_produk"
                    type="number"
                    value={data.harga_produk}
                    onChange={(e) => setData('harga_produk', e.target.value)}
                    step="0.001"
                    min="0"
                    placeholder="0.00"
                    required
                  />
                  {errors.harga_produk && <div className="text-destructive text-sm">{errors.harga_produk}</div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock_produk">
                    Stock <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stock_produk"
                    type="number"
                    value={data.stock_produk}
                    onChange={(e) => setData('stock_produk', Number(e.target.value))}
                    min="0"
                    placeholder="0"
                    required
                  />
                  {errors.stock_produk && <div className="text-destructive text-sm">{errors.stock_produk}</div>}
                </div>
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
                  {processing ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EditProduct;
