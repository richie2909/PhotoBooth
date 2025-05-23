import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current || !buttonRef.current) return;

    const tl = gsap.timeline();

    // Animate container: scale up and fade in
    tl.fromTo(
      containerRef.current,
      { scale: 0.8, opacity: 0 },
      {
        duration: 0.6,
        scale: 1,
        opacity: 1,
        ease: "back.out(1.7)"
      }
    );

    // Animate text sliding down with bounce effect
    tl.fromTo(
      textRef.current,
      { y: -50, opacity: 0 },
      {
        duration: 0.8,
        y: 0,
        opacity: 1,
        ease: "bounce.out"
      },
      "-=0.3"
    );

    // Animate button scaling and fade in with elastic effect
    tl.fromTo(
      buttonRef.current,
      { scale: 0, opacity: 0 },
      {
        duration: 0.6,
        scale: 1,
        opacity: 1,
        ease: "elastic.out(1, 0.5)"
      },
      "-=0.4"
    );

    return () => {
      tl.kill(); // clean up timeline on unmount
    };
  }, []);

  return (
    <div
      ref={containerRef}
      // Set initial opacity 0 in CSS so GSAP animations show properly
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white p-4 opacity-0"
    >
      <div
        ref={textRef}
        className="text-center opacity-0"
      >
        <h1 className="text-8xl font-black mb-4">404</h1>
        <p className="text-2xl mb-8">Oops! Page not found.</p>
      </div>
      <Link to="/">
        <button
          ref={buttonRef}
          className="px-8 py-3 bg-pink-500 hover:bg-pink-600 rounded-full text-xl font-semibold shadow-lg"
          style={{ opacity: 0 }} // start hidden to prevent flicker
        >
          Go Home
        </button>
      </Link>
    </div>
  );
}

export default NotFound;
