import type { WorkflowStep } from "../types/models";

type SearchWorkflowPanelProps = {
  steps?: WorkflowStep[];
};

export function SearchWorkflowPanel({ steps = [] }: SearchWorkflowPanelProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="card">
      <h2>Algorithm Workflow</h2>

      {steps.map((step) => (
        <div key={step.title} className="workflow-step">
          <strong>{step.title}</strong>
          <p>{step.value}</p>
        </div>
      ))}
    </section>
  );
}