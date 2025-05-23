// SnapCharmText.tsx
import  { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SnapCharmText() {
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const textEl = textRef.current!;

    // Prepare text for draw animation
    const length = textEl.getComputedTextLength();
    textEl.style.strokeDasharray = `${length}`;
    textEl.style.strokeDashoffset = `${length}`;
    textEl.style.opacity = "1";

    gsap.to(textEl, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
    });
  }, []);

  return (
    

    
    <svg viewBox="0 0 600 200" className="w-[300px] h-[200px] mx-[5%] lg:w-200  ">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff69b4" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      {/* SnapCharm in Pacifico */}
      <text
        ref={textRef}
        x="50"
        y="120"
        fontFamily="'Pacifico', cursive"
        fontSize="80"
        fill="none"
        stroke="url(#grad)"
        strokeWidth="4"
        opacity="0"
      >
        SnapCharm
      </text>
    </svg>
  );
}
