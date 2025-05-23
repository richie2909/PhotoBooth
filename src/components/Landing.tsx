import { useEffect, useRef,  } from 'react';
import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  Layout2Strip,
  Layout3Strip,
  Layout4Strip,
  Layout4Grid,
  Layout6Grid,
  Layout9Grid,
} from './PhotoModal';


function Landing() {
  



  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {

    
  

    gsap.registerPlugin(ScrollTrigger); 
    const timeline = gsap.timeline({
      scrollTrigger: {
        
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'top 60%',
        toggleActions: 'play none none none',
      },
    });

    
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      {
        x: -150,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse', // animate when in view, reset on exit if needed
        },
      }
    );
    timeline.fromTo(
      containerRef.current,
      {
        x: -150,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
      }
    );
  
    // Fan animation AFTER parent finishes
  timeline.add(() => {

  });
      gsap.fromTo(
        '.stack-strip',
        {
          y: 80,
          opacity: 0,
          rotateZ: -25,
          x: -130,
        },
        {
          y: 0,
          opacity: 1,
          rotateZ: (i) => -12 + i * 6,
          x: (i) => -80 + i * 60,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          delay: 0.1,
        }
      );
  
      gsap.fromTo(
        '.stack-grid',
        {
          y: 80,
          opacity: 0,
          rotateZ: 25,
          x: 130,
        },
        {
          y: 0,
          opacity: 1,
          rotateZ: (i) => 12 - i * 6,
          x: (i) => 80 - i * 60,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          delay: 0.3,
        }
      );


  }, []);
  
  return (
    <div className="h-150 flex mt-10   justify-center overflow-hidden -z-1">
      <div
        ref={containerRef}
        className="relative  w-[90%] p-6 bg-gray-500 rounded-2xl border border-pink-400 shadow-xl shadow-purple-300"
      >
        <div className=' lg:scale-70 hidden lg:block '>
        <div className="relative h-[500px]">
          {/* Strip fan near bottom left */}
          <div className="absolute bottom-6 -left-40 flex items-end space-x-[-30px]">
            {[Layout2Strip, Layout3Strip, Layout4Strip].map((Comp, i) => (
              <div
                key={i}
                className="stack-strip"
                style={{
                  transform: `rotateZ(${-10 + i * 6}deg)`,
                  zIndex: 10 - i,
                  boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
                  borderRadius: '1rem',
                }}
              >
                <Comp />
              </div>
            ))}
          </div>


        

          {/* Grid fan near bottom right */}
          <div className="absolute bottom-6 -right-70 flex items-end space-x-[-30px]"
       
          >
            {[Layout4Grid, Layout6Grid, Layout9Grid].map((Comp, i) => (
              <div
                key={i}
                className="stack-grid"
                style={{
                  transform: `rotateZ(${10 - i * 6}deg)`,
                  zIndex: 10 - i,
                  boxShadow: '0 8px 15px rgba(0,0,0,0.3)',
                  borderRadius: '1rem',
                }}
              >
                <Comp />
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
