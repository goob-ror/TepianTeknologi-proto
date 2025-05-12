import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

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
                                                className="justify-between"
                                            >
                                                <div className="flex items-center">
                                                    {item.icon && <item.icon className="mr-2" />}
                                                    <span>{item.title}</span>
                                                </div>
                                                <ChevronDown className={`h-4 w-4 transition-transform ${openDropdowns[item.title] ? 'rotate-180' : ''}`} />
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
                                        >
                                            <Link href={item.href} prefetch>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
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
