import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from 'layouts/admin-app-layout';
import Swal from 'sweetalert2';

export default function AddCategory() {
  const { data, setData, post, processing, errors } = useForm({
    jenis_kategori: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/categories', {
      onSuccess: () => {
        Swal.fire('Success!', 'Category added successfully.', 'success');
        setData('jenis_kategori', '');
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Add Category" />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Add Category</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Category Name</label>
            <input
              type="text"
              value={data.jenis_kategori}
              onChange={(e) => setData('jenis_kategori', e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.jenis_kategori && (
              <div className="text-red-500 text-sm">{errors.jenis_kategori}</div>
            )}
          </div>
          <button
            type="submit"
            disabled={processing}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Category
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
