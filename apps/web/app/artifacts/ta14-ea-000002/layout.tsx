import type { ReactNode } from 'react';
import ExecutableArtifactProof from '../components/ExecutableArtifactProof';
import FoundingArtifactCopyCorrections from '../components/FoundingArtifactCopyCorrections';
export default function Layout({children}:{children:ReactNode}){return <><FoundingArtifactCopyCorrections artifactId='TA14-EA-000002' sequence={2}/>{children}<ExecutableArtifactProof artifactId='TA14-EA-000002'/></>}
