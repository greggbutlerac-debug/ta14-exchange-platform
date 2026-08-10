import { redirect } from "next/navigation";

export const metadata = {
  title: "Simulation Center | TA-14 Academy",
};

export default function SimulationCenterCompatibilityPage() {
  redirect("/academy/simulator");
}
