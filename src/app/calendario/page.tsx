import Navigation from '../../components/Navigation';
import CalendarClient from '../../components/CalendarClient';
import { initialTasks } from '../../data/initialTasks';

export const metadata = { title: 'Calendario | Campus Hub' };

export default function CalendarPage() {
  return <><Navigation activePath="/calendario" /><CalendarClient initialTasks={initialTasks} /></>;
}
