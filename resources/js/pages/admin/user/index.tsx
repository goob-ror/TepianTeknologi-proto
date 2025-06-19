import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Search, Filter, X, UserCheck, UserX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

interface Props {
    users: User[];
    filters?: {
        search?: string;
        role?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
];

export default function UsersIndex({ users = [], filters = {} }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete user "${name}"?`)) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        if (selectedRole && selectedRole !== 'all') params.append('role', selectedRole);
        if (selectedStatus && selectedStatus !== 'all') params.append('status', selectedStatus);

        router.get(`/admin/users?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedRole('all');
        setSelectedStatus('all');
        router.get('/admin/users');
    };

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users</h1>
                    <Link href="/admin/users/create">
                        <Button className="admin-bg-blue">
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-blue-300">All Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Search and Filter Section */}
                        <div className="mb-6 space-y-4">
                            {/* Search Bar */}
                            <div className="flex gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Clear Filters
                                </Button>
                            </div>

                            {/* Filter Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Role Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Role</label>
                                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Roles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Status</label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <div className="flex justify-end">
                                <Button onClick={handleSearch} className="flex items-center gap-2 admin-bg-green">
                                    <Filter className="h-4 w-4" />
                                    Apply Filters
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-medium text-blue-300">ID</th>
                                        <th className="text-left p-3 font-medium text-green-300">Name</th>
                                        <th className="text-left p-3 font-medium text-yellow-300">Email</th>
                                        <th className="text-left p-3 font-medium text-purple-300">Role</th>
                                        <th className="text-left p-3 font-medium text-pink-300">Status</th>
                                        <th className="text-left p-3 font-medium text-cyan-300">Joined</th>
                                        <th className="text-right p-3 font-medium text-orange-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users && Array.isArray(users) && users.length > 0 ? users.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/20 transition-colors">
                                            <td className="p-3">{user.id}</td>
                                            <td className="p-3">
                                                <div className="font-medium">{user.nama_lengkap || user.name}</div>
                                            </td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">
                                                <Badge
                                                    variant="outline"
                                                    className={user.role === 'admin' ? 'border-purple-500 text-purple-300' : 'border-blue-500 text-blue-300'}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    {user.email_verified_at ? (
                                                        <>
                                                            <UserCheck className="h-4 w-4 text-green-500" />
                                                            <span className="text-green-500">Active</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserX className="h-4 w-4 text-red-500" />
                                                            <span className="text-red-500">Inactive</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-2 justify-end">
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/users/${user.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(user.id, user.nama_lengkap || user.name || 'User')}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                                No users found. <Link href="/admin/users/create" className="text-blue-600 hover:underline">Create your first user</Link>
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
