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
  const [layoutImageCount, setLayoutImageCount] = useState<number>(3);
  const [selectedTimer, setSelectedTimer] = useState(3);
  const [filter, setFilter] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  // Track how many photos currently
  const currentCount = data?.length || 0;

  // When layout changes, if current photos exceed new layoutImageCount, truncate the data array
  useEffect(() => {
    if (data && data.length > layoutImageCount) {
      setImage(data.slice(0, layoutImageCount));
    }
  }, [layoutImageCount, data, setImage]);

  const startCapture = (index: number | null = null) => {
    // Block new capture if max reached and NOT retaking (index === null)
    if (index === null && currentCount >= layoutImageCount) return;

    setEditIndex(index);
    setIsCountingDown(true);
    setTimer(selectedTimer);
    let count = selectedTimer;

    const interval = setInterval(() => {
      count -= 1;
      setTimer(count);
      if (count === 0) {
        clearInterval(interval);
        setIsCountingDown(false);
        capture(index);
      }
    }, 1000);
  };

  const capture = useCallback(
    (index: number | null) => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) return;

      const newImage = {
        imgSrc: imageSrc,
        dateCreated: new Date(),
        filter: filter,
      };

      setImage((prev) => {
        if (index !== null) {
          // Retake: replace image at index
          const updated = [...prev];
          updated[index] = newImage;
          return updated;
        } else {
          // New capture: add image
          return [...prev, newImage];
        }
      });
      setEditIndex(null);
    },
    [setImage, filter]
  );

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Block adding if max reached
      if (currentCount >= layoutImageCount) return;

      setImage((prev) => [
        ...prev,
        {
          imgSrc: reader.result as string,
          dateCreated: new Date(),
          filter: filter,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const reachedMax = currentCount >= layoutImageCount;

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="flex gap-4 p-3 py-2 text-center">
        <TimerSelector selected={selectedTimer} onChange={setSelectedTimer} />
        <LayoutSelector selectedCount={layoutImageCount} onChange={setLayoutImageCount} />
        <label className="cursor-pointer px-6 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Upload Image
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-6">
        <div className="relative w-full lg:w-2/3 scale-x-[-1] -z-1">
          <Webcam
            mirrored={false}
            style={{ filter: filter ?? "none" }}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-[400px] sm:h-[450px] md:h-[500px] rounded-xl border border-pink-400 shadow-lg object-cover"
          />
          {isCountingDown && (
            <div className="absolute inset-0 flex justify-center scale-x-[-1] items-center bg-opacity-40 text-pink-300 text-5xl font-bold">
              {timer}
            </div>
          )}
        </div>
        <div className="w-[90%] mx-[5%] lg:scale-100">
          <CapturedImageList data={data} onRetake={startCapture} />
        </div>
      </div>

      <div className="mt-6 w-full max-w-xl overflow-x-auto whitespace-nowrap flex gap-4 border border-gray-300 p-2 rounded-md custom-scrollbar">
        {FilterPresets.map((preset, i) => (
          <button
            key={i}
            onClick={() => setFilter(preset.cssFilter)}
            className={`px-4 py-2 border rounded whitespace-nowrap text-sm shrink-0 cursor-pointer hover:bg-gray-100 transition ${
              filter === preset.cssFilter
                ? "bg-pink-100 border-pink-400 font-semibold"
                : "bg-white border-gray-300"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        {reachedMax ? (
          <Link
            to="/result"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-center"
          >
            Next
          </Link>
        ) : (
          <button
            onClick={() => startCapture(null)}
            disabled={isCountingDown}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {editIndex !== null ? "Retaking..." : "Capture Photo"}
          </button>
        )}
      </div>
    </div>
  );
};
