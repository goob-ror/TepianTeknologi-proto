import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, User, Mail, Lock, Shield } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Users',
        href: '/admin/users',
    },
    {
        title: 'Create User',
        href: '/admin/users/create',
    },
];

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => {
                // Reset form
                setData({
                    nama_lengkap: '',
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
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create User</h1>
                    <Link href="/admin/users">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-300 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    User Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="nama_lengkap">Full Name *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="nama_lengkap"
                                                    type="text"
                                                    value={data.nama_lengkap}
                                                    onChange={(e) => setData('nama_lengkap', e.target.value)}
                                                    placeholder="Enter full name"
                                                    className={`pl-10 ${errors.nama_lengkap ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.nama_lengkap && (
                                                <p className="text-sm text-red-500 mt-1">{errors.nama_lengkap}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email Address *</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Enter email address"
                                                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="password">Password *</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Enter password"
                                                    className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.password && (
                                                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Confirm password"
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="role">Role *</Label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                            <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                                <SelectTrigger className="pl-10">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {errors.role && (
                                            <p className="text-sm text-red-500 mt-1">{errors.role}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="admin-bg-green"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Creating...' : 'Create User'}
                                        </Button>
                                        <Link href="/admin/users">
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-yellow-300">Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-blue-300 mb-2">Password Requirements</h4>
                                    <ul className="text-sm space-y-1 text-gray-300">
                                        <li>• Minimum 8 characters</li>
                                        <li>• At least one uppercase letter</li>
                                        <li>• At least one lowercase letter</li>
                                        <li>• At least one number</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-purple-300 mb-2">User Roles</h4>
                                    <ul className="text-sm space-y-1 text-gray-300">
                                        <li><strong>User:</strong> Regular customer access</li>
                                        <li><strong>Admin:</strong> Full system access</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
