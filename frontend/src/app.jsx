import { useState } from "react";
import BusinessForm from "./components/BusinessForm.jsx";
import ProfileCard from "./components/ProfileCard.jsx";
import VisibilityReport from "./components/VisibilityReport.jsx";
import ShareQR from "./components/ShareQR.jsx";
import Reveal from "./components/Reveal.jsx";
import StepIndicator from "./components/StepIndicator.jsx";
import useTilt from "./hooks/useTilt.js";
import useScrollProgress from "./hooks/useScrollProgress.js";
import Background3D from "./components/Background3D.jsx";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const heroTiltRef = useTilt(2.5);
  const scrollY = useScrollProgress();

  const currentStep = report ? 3 : profile ? 2 : 1;

  const handleGenerate = async (rawDescription, language) => {
    setLoading(true);
    setError("");
    setProfile(null);
    setProfileId(null);
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
      setProfileId(data.id);
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
      <div className="blob blob-1" style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
        <div className="blob blob-2" style={{ transform: `translateY(${scrollY * -0.2}px)` }} />
        <div className="blob blob-3" style={{ transform: `translateY(${scrollY * 0.15}px)` }} />
        <Background3D scrollY={scrollY} />
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
          <section
          className="hero"
          style={{ perspective: "1200px" }}
        >
          <span
            className="hero-eyebrow"
            style={{ transform: `translateY(${scrollY * 0.15}px)`, opacity: Math.max(1 - scrollY / 300, 0) }}
          >
            ● built for small shops, artisans &amp; farmers
          </span>
          <h1
            style={{
              transform: `translateY(${scrollY * 0.25}px) rotateX(${Math.min(scrollY * 0.03, 8)}deg)`,
              opacity: Math.max(1 - scrollY / 400, 0),
              transformStyle: "preserve-3d",
            }}
          >
            Your shop deserves to show up when someone asks <em>AI</em> for the best nearby.
          </h1>
          <p
            className="lede"
            style={{ transform: `translateY(${scrollY * 0.18}px)`, opacity: Math.max(1 - scrollY / 350, 0) }}
          >
            Big brands already optimise for ChatGPT and Gemini. Describe your business in your own
            words — even by voice — and get an AI-readable profile in seconds, plus a real test of
            whether AI agents currently recommend you.
          </p>

          <div
            ref={heroTiltRef}
            className="chat-demo tilt-card"
            style={{
              transform: `translateY(${scrollY * -0.08}px) translateZ(${Math.min(scrollY * 0.4, 60)}px) scale(${Math.min(1 + scrollY * 0.0004, 1.06)})`,
              transformStyle: "preserve-3d",
            }}
          >
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
              {profileId && (
                <div style={{ marginTop: 20 }}>
                  <ShareQR url={`${window.location.origin}/shop/${profileId}`} />
                </div>
              )}
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