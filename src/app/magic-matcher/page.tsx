import { Metadata } from 'next';
import { MagicMatcherPage } from '@/components/magic-matcher/MagicMatcherPage';

export const metadata: Metadata = {
  title: 'Magic Matcher - LinkMatch',
  description: 'Find the perfect talent match using AI-powered search',
};

export default function MagicMatcher() {
  return <MagicMatcherPage />;
}
