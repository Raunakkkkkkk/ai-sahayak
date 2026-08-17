import { useEffect, useState } from "react";
import ProfileCard from "./ProfileCard.jsx";

export default function ShopPage({ id }) {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(`/api/profile/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        setProfile(data.profile);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

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
              <div className="brand-tag">verified small business profile</div>
            </div>
          </div>
        </header>

        {status === "loading" && <p className="empty-hint">Loading profile…</p>}
        {status === "error" && (
          <p className="empty-hint">This profile link is invalid or has expired.</p>
        )}
        {status === "ready" && <ProfileCard profile={profile} />}

        <footer className="site-footer">Powered by AI Sahayak</footer>
      </div>
    </div>
  );
}