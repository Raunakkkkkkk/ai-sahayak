import useMouseParallax from "../hooks/useMouseParallax.js";

export default function Background3D({ scrollY = 0 }) {
  const mouse = useMouseParallax();

  const shapes = [
    { emoji: "🪔", top: "8%", left: "10%", depth: 0.6, size: 34 },
    { emoji: "◆", top: "20%", left: "82%", depth: 0.3, size: 22 },
    { emoji: "●", top: "55%", left: "6%", depth: 0.45, size: 16 },
    { emoji: "🏺", top: "68%", left: "88%", depth: 0.55, size: 30 },
    { emoji: "◇", top: "35%", left: "50%", depth: 0.2, size: 18 },
    { emoji: "🧵", top: "80%", left: "20%", depth: 0.4, size: 26 },
    { emoji: "●", top: "12%", left: "60%", depth: 0.35, size: 12 },
  ];

  return (
    <div className="bg3d" aria-hidden="true">
      <div
        className="bg3d-floor"
        style={{
          transform: `rotateX(75deg) translateZ(${-200 + scrollY * 0.1}px) translateY(${mouse.y * 10}px)`,
        }}
      />

      {shapes.map((s, i) => (
        <div
          key={i}
          className="bg3d-shape"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            transform: `
              translate3d(${mouse.x * s.depth * 40}px, ${mouse.y * s.depth * 40 + scrollY * s.depth * -0.3}px, 0)
              rotate(${scrollY * s.depth * 0.1}deg)
            `,
            opacity: 0.5 - s.depth * 0.25,
          }}
        >
          {s.emoji}
        </div>
      ))}
    </div>
  );
}