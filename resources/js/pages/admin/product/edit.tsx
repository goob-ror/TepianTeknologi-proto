// resources/js/Pages/Admin/Products/Edit.tsx
import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminDashboard from '@/pages/admin/dashboard';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  nama_produk: string;
  brand_produk: string;
  kategori_id: number;
  deskripsi_produk: string;
  harga_produk: string;
  stock_produk: number;
}

interface Category {
  id: number;
  jenis_kategori: string;
}

const EditProduct = () => {
  const { product, categories } = usePage<{
    product: Product;
    categories: Category[];
  }>().props;

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
    <AdminDashboard>
      <Head title="Edit Product" />
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={data.nama_produk}
            onChange={(e) => setData('nama_produk', e.target.value)}
            className="w-full p-2 border rounded"
          />
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
            onChange={(e) => setData('kategori_id', Number(e.target.value))}
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
          <label className="block text-sm font-medium">Change Image (optional)</label>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Product
        </button>
      </form>
    </AdminDashboard>
  );
};

export default EditProduct;
