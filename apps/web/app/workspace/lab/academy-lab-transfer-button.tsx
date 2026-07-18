"use client";

import { useRouter } from "next/navigation";
import type { AcademyLab } from "../../../lib/academy-labs";
import { stageAcademyLabTransfer } from "../../../lib/academy-lab-transfer";

type AcademyLabTransferButtonProps = {
  lab: AcademyLab;
  className?: string;
  children?: React.ReactNode;
};

export default function AcademyLabTransferButton({
  lab,
  className,
  children = "Transfer to Route Builder →",
}: AcademyLabTransferButtonProps) {
  const router = useRouter();

  function transfer() {
    stageAcademyLabTransfer(lab);
    router.push("/workspace/build");
  }

  return (
    <button
      type="button"
      className={className}
      onClick={transfer}
    >
      {children}
    </button>
  );
}
