import { NavFooter } from '@/components/admin/nav-footer';
import { NavMain } from '@/components/admin/nav-main';
import { NavUser } from '@/components/admin/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarDropdown } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Calendar, Settings } from 'lucide-react';
import AppLogo from '../app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Manage Users',
        href: '/admin/users',
        icon: Users,
        dropdown: [
            {
                title: 'View Users',
                href: '/admin/users/view',
            },
            {
                title: 'Add User',
                href: '/admin/users/add',
            },
        ],
    },
    {
        title: 'Manage Product',
        href: '/admin/products',
        icon: Folder,
        dropdown: [
            {
                title: 'View Products',
                href: '/admin/products/view',
            },
            {
                title: 'Add Product',
                href: '/admin/products/add',
            },
        ],
    },
    {
        title: 'Manage Categories',
        href: '/admin/categories',
        icon: Calendar,
        dropdown: [
            {
                title: 'View Categories',
                href: '/admin/categories',
            },
            {
                title: 'Add Category',
                href: '/admin/categories/add',
            },
        ],
    },
    {
        title: 'Manage Admin',
        href: '/admin/admins',
        icon: Settings,
        dropdown: [
            {
                title: 'View Admins',
                href: '/admin/admins/view',
            },
            {
                title: 'Add Admin',
                href: '/admin/admins/add',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
    {
        title: 'Support',
        href: 'https://laravel.com/support',
        icon: Users,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
