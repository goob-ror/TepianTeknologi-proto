import { cn } from '@/lib/utils';
import { Package, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface StockBadgeProps {
    stock: number;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    showText?: boolean;
    className?: string;
}

export function StockBadge({ 
    stock, 
    size = 'md', 
    showIcon = true, 
    showText = true,
    className 
}: StockBadgeProps) {
    const getStockStatus = (stock: number) => {
        if (stock === 0) {
            return {
                status: 'out-of-stock',
                label: 'Out of Stock',
                icon: XCircle,
                bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
                textColor: 'text-white',
                borderColor: 'border-red-500',
                glowColor: 'shadow-red-500/25'
            };
        } else if (stock <= 5) {
            return {
                status: 'critical',
                label: `${stock} units`,
                icon: AlertTriangle,
                bgColor: 'bg-gradient-to-r from-orange-500 to-red-500',
                textColor: 'text-white',
                borderColor: 'border-orange-500',
                glowColor: 'shadow-orange-500/25'
            };
        } else if (stock <= 10) {
            return {
                status: 'low',
                label: `${stock} units`,
                icon: AlertTriangle,
                bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
                textColor: 'text-white',
                borderColor: 'border-yellow-500',
                glowColor: 'shadow-yellow-500/25'
            };
        } else if (stock <= 20) {
            return {
                status: 'medium',
                label: `${stock} units`,
                icon: Package,
                bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                textColor: 'text-white',
                borderColor: 'border-blue-500',
                glowColor: 'shadow-blue-500/25'
            };
        } else {
            return {
                status: 'good',
                label: `${stock} units`,
                icon: CheckCircle,
                bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
                textColor: 'text-white',
                borderColor: 'border-green-500',
                glowColor: 'shadow-green-500/25'
            };
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

    const stockInfo = getStockStatus(stock);
    const sizeClasses = getSizeClasses(size);
    const Icon = stockInfo.icon;

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-semibold',
                'border shadow-lg transition-all duration-200 hover:scale-105',
                'backdrop-blur-sm',
                stockInfo.bgColor,
                stockInfo.textColor,
                stockInfo.borderColor,
                stockInfo.glowColor,
                sizeClasses.container,
                sizeClasses.gap,
                className
            )}
        >
            {showIcon && (
                <Icon className={cn(sizeClasses.icon, 'flex-shrink-0')} />
            )}
            {showText && (
                <span className="font-medium whitespace-nowrap">
                    {stockInfo.label}
                </span>
            )}
        </div>
    );
}

// Export a simple function for getting stock status color classes
export function getStockColorClasses(stock: number) {
    if (stock === 0) {
        return 'text-red-500 bg-red-50 border-red-200';
    } else if (stock <= 5) {
        return 'text-orange-500 bg-orange-50 border-orange-200';
    } else if (stock <= 10) {
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    } else if (stock <= 20) {
        return 'text-blue-500 bg-blue-50 border-blue-200';
    } else {
        return 'text-green-500 bg-green-50 border-green-200';
    }
}
