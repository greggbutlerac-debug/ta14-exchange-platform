import GenericGovernanceShowcase, {
  generateMetadata as generateGenericMetadata,
} from '../../workspace/ai-governance/registry/showcase/[registryIdentifier]/page';
import VelosShowcase from '../TA-14-AIGR-000029/VelosShowcase';
import Link from 'next/link';

type Props = { params: Promise<{ registryIdentifier: string }> };

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props) {
  const { registryIdentifier } = await params;

  if (decodeURIComponent(registryIdentifier).toUpperCase() === 'TA-14-AIGR-000029') {
    return {
      title: 'Velos Systems v1.0.0 | TA-14 Governance Showcase',
      description:
        'Interactive TA-14 governance showcase for Velos Systems v1.0.0, TA-14-AIGR-000029, preserving separate prior and successor R1 examination chains.',
    };
  }

  return generateGenericMetadata({ params });
}

export default async function GovernanceShowcaseRoute(props: Props) {
  const { registryIdentifier } = await props.params;

  if (decodeURIComponent(registryIdentifier).toUpperCase() === 'TA-14-AIGR-000029') {
    return <VelosShowcase />;
  }

  if (decodeURIComponent(registryIdentifier).toUpperCase() === 'TA-14-AIGR-000044') {
    return <><div style={{position:'fixed',right:18,bottom:18,zIndex:9999}}><Link href="/habits-ta14-interoperability" style={{display:'inline-flex',alignItems:'center',minHeight:54,padding:'0 20px',borderRadius:14,background:'linear-gradient(135deg,#f5d48c,#d5a346)',color:'#07111b',fontSize:12,fontWeight:950,letterSpacing:'.05em',textDecoration:'none',boxShadow:'0 18px 50px rgba(0,0,0,.35)'}}>ENTER HABITS × TA-14 BOUNDED EXAMINATION →</Link></div><GenericGovernanceShowcase {...props} /></>;
  }

  return GenericGovernanceShowcase(props);
}
