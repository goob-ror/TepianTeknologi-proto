// resources/js/Pages/Admin/Products/Create.tsx
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminDashboard from '@/pages/admin/dashboard';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

interface Category {
  id: number;
  jenis_kategori: string;
}

const CreateProduct = () => {
  const { categories } = usePage<{ categories: Category[] }>().props;

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
    <AdminDashboard>
      <Head title="Add Product" />
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={data.nama_produk}
            onChange={(e) => setData('nama_produk', e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.nama_produk && <div className="text-red-500 text-sm">{errors.nama_produk}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium">Brand</label>
          <input
            type="text"
            value={data.brand_produk}
            onChange={(e) => setData('brand_produk', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            value={data.kategori_id}
            onChange={(e) => setData('kategori_id', e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.jenis_kategori}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={data.deskripsi_produk || ''}
            onChange={(e) => setData('deskripsi_produk', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            onChange={(e) => setData('gambar_produk', e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={data.harga_produk}
            onChange={(e) => setData('harga_produk', e.target.value)}
            className="w-full p-2 border rounded"
            step="0.001"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input
            type="number"
            value={data.stock_produk}
            onChange={(e) => setData('stock_produk', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Product
        </button>
      </form>
    </AdminDashboard>
  );
};

export default CreateProduct;
