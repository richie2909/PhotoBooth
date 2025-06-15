import React from "react";
import Navigation from "../components/Navigation";
import { WebcamCapture } from '../components/WebcamCapture';

const Booth = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <WebcamCapture />
    </div>
  );
};

export default Booth;