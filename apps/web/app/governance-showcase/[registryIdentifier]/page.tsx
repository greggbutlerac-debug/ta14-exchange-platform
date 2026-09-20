import GenericGovernanceShowcase, {
  generateMetadata as generateGenericMetadata,
} from '../../workspace/ai-governance/registry/showcase/[registryIdentifier]/page';
import VelosShowcase from '../TA-14-AIGR-000029/VelosShowcase';

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

  return GenericGovernanceShowcase(props);
}
