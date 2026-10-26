import Navigation from '../components/Navigation';
import DashboardClient from '../components/DashboardClient';
import { ActivityPanel, ProgressPanel } from '../components/Dashboard';
import { initialTasks } from '../data/initialTasks';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <DashboardClient
        initialTasks={initialTasks}
        progressPanel={<ProgressPanel />}
        activityPanel={<ActivityPanel />}
      />
    </>
  );
}
