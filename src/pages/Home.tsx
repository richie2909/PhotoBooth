import  { useState, useEffect } from 'react';

import HomeCanvas from '../components/HomeCanvas';
import SnapCharmText from '../components/SnapCharmText';



export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  // Automatically hide intro after 2 seconds
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => setShowIntro(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  return (
    <div className="relative ">
      {showIntro ? (
        <div className="absolute  left-1/2 transform mt-40 -translate-x-1/2 translate-y-1/2">
          <SnapCharmText  />
        </div>
        
      ) : (
        
        <HomeCanvas />
      )}
            
   
        
        
    </div>
  );
}
