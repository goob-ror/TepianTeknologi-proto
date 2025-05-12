// resources/js/pages/admin/user/add.tsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import Swal from 'sweetalert2';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/admin/users',
  },
  {
    title: 'Add User',
    href: '/admin/users/add',
  },
];

export default function AddUser() {
  const { data, setData, post, processing, errors } = useForm({
    fullname: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/users', {
      onSuccess: () => {
        Swal.fire('Success!', 'User added successfully.', 'success');
        // Reset form
        setData({
          fullname: '',
          email: '',
          password: '',
          password_confirmation: '',
          role: 'user',
        });
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add User" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold mb-4">Add New User</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={data.fullname}
              onChange={(e) => setData('fullname', e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.fullname && (
              <div className="text-red-500 text-sm">{errors.fullname}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full p-2 border rounded"
            />
            {errors.password && (
              <div className="text-red-500 text-sm">{errors.password}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={data.role}
              onChange={(e) => setData('role', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <div className="text-red-500 text-sm">{errors.role}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {processing ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
