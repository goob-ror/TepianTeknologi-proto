import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

    const getIconColor = (title: string) => {
        switch (title) {
            case 'Dashboard': return 'text-blue-400';
            case 'Products': return 'text-green-400';
            case 'Categories': return 'text-yellow-400';
            case 'Orders': return 'text-purple-400';
            case 'Users': return 'text-pink-400';
            case 'Admins': return 'text-orange-400';
            case 'Reports': return 'text-cyan-400';
            case 'Settings': return 'text-indigo-400';
            default: return 'text-blue-400';
        }
    };

    const getDotColor = (title: string) => {
        switch (title) {
            case 'Dashboard': return 'bg-blue-500';
            case 'Products': return 'bg-green-500';
            case 'Categories': return 'bg-yellow-500';
            case 'Orders': return 'bg-purple-500';
            case 'Users': return 'bg-pink-500';
            case 'Admins': return 'bg-orange-500';
            case 'Reports': return 'bg-cyan-500';
            case 'Settings': return 'bg-indigo-500';
            default: return 'bg-blue-500';
        }
    };

    const toggleDropdown = (title: string) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // Group items by section based on comments in the array
    const groupItems = () => {
        const groups: { [key: string]: NavItem[] } = {
            'Main': [],
            'E-commerce': [],
            'User Management': [],
            'Reports': [],
            'Settings': []
        };

        items.forEach(item => {
            if (item.title === 'Dashboard') {
                groups['Main'].push(item);
            } else if (['Products', 'Categories', 'Orders'].includes(item.title)) {
                groups['E-commerce'].push(item);
            } else if (['Users', 'Admins'].includes(item.title)) {
                groups['User Management'].push(item);
            } else if (item.title === 'Reports') {
                groups['Reports'].push(item);
            } else if (item.title === 'Settings') {
                groups['Settings'].push(item);
            } else {
                groups['Main'].push(item);
            }
        });

        return groups;
    };

    const groups = groupItems();

    return (
        <>
            {Object.entries(groups).map(([groupName, groupItems]) => (
                groupItems.length > 0 && (
                    <SidebarGroup key={groupName} className="px-2 py-0">
                        <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
                        <SidebarMenu>
                            {groupItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.dropdown ? (
                                        <>
                                            <SidebarMenuButton
                                                isActive={item.href === page.url || (item.dropdown && item.dropdown.some(subItem => subItem.href === page.url))}
                                                tooltip={{ children: item.title }}
                                                onClick={() => toggleDropdown(item.title)}
                                                className="justify-between hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.icon && <item.icon className={`mr-2 ${getIconColor(item.title)}`} />}
                                                    <span>{item.title}</span>
                                                    <div className={`w-2 h-2 rounded-full ${getDotColor(item.title)}`}></div>
                                                </div>
                                                <ChevronDown className={`h-4 w-4 transition-transform text-gray-400 ${openDropdowns[item.title] ? 'rotate-180' : ''}`} />
                                            </SidebarMenuButton>
                                            {openDropdowns[item.title] && (
                                                <SidebarMenuSub>
                                                    {item.dropdown.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={subItem.href === page.url}
                                                            >
                                                                <Link href={subItem.href} prefetch>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            )}
                                        </>
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            isActive={item.href === page.url}
                                            tooltip={{ children: item.title }}
                                            className="hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-200"
                                        >
                                            <Link href={item.href} prefetch className="flex items-center gap-3">
                                                {item.icon && <item.icon className={getIconColor(item.title)} />}
                                                <span>{item.title}</span>
                                                <div className={`w-2 h-2 rounded-full ml-auto ${getDotColor(item.title)}`}></div>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )
            ))}
        </>
    );
}
