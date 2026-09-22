import { HistoryClient } from "@/src/components/history-client";

export default function HistoryPage() {
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Past progress</p>
          <h1 className="page-title">History</h1>
          <p className="page-description">
            Review every progress entry, newest first.
          </p>
        </div>
      </div>
      <HistoryClient />
    </>
  );
}
