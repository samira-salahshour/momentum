import { LogProgressForm } from "@/src/components/log-progress-form";

export default function LogTodayPage() {
  return (
    <>
      <div className="page-heading max-w-2xl">
        <div>
          <p className="eyebrow">Daily check-in</p>
          <h1 className="page-title">Log today&apos;s progress</h1>
          <p className="page-description">
            Record where you are today. Saving again updates the same entry.
          </p>
        </div>
      </div>
      <LogProgressForm />
    </>
  );
}
