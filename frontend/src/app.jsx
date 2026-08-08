import { useState } from "react";
import BusinessForm from "./components/BusinessForm.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import VisibilityReport from "./components/VisibilityReport.jsx";
import Reveal from "./components/Reveal.jsx";
import StepIndicator from "./components/StepIndicator.jsx";
import useTilt from "./hooks/useTilt.js";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const heroTiltRef = useTilt(2.5);

  const currentStep = report ? 3 : profile ? 2 : 1;

  const handleGenerate = async (rawDescription, language) => {
    setLoading(true);
    setError("");
    setProfile(null);
    setReport(null);
    try {
      const res = await fetch("/api/profile/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawDescription, language }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setProfile(data.profile);
    } catch (err) {
      setError("Couldn't generate your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setError("");
    try {
      const res = await fetch("/api/visibility/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      setError("Couldn't run the visibility test. Please try again.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-scene">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="grain" />

      <div className="app">
        <header className="site-header">
          <div className="brand">
            <div className="brand-mark floaty">🪔</div>
            <div>
              <div className="brand-name">AI Sahayak</div>
              <div className="brand-tag">visible to every AI, in your language</div>
            </div>
          </div>
          <StepIndicator current={currentStep} />
        </header>

        <section className="hero">
          <span className="hero-eyebrow">● built for small shops, artisans &amp; farmers</span>
          <h1>Your shop deserves to show up when someone asks <em>AI</em> for the best nearby.</h1>
          <p className="lede">
            Big brands already optimise for ChatGPT and Gemini. Describe your business in your own
            words — even by voice — and get an AI-readable profile in seconds, plus a real test of
            whether AI agents currently recommend you.
          </p>

          <div ref={heroTiltRef} className="chat-demo tilt-card">
            <div className="chat-card before" data-label="Before">
              <p className="chat-q">"best handmade jute bags near Ghaziabad"</p>
              <p className="chat-a miss">AI mentions 2 large online retailers. Your shop isn't found — no structured info exists about it online.</p>
            </div>
            <div className="chat-card after" data-label="After">
              <p className="chat-q">"best handmade jute bags near Ghaziabad"</p>
              <p className="chat-a hit"><b>Also consider:</b> a local artisan-run shop known for hand-stitched jute bags, ₹300–800, based in Ghaziabad.</p>
            </div>
          </div>
        </section>

        <Reveal>
          <div className="section-label">Step 1 — describe your business</div>
          <BusinessForm onSubmit={handleGenerate} loading={loading} />
        </Reveal>

        {error && <p style={{ color: "#e8542b", fontSize: 13.5, marginTop: 14 }}>{error}</p>}

        {profile && (
          <>
            <Reveal delay={50}>
              <div className="section-label" style={{ marginTop: 36 }}>Step 2 — your AI-readable profile</div>
              <ProfileCard profile={profile} />
            </Reveal>

            <Reveal delay={100}>
              <div style={{ marginTop: 20 }}>
                <button className="btn-primary" onClick={handleTest} disabled={testing}>
                  {testing ? (
                    <>
                      <span className="spinner" /> Testing visibility...
                    </>
                  ) : (
                    "🔍 Test my AI visibility"
                  )}
                </button>
              </div>
            </Reveal>
          </>
        )}

        {report && (
          <Reveal delay={50}>
            <div className="section-label" style={{ marginTop: 36 }}>Step 3 — how AI sees you</div>
            <VisibilityReport report={report} />
          </Reveal>
        )}

        <footer className="site-footer">AI Sahayak — a hackathon project for equitable AI visibility</footer>
      </div>
    </div>
  );
}