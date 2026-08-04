import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface TimelineChartProps {
  data: { date: string; count: number }[];
  className?: string;
}

export function TimelineChart({ data, className }: TimelineChartProps) {
  return (
    <div className={cn('h-[300px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
          />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--color-foreground-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--color-foreground-muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-foreground)',
            }}
            formatter={((value: number) => [value, 'Countries']) as any}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#timelineGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
