import { useState } from "react";
import VoiceInput from "./VoiceInput.jsx";
import useTilt from "../hooks/useTilt.js";

export default function BusinessForm({ onSubmit, loading }) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("hi-IN");
  const tiltRef = useTilt(4);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text, language);
  };

  return (
    <div ref={tiltRef} className="panel tilt-card">
      <form className="business-form" onSubmit={handleSubmit}>
        <label className="field-label">
          Language for voice input
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="hi-IN">Hindi</option>
            <option value="en-IN">English</option>
            <option value="mr-IN">Marathi</option>
            <option value="gu-IN">Gujarati</option>
            <option value="ta-IN">Tamil</option>
            <option value="bn-IN">Bengali</option>
          </select>
        </label>

        <textarea
          rows={6}
          placeholder="अपने बिज़नेस के बारे में बताएं... (what you sell, where, price, what makes you special)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="char-count">{text.length} characters</div>

        <div className="form-actions">
          <VoiceInput lang={language} onResult={(t) => setText((prev) => (prev ? prev + " " + t : t))} />
          <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>
            {loading ? (
              <>
                <span className="spinner" /> Generating...
              </>
            ) : (
              "✨ Generate my AI profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}