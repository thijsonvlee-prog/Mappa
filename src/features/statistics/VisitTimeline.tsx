import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useCountryStore } from '@/stores/country-store';

export function VisitTimeline() {
  const visits = useCountryStore((s) => s.visits);

  const timelineData = useMemo(() => {
    const visited = Array.from(visits.values())
      .filter((v) => v.status === 'visited' && v.createdAt)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    if (visited.length === 0) return [];

    return visited.map((v, i) => ({
      date: new Date(v.createdAt).toLocaleDateString('nl-NL', {
        month: 'short',
        year: 'numeric',
      }),
      count: i + 1,
    }));
  }, [visits]);

  if (timelineData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Reistijdlijn</h3>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-sm text-foreground-muted">
              Geen landen bezocht. Markeer landen als bezocht om je tijdlijn te zien.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Reistijdlijn</h3>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-visited)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-visited)" stopOpacity={0} />
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
                formatter={((value: number) => [value, 'Landen']) as any}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-visited)"
                strokeWidth={2}
                fill="url(#visitGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
