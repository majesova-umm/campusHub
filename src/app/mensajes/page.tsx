import Navigation from '../../components/Navigation';
import MessagesClient from '../../components/MessagesClient';
import { initialConversations } from '../../data/initialConversations';

export const metadata = { title: 'Mensajes | Campus Hub' };

export default function MessagesPage() {
  return <><Navigation activePath="/mensajes" /><MessagesClient initialConversations={initialConversations} /></>;
}
