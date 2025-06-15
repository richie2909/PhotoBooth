import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';

type DownloadedCollage = {
  imgSrc: string;
  timestamp: number;
  expiryDate: number;
};

const Photos = () => {
  const [collages, setCollages] = useState<DownloadedCollage[]>([]);
  const [selectedCollage, setSelectedCollage] = useState<DownloadedCollage | null>(null);

  useEffect(() => {
    const loadCollages = () => {
      const storedCollages = localStorage.getItem('photobooth_downloaded_collages');
      if (storedCollages) {
        const parsedCollages: DownloadedCollage[] = JSON.parse(storedCollages);
        const now = Date.now();
        const validCollages = parsedCollages.filter(collage => collage.expiryDate > now);
        setCollages(validCollages);
        // Update localStorage with only valid collages
        localStorage.setItem('photobooth_downloaded_collages', JSON.stringify(validCollages));
      }
    };

    loadCollages();
    // Check for expired collages every hour
    const interval = setInterval(loadCollages, 3600000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (collage: DownloadedCollage) => {
    const link = document.createElement('a');
    link.href = collage.imgSrc;
    link.download = `snapcharm-collage-${collage.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Your Photo Collection
        </h1>

        {collages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-xl text-gray-600">
              No collages yet. Start creating memories in the photo booth!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collages.map((collage, index) => (
              <div
                key={collage.timestamp}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative group">
                  <img
                    src={collage.imgSrc}
                    alt={`Collage ${index + 1}`}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={() => setSelectedCollage(collage)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleDownload(collage)}
                      className="opacity-0 group-hover:opacity-100 bg-white text-pink-600 px-4 py-2 rounded-full font-semibold transform transition-all duration-300 hover:bg-pink-600 hover:text-white"
                    >
                      Download
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">
                    Created: {formatDate(collage.timestamp)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expires: {formatDate(collage.expiryDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for viewing full-size collage */}
      {selectedCollage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCollage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:text-pink-400"
              onClick={() => setSelectedCollage(null)}
            >
              ×
            </button>
            <img
              src={selectedCollage.imgSrc}
              alt="Full size collage"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;