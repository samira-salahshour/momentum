import Link from "next/link";

import { DashboardClient } from "@/src/components/dashboard-client";

export default function Home() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="page-title">Keep your momentum</h1>
          <p className="page-description">
            Track today&apos;s effort and stay consistent with what matters.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="secondary-link" href="/goals/new">
            Create goal
          </Link>
          <Link className="primary-link" href="/log">
            Log today
          </Link>
        </div>
      </div>
      <DashboardClient />
    </>
  );
}
