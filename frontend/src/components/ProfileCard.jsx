import { useState } from "react";
import useTilt from "../hooks/useTilt.js";

export default function ProfileCard({ profile }) {
  const [copied, setCopied] = useState(false);
  const tiltRef = useTilt(3);
  if (!profile) return null;

  const handleCopy = async () => {
    const text = `${profile.business_name} — ${profile.category}
${profile.short_description}

Specialties: ${profile.specialties?.join(", ")}
Location: ${profile.location}
Price range: ${profile.price_range}
Why choose us: ${profile.unique_selling_points?.join(", ")}
Contact: ${profile.contact_hint}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Couldn't copy — please select and copy manually.");
    }
  };

  return (
    <div ref={tiltRef} className="panel profile-card tilt-card">
      <div className="profile-head">
        <div>
          <h2 className="profile-name">{profile.business_name}</h2>
          <span className="profile-category">{profile.category}</span>
        </div>
      </div>

      <p className="profile-desc">{profile.short_description}</p>

      {profile.specialties?.length > 0 && (
        <div className="pill-row">
          {profile.specialties.map((s, i) => (
            <span className="pill" key={i}>{s}</span>
          ))}
        </div>
      )}

      <div className="meta-grid">
        <div className="meta-item">
          <div className="meta-k">Location</div>
          <div className="meta-v">{profile.location}</div>
        </div>
        <div className="meta-item">
          <div className="meta-k">Price range</div>
          <div className="meta-v">{profile.price_range}</div>
        </div>
        <div className="meta-item">
          <div className="meta-k">Contact</div>
          <div className="meta-v">{profile.contact_hint}</div>
        </div>
      </div>

      {profile.unique_selling_points?.length > 0 && (
        <div className="usp-box">
          <b>Why choose them:</b> {profile.unique_selling_points.join(" · ")}
        </div>
      )}

      {profile.original_language_summary && (
        <p className="local-summary">{profile.original_language_summary}</p>
      )}

      <div className="profile-actions">
        <button className="btn-ghost" onClick={handleCopy}>
          {copied ? "✓ Copied" : "📋 Copy profile text"}
        </button>
      </div>

      {copied && <div className="toast">Profile copied to clipboard</div>}
    </div>
  );
}