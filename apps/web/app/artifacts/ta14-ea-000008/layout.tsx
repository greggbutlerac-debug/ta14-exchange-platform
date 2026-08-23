import type { ReactNode } from 'react';
import ExecutableArtifactProof from '../components/ExecutableArtifactProof';
import FoundingArtifactCopyCorrections from '../components/FoundingArtifactCopyCorrections';
export default function Layout({children}:{children:ReactNode}){return <><FoundingArtifactCopyCorrections artifactId='TA14-EA-000008' sequence={8}/>{children}<ExecutableArtifactProof artifactId='TA14-EA-000008'/></>}
