import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ProductsChartProps {
    data: {
        name: string;
        value: number;
    }[];
    title: string;
    className?: string;
}

export function ProductsChart({ data, title, className }: ProductsChartProps) {
    return (
        <Card className={cn('border-2 border-blue-500/20 shadow-lg', className)}>
            <CardHeader className="bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                <CardTitle className="text-light-text flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#3B82F6" opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                stroke="#FFFFFF"
                                fontSize={12}
                            />
                            <YAxis
                                stroke="#FFFFFF"
                                fontSize={12}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #3B82F6',
                                    borderRadius: '8px',
                                    color: '#FFFFFF'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3B82F6"
                                fill="url(#colorGradient)"
                                fillOpacity={0.6}
                                strokeWidth={3}
                            />
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
