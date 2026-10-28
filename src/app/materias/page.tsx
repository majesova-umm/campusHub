import Navigation from '../../components/Navigation';
import SubjectsClient from '../../components/SubjectsClient';
import { initialTasks } from '../../data/initialTasks';

export const metadata = { title: 'Materias | Campus Hub' };

export default function SubjectsPage() {
  return <><Navigation activePath="/materias" /><SubjectsClient initialTasks={initialTasks} /></>;
}
