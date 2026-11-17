import type { ReactNode } from "react";
import PublicMotion from "@/components/layout/PublicMotion";
export default function Layout({children}:{children:ReactNode}){return <div className="bsu-public bsu-public-dormitories"><PublicMotion/>{children}</div>;}
