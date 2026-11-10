import { Metadata } from 'next';
import HelpCentre from './help-centre';

export const metadata: Metadata = {
  title: 'Help Centre | Upbreed Learn',
  description: 'Answers about your Upbreed Learn account, membership, classes and 1-on-1 sessions, and how to reach us.',
};

export default function Page() {
  return <HelpCentre />;
}
