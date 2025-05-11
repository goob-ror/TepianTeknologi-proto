import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#8884d8" 
                                fill="#8884d8" 
                                fillOpacity={0.3} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
