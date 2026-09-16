import FrontDoorPrototype from '../../../prototypes/front-door-institutional-map-2026-09-09/FrontDoorPrototype';
import RainEnhancer from './front-door-preview/RainEnhancer';
import ArchitectureFamilyEnhancer from './front-door-preview/ArchitectureFamilyEnhancer';
import InstitutionalEngagementEnhancer from './front-door-preview/InstitutionalEngagementEnhancer';
import CanonicalChain24 from './front-door-preview/CanonicalChain24';
import './front-door-preview/multilingual-rain.css';

export default function HomePage() {
  return (
    <>
      <RainEnhancer />
      <ArchitectureFamilyEnhancer />
      <InstitutionalEngagementEnhancer />
      <FrontDoorPrototype />
      <CanonicalChain24 />
    </>
  );
}
