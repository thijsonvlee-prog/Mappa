import { useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useCountryStore } from '@/stores/country-store';

export function TagDistribution() {
  const visits = useCountryStore((s) => s.visits);
  const tags = useCountryStore((s) => s.tags);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const visit of visits.values()) {
      for (const tagId of visit.tagIds) {
        counts.set(tagId, (counts.get(tagId) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([tagId, count]) => {
        const tag = tags.get(tagId);
        if (!tag) return null;
        return { id: tagId, name: tag.name, color: tag.color, count };
      })
      .filter(Boolean)
      .sort((a, b) => b!.count - a!.count) as {
      id: string;
      name: string;
      color: string;
      count: number;
    }[];
  }, [visits, tags]);

  const maxCount = tagCounts.length > 0 ? tagCounts[0].count : 0;

  if (tagCounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">Tags</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">
            No tags in use yet. Add tags to your countries to see distribution here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-foreground">Tags</h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tagCounts.map((tag) => (
            <li key={tag.id}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {tag.name}
                  </span>
                </div>
                <span className="text-sm text-foreground-muted">
                  {tag.count} {tag.count === 1 ? 'country' : 'countries'}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-background-secondary">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(tag.count / maxCount) * 100}%`,
                    backgroundColor: tag.color,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
