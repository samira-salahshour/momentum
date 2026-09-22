import { CreateGoalForm } from "@/src/components/create-goal-form";

export default function CreateGoalPage() {
  return (
    <>
      <div className="page-heading max-w-2xl">
        <div>
          <p className="eyebrow">New goal</p>
          <h1 className="page-title">What do you want to build?</h1>
          <p className="page-description">
            Choose a clear daily target and a time frame for your goal.
          </p>
        </div>
      </div>
      <CreateGoalForm />
    </>
  );
}
