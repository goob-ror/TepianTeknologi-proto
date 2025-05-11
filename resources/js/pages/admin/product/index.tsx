// resources/js/Pages/Admin/Products/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import AdminDashboard from '@/pages/admin/dashboard';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';

interface Product {
  id: number;
  nama_produk: string;
  brand_produk: string;
  harga_produk: string;
  stock_produk: number;
}

const ProductIndex = () => {
  const { products } = usePage<{ products: Product[] }>().props;

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
        // Replace this with Inertia post to delete route
        console.log(`Deleting product ID: ${id}`);
      }
    });
  };

  return (
    <AdminDashboard>
      <Head title="Manage Products" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" /> Add Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{product.nama_produk}</td>
                <td className="p-3">{product.brand_produk}</td>
                <td className="p-3">Rp {product.harga_produk}</td>
                <td className="p-3">{product.stock_produk}</td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminDashboard>
  );
};

export default ProductIndex;
