import React, { useLayoutEffect, useRef } from "react";
import { layoutInfos } from "./layoutInfos";
import { LayoutPreview } from "./LayoutPreview";
import gsap from "gsap";

export const AllLayoutsPreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const total = layoutInfos.length;
  const centerIndex = Math.floor(total / 2);
  const angleStep = 10; // degrees
  const shiftStep = 60; // pixels

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      layoutInfos.forEach((_, index) => {
        const offset = index - centerIndex;
        const angle = offset * angleStep;
        const xShift = offset * shiftStep;

        gsap.fromTo(
          `.layout-card-${index}`,
          {
            x: 0,
            rotate: 0,
            scale: 0,
            opacity: 0,
          },
          {
            x: xShift,
            rotate: angle,
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.05,
            transformOrigin: "bottom center",
            ease: "power3.out",
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="relative w-full h-[300px] flex items-center justify-center"
      ref={containerRef}
    >
      {layoutInfos.map(({ count, layout, type }, index) => {
        const offset = index - centerIndex;
        const angle = offset * angleStep;
        const xShift = offset * shiftStep;

        return (
          <div
            key={`${count}-${type}`}
            className={`absolute layout-card-${index}`}
            style={{
              transform: `translateX(${xShift}px) rotate(${angle}deg)`,
              transformOrigin: "bottom center",
              zIndex: 1000 - Math.abs(offset),
              opacity: 0, // initial hidden for animation
            }}
          >
            <LayoutPreview layout={layout} type={type} />
          </div>
        );
      })}
    </div>
  );
};
