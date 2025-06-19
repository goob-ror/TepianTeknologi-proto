import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/admin-app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, User as UserIcon, Shield, Calendar, UserCheck, UserX } from 'lucide-react';

interface Props {
    user: User;
}

export default function ShowUser({ user }: Props) {
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
            title: 'User Details',
            href: `/admin/users/${user.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User Details - ${user.nama_lengkap || user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">User Details</h1>
                    <div className="flex gap-2">
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Button className="admin-bg-blue">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-blue-300 flex items-center gap-2">
                                    <UserIcon className="h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                                        <p className="text-lg font-medium">{user.nama_lengkap || user.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <p className="text-lg">{user.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Role</label>
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-gray-400" />
                                            <Badge 
                                                variant="outline" 
                                                className={user.role === 'admin' ? 'border-purple-500 text-purple-300' : 'border-blue-500 text-blue-300'}
                                            >
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-400">Status</label>
                                        <div className="flex items-center gap-2">
                                            {user.email_verified_at ? (
                                                <>
                                                    <UserCheck className="h-4 w-4 text-green-500" />
                                                    <Badge variant="outline" className="border-green-500 text-green-300">
                                                        Active
                                                    </Badge>
                                                </>
                                            ) : (
                                                <>
                                                    <UserX className="h-4 w-4 text-red-500" />
                                                    <Badge variant="outline" className="border-red-500 text-red-300">
                                                        Inactive
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-300 flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Account Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium">Account Created</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium">Last Updated</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(user.updated_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {user.email_verified_at && (
                                        <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium">Email Verified</p>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(user.email_verified_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-yellow-300">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Link href={`/admin/users/${user.id}/edit`}>
                                    <Button className="w-full admin-bg-blue">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit User
                                    </Button>
                                </Link>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => {
                                        // Add reset password functionality
                                        console.log('Reset password for user:', user.id);
                                    }}
                                >
                                    Reset Password
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => {
                                        // Add toggle status functionality
                                        console.log('Toggle status for user:', user.id);
                                    }}
                                >
                                    {user.email_verified_at ? 'Deactivate' : 'Activate'} Account
                                </Button>
                            </CardContent>
                        </Card>

                        {/* User Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-purple-300">Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-300">0</p>
                                    <p className="text-sm text-gray-400">Total Orders</p>
                                </div>
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                    <p className="text-2xl font-bold text-green-300">Rp 0</p>
                                    <p className="text-sm text-gray-400">Total Spent</p>
                                </div>
                                <div className="text-center p-4 bg-muted/20 rounded-lg">
                                    <p className="text-2xl font-bold text-yellow-300">
                                        {Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                                    </p>
                                    <p className="text-sm text-gray-400">Days as Member</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
