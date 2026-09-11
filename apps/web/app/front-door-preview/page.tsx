import FrontDoorPrototype from '../../../../prototypes/front-door-institutional-map-2026-09-09/FrontDoorPrototype';
import RainEnhancer from './RainEnhancer';
import './multilingual-rain.css';

export const metadata = {
  title: 'TA-14 Exchange Front Door — Non-Production Preview',
  description: 'Branch-isolated visual review surface for the TA-14 Exchange institutional front-door prototype.',
  robots: { index: false, follow: false },
};

export default function FrontDoorPreviewPage() {
  return <><RainEnhancer /><FrontDoorPrototype /></>;
}
