import { OverviewCards } from './OverviewCards';
import { ContinentBreakdown } from './ContinentBreakdown';
import { VisitTimeline } from './VisitTimeline';
import { TopRatedList } from './TopRatedList';
import { TagDistribution } from './TagDistribution';

export function StatisticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">Statistics</h1>

      <OverviewCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <ContinentBreakdown />
        <VisitTimeline />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopRatedList />
        <TagDistribution />
      </div>
    </div>
  );
}
