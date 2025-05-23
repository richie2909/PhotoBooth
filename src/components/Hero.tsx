
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="w-[90%] flex flex-col justify-center items-center bg-gradient-to-br h-90 rounded-2xl from-pink-300 via-purple-300 to-indigo-400 px-6 m-[5%]">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-6 select-none">
        Welcome to <span className="text-yellow-200">MyPhotoBooth</span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-xl text-center text-white text-lg mb-12 drop-shadow-md">
        Capture your best moments with fun filters, cool layouts, and instant downloads! 
        Ready to create unforgettable memories?
      </p>

      {/* Start Now button */}
      <Link
        to="/booth"
        className="px-14 py-4 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 text-white text-xl font-semibold shadow-lg
        hover:shadow-pink-400 hover:scale-105 transform transition-all duration-500 ease-in-out select-none"
        aria-label="Start Photo Booth"
      >
        Start Now
      </Link>

      {/* Decorative sparkles */}
      <div className="absolute top-10 left-10 animate-pulse text-yellow-200 text-3xl select-none">✨</div>
      <div className="absolute bottom-20 right-16 animate-bounce text-yellow-300 text-5xl select-none">🌸</div>
      <div className="absolute top-32 right-40 animate-spin text-yellow-200 text-4xl select-none">💖</div>
    </div>
  );
}

export default Hero;
