import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

interface StatusBreakdownProps {
  visited: number;
  planned: number;
  notVisited: number;
  className?: string;
}

const STATUS_CONFIG = [
  { key: 'visited', label: 'Visited', color: 'var(--color-visited)' },
  { key: 'planned', label: 'Planned', color: 'var(--color-planned)' },
  { key: 'notVisited', label: 'Not Visited', color: 'var(--color-not-visited)' },
] as const;

export function StatusBreakdown({ visited, planned, notVisited, className }: StatusBreakdownProps) {
  const data = [
    { name: 'Visited', value: visited },
    { name: 'Planned', value: planned },
    { name: 'Not Visited', value: notVisited },
  ].filter((d) => d.value > 0);

  const total = visited + planned + notVisited;

  return (
    <div className={cn('h-[300px] w-full', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry) => {
              const config = STATUS_CONFIG.find((s) => s.label === entry.name);
              return (
                <Cell
                  key={entry.name}
                  fill={config?.color ?? 'var(--color-border)'}
                />
              );
            })}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-foreground)',
            }}
            formatter={((value: number) => [
              `${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
            ]) as any}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground text-2xl font-bold"
          >
            {total}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
