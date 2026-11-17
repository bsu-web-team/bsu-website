import PublicMotion from "@/components/layout/PublicMotion";
// BSU public design v2: shared server layout for this section and its children.
import type { ReactNode } from "react";
export default function PublicSectionLayout({ children }: { children: ReactNode }) {
  return <div className="bsu-public bsu-public-faculties"><PublicMotion />{children}</div>;
}
