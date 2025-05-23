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
  const [editIndex, setEditIndex] = useState<number | null>(null);
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

      setImage(prev => {
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
    }

    setEditIndex(null);
    setIsCapturingSequence(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newImage = { imgSrc: reader.result as string, dateCreated: new Date(), filter };
      setImage(prev => {
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
      <div className="flex justify-center items-center gap-2 p-4 w-full max-w-2xl mx-auto flex-nowrap">
        <TimerSelector selected={selectedTimer} onChange={setSelectedTimer} />
        <LayoutSelector selectedCount={layoutImageCount} onChange={setLayoutImageCount} />
        <label className="flex items-center px-2 py-2 bg-pink-200 rounded hover:bg-purple-300 cursor-pointer">
          <h1 className="text-sm text-nowrap">Upload Image</h1> 
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="flex relative flex-col lg:flex-row items-center w-full justify-center max-w-6xl gap-6">
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
          <div className="lg:absolute  lg:top-0 lg:translate-x-110 w-full 
          ">
                  <CapturedImageList data={data} onRetake={startCapture} />
          </div>
      </div>

      <div className="mt-6 w-full max-w-xl overflow-x-auto flex gap-4 p-2 border rounded custom-scrollbar">
        {FilterPresets.map((p, i) => (
          <button
            key={i}
            onClick={() => setFilter(p.cssFilter)}
            className={`px-4 py-2 border rounded whitespace-nowrap text-sm ${
              filter === p.cssFilter ? "bg-pink-100 border-pink-400" : "bg-white border-gray-300"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        {currentCount >= layoutImageCount ? (
          <Link to="/result" className="px-6 py-2 bg-pink-600 text-white rounded hover:bg-purple-700">
            Next
          </Link>
        ) : (
          <>
            <button
              onClick={() => startCapture(null)}
              disabled={isCountingDown || isCapturingSequence}
              className="px-6 py-2 bg-pink-600 text-white rounded disabled:opacity-50 hover:bg-pink-700"
            >
              {editIndex !== null && !isCapturingSequence ? "Retaking..." : "Capture Photo"}
            </button>
            <button
              onClick={captureAllPhotos}
              disabled={isCountingDown || isCapturingSequence}
              className="px-6 py-2 bg-pink-600 text-white rounded disabled:opacity-50 hover:bg-pink-700"
            >
              {isCapturingSequence ? "Capturing All..." : "Capture All Photos"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
