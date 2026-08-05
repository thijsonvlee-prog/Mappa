import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useStatistics } from './hooks/useStatistics';

// Continent accent colors from design system
const CONTINENT_COLORS: Record<string, string> = {
  'Europe': '#1B3A5C',      // Atlas navy
  'Asia': '#8B5E3C',         // Warm brown
  'Africa': '#C17B3A',       // Terracotta
  'North America': '#4A6741', // Pine green
  'South America': '#B85C38', // Burnt sienna
  'Oceania': '#2E7D82',      // Ocean teal
  'Antarctica': '#94A3B8',   // Ice gray
};

export function ContinentBreakdown() {
  const stats = useStatistics();

  const data = stats.byContinent.map((c) => ({
    name: c.name,
    visited: c.visited,
    total: c.total,
    label: `${c.visited}/${c.total}`,
  }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Per continent</h3>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
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
              <Bar dataKey="visited" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CONTINENT_COLORS[entry.name] ?? 'var(--color-primary)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
