import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface ContinentChartProps {
  data: { name: string; visited: number; total: number }[];
  className?: string;
}

export function ContinentChart({ data, className }: ContinentChartProps) {
  return (
    <div className={cn('h-[300px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="var(--color-border)"
          />
          <XAxis
            type="number"
            tick={{ fill: 'var(--color-foreground-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={110}
            tick={{ fill: 'var(--color-foreground)', fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-foreground)',
            }}
            formatter={((value: number, _name: string, entry: { payload: { total: number } }) => [
              `${value} of ${entry.payload.total}`,
              'Visited',
            ]) as any}
          />
          <Bar
            dataKey="visited"
            fill="var(--color-visited)"
            radius={[0, 4, 4, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
