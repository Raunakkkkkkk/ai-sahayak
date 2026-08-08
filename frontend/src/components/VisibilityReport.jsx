import ScoreGauge from "./ScoreGauge.jsx";
import useTilt from "../hooks/useTilt.js";

function GaugePanel({ title, data }) {
  const tiltRef = useTilt(6);
  return (
    <div ref={tiltRef} className="gauge-panel tilt-card">
      <h3>{title}</h3>
      <ScoreGauge score={data.visibility_score} />
      <div className={`gauge-status ${data.would_be_mentioned ? "hit" : "miss"}`}>
        {data.would_be_mentioned ? "✅ Mentioned" : "❌ Not mentioned"}
      </div>
      <p className="gauge-reason">{data.reasoning}</p>
    </div>
  );
}

export default function VisibilityReport({ report }) {
  if (!report) return null;
  const { sample_queries, before, after, improvement_tips } = report;

  return (
    <div className="panel report-card">
      <p style={{ color: "var(--paper-dim)", fontSize: 14, marginTop: 0 }}>
        Simulated buyer questions an AI agent might get asked:
      </p>
      <ul className="query-list">
        {sample_queries?.map((q, i) => (
          <li key={i}>"{q}"</li>
        ))}
      </ul>

      <div className="gauge-row">
        <GaugePanel title="Before AI Sahayak" data={before} />
        <GaugePanel title="With your profile" data={after} />
      </div>

      <div className="section-label">Simple next steps</div>
      <ol className="tips-list">
        {improvement_tips?.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ol>
    </div>
  );
}