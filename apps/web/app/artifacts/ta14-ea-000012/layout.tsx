import type { ReactNode } from 'react';
import ExecutableArtifactProof from '../components/ExecutableArtifactProof';
import FoundingArtifactCopyCorrections from '../components/FoundingArtifactCopyCorrections';
export default function Layout({children}:{children:ReactNode}){return <><FoundingArtifactCopyCorrections artifactId='TA14-EA-000012' sequence={12}/>{children}<ExecutableArtifactProof artifactId='TA14-EA-000012'/></>}
