import React, { useContext, useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Link } from "react-router-dom";
import { imageContext, videoConstraints } from "../Context/ImageContext";
import { FilterPresets } from "./FilterPresets";
import { LayoutSelector } from "./LayoutSelector";
import { TimerSelector } from "./TimerSelector";
import { CapturedImageList } from "./CapturedImageList";

export const WebcamCapture = () => {
  const context = useContext(imageContext);
  if (!context) throw new Error("Must be used within provider");
  const { data, setImage } = context;

  if (!data) throw new Error("Must be used within provider");
  const [layoutImageCount, setLayoutImageCount] = useState<number>(3);
  const [selectedTimer, setSelectedTimer] = useState(3);
  const [filter, setFilter] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [, setEditIndex] = useState<number | null>(null);
  const [isCapturingSequence, setIsCapturingSequence] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);
  const currentCount = data.length;

  useEffect(() => {
    if (data.length > layoutImageCount) {
      setImage(data.slice(0, layoutImageCount));
    }
  }, [layoutImageCount, data, setImage]);

  const capture = useCallback(
    (index: number | null) => {
      const img = webcamRef.current?.getScreenshot();
      if (!img) return;
      const newImage = { imgSrc: img, dateCreated: new Date(), filter };

      setImage((prev: string | any[]) => {
        const copy = [...prev];
        if (index !== null) copy[index] = newImage;
        else if (prev.length < layoutImageCount) copy.push(newImage);
        else copy[layoutImageCount - 1] = newImage;
        return copy.slice(0, layoutImageCount);
      });
      setEditIndex(null);
    },
    [filter, layoutImageCount, setImage]
  );

  const startCapture = (index: number | null = null) => {
    if (index === null && currentCount >= layoutImageCount) return;
    setEditIndex(index);
    setIsCountingDown(true);
    setTimer(selectedTimer);
    let count = selectedTimer;
    const iv = setInterval(() => {
      count -= 1;
      setTimer(count);
      if (count === 0) {
        clearInterval(iv);
        setIsCountingDown(false);
        capture(index);
      }
    }, 1000);
  };

  const captureAllPhotos = async () => {
    if (isCapturingSequence) return;
    setIsCapturingSequence(true);

    for (let i = 0; i < layoutImageCount; i++) {
      await new Promise<void>(res => {
        setTimer(selectedTimer);
        setIsCountingDown(true);
        let count = selectedTimer;
        const iv = setInterval(() => {
          count -= 1;
          setTimer(count);
          if (count === 0) {
            clearInterval(iv);
            setIsCountingDown(false);
            capture(i);
            res();
          }
        }, 1000);
      });
      await new Promise(r => setTimeout(r, 300));
    /*  */}

    setEditIndex(null);
    setIsCapturingSequence(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newImage = { imgSrc: reader.result as string, dateCreated: new Date(), filter };
      setImage((prev: any) => {
        const copy = [...prev];
        if (copy.length < layoutImageCount) copy.push(newImage);
        else copy[layoutImageCount - 1] = newImage;
        return copy.slice(0, layoutImageCount);
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex max-sm:flex-cols justify-center h items-center gap-2 p-4 w-full max-w-2xl mx-auto flex-nowrap">
        <TimerSelector selected={selectedTimer} onChange={setSelectedTimer} />
        <LayoutSelector selectedCount={layoutImageCount} onChange={setLayoutImageCount} />
        <label className="flex items-center px-2 py-2 bg-pink-200 rounded hover:bg-purple-300 cursor-pointer">
          <h1 className="text-sm text-nowrap">Upload Image</h1> 
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="flex relative flex-col lg:flex-row items-center lg:translate-x-20 w-full justify-center max-w-6xl gap-6">
        <div className="relative w-full lg:w-2/3 scale-x-[-1]">
          <Webcam
            mirrored={false}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-[400px] sm:h-[450px] md:h-[500px] rounded-xl border border-pink-400 shadow-lg object-cover"
            style={{ filter: filter ?? "none" }}
          />
       {isCountingDown && timer > 0 && (
  <div className="absolute inset-0 flex items-center justify-center scale-x-[-1] pointer-events-none">
    <div className="bg-pink-100 bg-opacity-30 rounded px-6 py-4 transition-all duration-300">
      <span className="text-pink-700 text-6xl font-extrabold scale-x-[-1] animate-pulse">
        {timer}
      </span>
    </div>
  </div>
)}

        </div>
<div className="lg:relative lg:w-1/4 w-full">
 
        
                  <CapturedImageList data={data} onRetake={startCapture} />
          </div>
      </div>

      {/* Filter buttons with icons */}
      <div className="w-full max-w-6xl mx-auto mt-4 px-2">
        <style>
          {`
            .filter-scrollbar::-webkit-scrollbar {
              height: 6px;
              background: transparent;
            }
            .filter-scrollbar::-webkit-scrollbar-thumb {
              background-color: #f472b6;
              border-radius: 3px;
            }
            .filter-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #f472b6 transparent;
            }
          `}
        </style>
        <div className="flex overflow-x-auto gap-3 pb-2 filter-scrollbar">
          {/* No Filter Option */}
          <button
            onClick={() => setFilter(null)}
            className={`group relative flex-shrink-0 flex flex-col items-center p-2 rounded-xl transition-all duration-200 bg-white border ${
              filter === null
                ? 'border-pink-500 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
            }`}
            type="button"
          >
            <div className={`w-14 h-14 rounded-lg overflow-hidden transition-transform duration-200 bg-gray-50 flex items-center justify-center ${
              filter === null ? 'ring-2 ring-pink-500' : 'group-hover:scale-105'
            }`}>
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className={`text-xs font-medium mt-1 transition-colors whitespace-nowrap ${
              filter === null ? 'text-pink-600' : 'text-gray-600 group-hover:text-pink-500'
            }`}>
              No Filter
            </span>
            {filter === null && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-white shadow-sm" />
            )}
          </button>

          {FilterPresets.map((filterPreset) => (
            <button
              key={filterPreset.name}
              onClick={() => setFilter(filterPreset.cssFilter)}
              className={`group relative flex-shrink-0 flex flex-col items-center p-2 rounded-xl transition-all duration-200 bg-white border ${
                filter === filterPreset.cssFilter
                  ? 'border-pink-500 shadow-lg scale-[1.02]'
                  : 'border-gray-200 hover:border-pink-300 hover:shadow-md'
              }`}
              type="button"
            >
              <div className={`w-14 h-14 rounded-lg overflow-hidden transition-transform duration-200 ${
                filter === filterPreset.cssFilter ? 'ring-2 ring-pink-500' : 'group-hover:scale-105'
              }`}>
                <img
                  src={filterPreset.icon}
                  alt={filterPreset.name}
                  className="w-full h-full object-cover"
                  style={{ filter: filterPreset.cssFilter }}
                />
              </div>
              <span className={`text-xs font-medium mt-1 transition-colors whitespace-nowrap ${
                filter === filterPreset.cssFilter ? 'text-pink-600' : 'text-gray-600 group-hover:text-pink-500'
              }`}>
                {filterPreset.name}
              </span>
              {filter === filterPreset.cssFilter && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        {currentCount >= layoutImageCount ? (
          <Link to="/result" className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-purple-700">
            Next
          </Link>
        ) : (
          <>
           
            <button
              onClick={captureAllPhotos}
              disabled={isCountingDown || isCapturingSequence}
              className="px-6 py-2 bg-pink-600 text-white rounded disabled:opacity-50 hover:bg-pink-700"
            >
              {isCapturingSequence ? "Taking Photos..." : "Capture Photo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};