import { notFound } from "next/navigation";

import {
  getAcademyLab,
  getAcademyLabIds,
} from "../../../../lib/academy-labs";
import AcademyLabDetailClient from "./academy-lab-detail-client";

type AcademyLabDetailPageProps = {
  params: Promise<{
    labId: string;
  }>;
};

export function generateStaticParams() {
  return getAcademyLabIds().map((labId) => ({
    labId,
  }));
}

export function generateMetadata({
  params,
}: AcademyLabDetailPageProps) {
  return params.then(({ labId }) => {
    const lab = getAcademyLab(labId);

    if (!lab) {
      return {
        title: "Academy Lab Not Found | TA-14 Exchange Platform",
      };
    }

    return {
      title: `${lab.title} | TA-14 Academy Lab`,
      description: lab.summary,
    };
  });
}

export default async function AcademyLabDetailPage({
  params,
}: AcademyLabDetailPageProps) {
  const { labId } = await params;
  const lab = getAcademyLab(labId);

  if (!lab) {
    notFound();
  }

  return <AcademyLabDetailClient lab={lab} />;
}

export const dynamicParams = false;
export const revalidate = false;
