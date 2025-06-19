import { NavFooter } from '@/components/admin/nav-footer';
import { NavMain } from '@/components/admin/nav-main';
import { NavUser } from '@/components/admin/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    Users,
    Tag,
    Settings,
    ShoppingCart,
    BarChart3,
    UserCog,
    Store,
    Award
} from 'lucide-react';
import AppLogo from '../app-logo';

const mainNavItems: NavItem[] = [
    // Dashboard Section
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },

    // E-commerce Management Section
    {
        title: 'Products',
        href: '/admin/products',
        icon: Store,
        dropdown: [
            {
                title: 'All Products',
                href: '/admin/products',
            },
            {
                title: 'Add Product',
                href: '/admin/products/create',
            },
        ],
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: Tag,
        dropdown: [
            {
                title: 'All Categories',
                href: '/admin/categories',
            },
            {
                title: 'Add Category',
                href: '/admin/categories/create',
            },
        ],
    },
    {
        title: 'Brands',
        href: '/admin/brands',
        icon: Award,
        dropdown: [
            {
                title: 'All Brands',
                href: '/admin/brands',
            },
            {
                title: 'Add Brand',
                href: '/admin/brands/create',
            },
        ],
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart,
        dropdown: [
            {
                title: 'All Orders',
                href: '/admin/orders',
            },
            {
                title: 'Pending Orders',
                href: '/admin/orders/pending',
            },
        ],
    },

    // User Management Section
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users,
        dropdown: [
            {
                title: 'All Users',
                href: '/admin/users',
            },
            {
                title: 'Create User',
                href: '/admin/users/create',
            },
        ],
    },
    {
        title: 'Administrators',
        href: '/admin/admins',
        icon: UserCog,
        dropdown: [
            {
                title: 'All Admins',
                href: '/admin/admins',
            },
            {
                title: 'Create Admin',
                href: '/admin/admins/create',
            },
        ],
    },

    // Note: Reports section coming soon
    // {
    //     title: 'Reports',
    //     href: '/admin/reports',
    //     icon: BarChart3,
    //     dropdown: [
    //         {
    //             title: 'Sales Report',
    //             href: '/admin/reports/sales',
    //         },
    //         {
    //             title: 'Inventory Report',
    //             href: '/admin/reports/inventory',
    //         },
    //     ],
    // },

    // Settings Section
    {
        title: 'Settings',
        href: '/admin/settings/profile',
        icon: Settings,
        dropdown: [
            {
                title: 'Profile Settings',
                href: '/admin/settings/profile',
            },
            {
                title: 'Change Password',
                href: '/admin/settings/password',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // Note: Help and documentation pages coming soon
    // {
    //     title: 'Help Center',
    //     href: '/admin/help',
    //     icon: BookOpen,
    // },
    // {
    //     title: 'Documentation',
    //     href: '/admin/docs',
    //     icon: Folder,
    // },
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
