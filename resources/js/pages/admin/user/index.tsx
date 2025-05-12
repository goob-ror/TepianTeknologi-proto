// resources/js/pages/admin/user/index.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import Swal from 'sweetalert2';
import { type BreadcrumbItem } from '@/types';

interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  isDeleted: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/admin/users',
  },
];

const UserIndex = () => {
  // In a real app, this would come from the backend
  // For now, we'll use sample data
  const sampleUsers: User[] = [
    {
      id: 1,
      fullname: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      isDeleted: false,
    },
    {
      id: 2,
      fullname: 'Regular User',
      email: 'user@example.com',
      role: 'user',
      isDeleted: false,
    },
    {
      id: 3,
      fullname: 'Test User',
      email: 'test@example.com',
      role: 'user',
      isDeleted: false,
    },
  ];

  const users = sampleUsers;

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
        console.log(`Soft deleting user ID: ${id}`);
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Users" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <Link
            href="/admin/users/add"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" /> Add User
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{user.fullname}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    <span className={user.isDeleted ? 'text-red-500' : 'text-green-500'}>
                      {user.isDeleted ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
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
      </div>
    </AppLayout>
  );
};

export default UserIndex;
