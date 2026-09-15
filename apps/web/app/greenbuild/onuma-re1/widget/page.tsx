import type { Metadata } from 'next';
import GreenbuildOnumaRE1Widget from './GreenbuildOnumaRE1Widget';

export const metadata: Metadata = {
  title: 'TA-14 RE1 Execution Authority Widget | Greenbuild 2026',
  description: 'Compact ONUMA × TA-14 RE1 authority-boundary widget for Greenbuild 2026.',
};

export default function GreenbuildOnumaRE1WidgetPage() {
  return <GreenbuildOnumaRE1Widget />;
}
