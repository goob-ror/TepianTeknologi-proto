import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import Swal from 'sweetalert2';
import { type BreadcrumbItem } from '@/types';

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
    title: 'Add Product',
    href: '/admin/products/add',
  },
];

interface Props {
  categories: Category[];
}

const CreateProduct = ({ categories }: Props) => {

  const { data, setData, post, processing, errors } = useForm({
    nama_produk: '',
    brand_produk: '',
    kategori_id: '',
    deskripsi_produk: '',
    gambar_produk: null as File | null,
    harga_produk: '',
    stock_produk: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/products', {
      onSuccess: () => Swal.fire('Success!', 'Product added successfully.', 'success'),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Product" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={data.nama_produk}
                onChange={(e) => setData('nama_produk', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              {errors.nama_produk && <div className="text-red-500 text-sm mt-1">{errors.nama_produk}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={data.brand_produk}
                onChange={(e) => setData('brand_produk', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              {errors.brand_produk && <div className="text-red-500 text-sm mt-1">{errors.brand_produk}</div>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
            <select
              value={data.kategori_id}
              onChange={(e) => setData('kategori_id', e.target.value)}
              className="w-full p-2 border rounded bg-transparent text-current"
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.jenis_kategori}
                </option>
              ))}
            </select>
            {errors.kategori_id && <div className="text-red-500 text-sm mt-1">{errors.kategori_id}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={data.deskripsi_produk || ''}
              onChange={(e) => setData('deskripsi_produk', e.target.value)}
              className="w-full p-2 border rounded min-h-[100px]"
              placeholder="Enter product description..."
            />
            {errors.deskripsi_produk && <div className="text-red-500 text-sm mt-1">{errors.deskripsi_produk}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Image <span className="text-red-500">*</span></label>
            <input
              type="file"
              onChange={(e) => setData('gambar_produk', e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
              accept="image/*"
              required
            />
            {errors.gambar_produk && <div className="text-red-500 text-sm mt-1">{errors.gambar_produk}</div>}
            <p className="text-gray-500 text-xs mt-1">Upload a product image (JPG, PNG, or GIF)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Price (Rp) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={data.harga_produk}
                onChange={(e) => setData('harga_produk', e.target.value)}
                className="w-full p-2 border rounded"
                step="0.001"
                min="0"
                placeholder="0.00"
                required
              />
              {errors.harga_produk && <div className="text-red-500 text-sm mt-1">{errors.harga_produk}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={data.stock_produk}
                onChange={(e) => setData('stock_produk', e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                placeholder="0"
                required
              />
              {errors.stock_produk && <div className="text-red-500 text-sm mt-1">{errors.stock_produk}</div>}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default CreateProduct;