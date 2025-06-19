import { cn } from '@/lib/utils';
import { Hash, Package, Users, Tag, Store } from 'lucide-react';

interface CountBadgeProps {
    count: number;
    label?: string;
    type?: 'products' | 'users' | 'categories' | 'brands' | 'default';
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

export function CountBadge({ 
    count, 
    label,
    type = 'default',
    size = 'md', 
    showIcon = true,
    className 
}: CountBadgeProps) {
    const getTypeConfig = (type: string, count: number) => {
        const baseConfig = {
            icon: Hash,
            bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
            textColor: 'text-white',
            borderColor: 'border-gray-500',
            glowColor: 'shadow-gray-500/25'
        };

        switch (type) {
            case 'products':
                return {
                    icon: Package,
                    bgColor: count === 0 
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                        : count <= 5 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500'
                            : count <= 20
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500',
                    textColor: 'text-white',
                    borderColor: count === 0 
                        ? 'border-gray-400'
                        : count <= 5 
                            ? 'border-orange-500'
                            : count <= 20
                                ? 'border-blue-500'
                                : 'border-green-500',
                    glowColor: count === 0 
                        ? 'shadow-gray-400/25'
                        : count <= 5 
                            ? 'shadow-orange-500/25'
                            : count <= 20
                                ? 'shadow-blue-500/25'
                                : 'shadow-green-500/25'
                };
            case 'users':
                return {
                    icon: Users,
                    bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
                    textColor: 'text-white',
                    borderColor: 'border-purple-500',
                    glowColor: 'shadow-purple-500/25'
                };
            case 'categories':
                return {
                    icon: Tag,
                    bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
                    textColor: 'text-white',
                    borderColor: 'border-yellow-500',
                    glowColor: 'shadow-yellow-500/25'
                };
            case 'brands':
                return {
                    icon: Store,
                    bgColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
                    textColor: 'text-white',
                    borderColor: 'border-pink-500',
                    glowColor: 'shadow-pink-500/25'
                };
            default:
                return baseConfig;
        }
    };

    const getSizeClasses = (size: string) => {
        switch (size) {
            case 'sm':
                return {
                    container: 'px-2 py-1 text-xs',
                    icon: 'h-3 w-3',
                    gap: 'gap-1'
                };
            case 'lg':
                return {
                    container: 'px-4 py-2 text-sm',
                    icon: 'h-5 w-5',
                    gap: 'gap-2'
                };
            default: // md
                return {
                    container: 'px-3 py-1.5 text-xs',
                    icon: 'h-4 w-4',
                    gap: 'gap-1.5'
                };
        }
    };

    const getDisplayText = () => {
        if (label) {
            return `${count} ${label}`;
        }
        
        switch (type) {
            case 'products':
                return count === 1 ? '1 product' : `${count} products`;
            case 'users':
                return count === 1 ? '1 user' : `${count} users`;
            case 'categories':
                return count === 1 ? '1 category' : `${count} categories`;
            case 'brands':
                return count === 1 ? '1 brand' : `${count} brands`;
            default:
                return count.toString();
        }
    };

    const typeConfig = getTypeConfig(type, count);
    const sizeClasses = getSizeClasses(size);
    const Icon = typeConfig.icon;

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-semibold',
                'border shadow-lg transition-all duration-200 hover:scale-105',
                'backdrop-blur-sm',
                typeConfig.bgColor,
                typeConfig.textColor,
                typeConfig.borderColor,
                typeConfig.glowColor,
                sizeClasses.container,
                sizeClasses.gap,
                className
            )}
        >
            {showIcon && (
                <Icon className={cn(sizeClasses.icon, 'flex-shrink-0')} />
            )}
            <span className="font-medium whitespace-nowrap">
                {getDisplayText()}
            </span>
        </div>
    );
}

// Export a simple count badge for basic usage
export function SimpleCountBadge({ count, className }: { count: number; className?: string }) {
    return (
        <CountBadge 
            count={count} 
            type="default" 
            size="sm" 
            showIcon={false}
            className={className}
        />
    );
}
