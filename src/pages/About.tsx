
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-4 drop-shadow-md">
          About MyPhotoBooth
        </h2>
        <p className="text-lg text-purple-800 mb-8">
          MyPhotoBooth is your go-to app for capturing and creating beautiful photo collages.
          Choose from a variety of layouts, filters, and stickers, then download your
          personalized collage instantly!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white bg-opacity-70 rounded-2xl p-6 shadow-lg hover:scale-105 transform transition">
            <h3 className="font-semibold text-xl text-pink-600 mb-2">Easy to Use</h3>
            <p className="text-gray-700">
              Capture photos with a fun timer, apply filters, and see previews in
              real-time.
            </p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-2xl p-6 shadow-lg hover:scale-105 transform transition">
            <h3 className="font-semibold text-xl text-pink-600 mb-2">Customizable Layouts</h3>
            <p className="text-gray-700">
              Pick from multiple grid patterns and adjust image sizes to create
              the perfect collage.
            </p>
          </div>
          <div className="bg-white bg-opacity-70 rounded-2xl p-6 shadow-lg hover:scale-105 transform transition">
            <h3 className="font-semibold text-xl text-pink-600 mb-2">Instant Download</h3>
            <p className="text-gray-700">
              Download your photo masterpiece as a PNG and share it on social media
              right away.
            </p>
          </div>
        </div>

        <Link
          to="/booth"
          className="inline-block px-10 py-4 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transform transition ease-in-out hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default About;
