import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, User, Mail, Lock, Shield, AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Admins',
        href: '/admin/admins',
    },
    {
        title: 'Create Admin',
        href: '/admin/admins/create',
    },
];

export default function CreateAdmin() {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/admins', {
            onSuccess: () => {
                // Reset form
                setData({
                    nama_lengkap: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    role: 'admin',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Administrator</h1>
                    <Link href="/admin/admins">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Admins
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-purple-300 flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Administrator Information
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

                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="admin-bg-purple"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Creating...' : 'Create Administrator'}
                                        </Button>
                                        <Link href="/admin/admins">
                                            <Button variant="outline" type="button">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-yellow-300 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Important Notice
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <p className="text-sm text-yellow-300">
                                        You are creating an administrator account with full system access. 
                                        Please ensure this person is trusted and authorized.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-blue-300">Admin Privileges</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-purple-300 mb-2">Administrator Access</h4>
                                    <ul className="text-sm space-y-1 text-gray-300">
                                        <li>• Full dashboard access</li>
                                        <li>• User management</li>
                                        <li>• Product management</li>
                                        <li>• Order management</li>
                                        <li>• System settings</li>
                                        <li>• Reports and analytics</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-green-300 mb-2">Security Features</h4>
                                    <ul className="text-sm space-y-1 text-gray-300">
                                        <li>• Account will be auto-verified</li>
                                        <li>• Strong password required</li>
                                        <li>• Activity logging enabled</li>
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
