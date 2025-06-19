import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
    colorTheme?: 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'orange';
}

export function StatCard({ title, value, icon: Icon, description, trend, className, colorTheme = 'blue' }: StatCardProps) {
    const getColorClasses = (theme: string) => {
        switch (theme) {
            case 'blue':
                return 'admin-stat-card-blue';
            case 'green':
                return 'admin-stat-card-green';
            case 'yellow':
                return 'admin-stat-card-yellow';
            case 'purple':
                return 'admin-stat-card-purple';
            case 'pink':
                return 'admin-stat-card-pink';
            case 'orange':
                return 'admin-stat-card-orange';
            default:
                return 'admin-stat-card-blue';
        }
    };

    return (
        <Card className={cn('overflow-hidden shadow-lg', getColorClasses(colorTheme), className)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white">{title}</CardTitle>
                <Icon className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                {description && <p className="text-xs text-white opacity-80 mt-1">{description}</p>}
                {trend && (
                    <div className="flex items-center mt-1">
                        <span
                            className={cn(
                                'text-xs font-medium',
                                trend.isPositive ? 'text-green-200' : 'text-red-200'
                            )}
                        >
                            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                        </span>
                        <span className="text-xs text-white opacity-80 ml-1">from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
