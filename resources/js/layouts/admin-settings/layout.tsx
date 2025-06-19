import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, useEffect } from 'react';
import { initializeAdminTheme } from '@/hooks/use-appearance';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/admin/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        href: '/admin/settings/password',
        icon: null,
    },
    // Note: Appearance option removed for admin - admin pages are always dark mode
];

export default function AdminSettingsLayout({ children }: PropsWithChildren) {
    // Ensure admin pages are always in dark mode
    useEffect(() => {
        initializeAdminTheme();
    }, []);

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="admin-page px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-green-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    Admin Settings
                </h1>
                <p className="text-light-text opacity-70">Manage your admin profile and account settings</p>
            </div>

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = currentPath === item.href;
                            const colorClass = index === 0 ? 'hover:bg-blue-600/20 hover:border-blue-500' : 'hover:bg-green-600/20 hover:border-green-500';
                            const activeColorClass = index === 0 ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-green-600/30 border-green-500 text-green-300';

                            return (
                                <Button
                                    key={`${item.href}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'w-full justify-start border border-transparent transition-all duration-200',
                                        isActive ? activeColorClass : `text-light-text ${colorClass}`
                                    )}
                                >
                                    <Link href={item.href} prefetch>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                'w-2 h-2 rounded-full',
                                                index === 0 ? 'bg-blue-500' : 'bg-green-500'
                                            )}></div>
                                            {item.title}
                                        </div>
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
