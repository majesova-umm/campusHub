import Navigation from '../../components/Navigation';
import TasksClient from '../../components/TasksClient';
import { initialTasks } from '../../data/initialTasks';

export const metadata = { title: 'Tareas | Campus Hub' };

export default function TasksPage() {
  return (
    <>
      <Navigation activePath="/tareas" />
      <TasksClient initialTasks={initialTasks} />
    </>
  );
}
