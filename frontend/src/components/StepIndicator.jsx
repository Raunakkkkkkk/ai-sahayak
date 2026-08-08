export default function StepIndicator({ current }) {
  const steps = ["Describe", "Profile", "Visibility"];
  return (
    <div className="step-indicator">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "active" : "pending";
        return (
          <div className={`step step-${state}`} key={label}>
            <span className="step-dot">{state === "done" ? "✓" : n}</span>
            <span className="step-label">{label}</span>
            {i < steps.length - 1 && <span className="step-line" />}
          </div>
        );
      })}
    </div>
  );
}