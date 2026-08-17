import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import useTilt from "../hooks/useTilt.js";

export default function ShareQR({ url }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const tiltRef = useTilt(4);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 160,
        margin: 1,
        color: { dark: "#12131a", light: "#f5f1e8" },
      });
    }
  }, [url]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Couldn't copy — please copy the link manually.");
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "shop-qr-code.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  if (!url) return null;

  return (
    <div ref={tiltRef} className="panel qr-card tilt-card">
      <div className="qr-layout">
        <canvas ref={canvasRef} className="qr-canvas" />
        <div className="qr-info">
          <h3 className="qr-title">📌 Put this on your shop</h3>
          <p className="qr-desc">
            Print this QR code and stick it on your signboard, counter, or packaging.
            Anyone who scans it opens your AI-readable profile instantly.
          </p>
          <p className="qr-link">{url}</p>
          <div className="qr-actions">
            <button className="btn-secondary" onClick={handleCopyLink}>
              {copied ? "✓ Copied" : "🔗 Copy link"}
            </button>
            <button className="btn-ghost" onClick={handleDownload}>
              ⬇ Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}