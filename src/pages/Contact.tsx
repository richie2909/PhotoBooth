
import { Link } from "react-router-dom";

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-purple-700 mb-4 drop-shadow-md">
          Contact Us
        </h2>
        <p className="text-lg text-purple-800 mb-8">
          We'd love to hear from you! Whether you have feedback, feature requests,
          or just want to say hello, reach out to the MyPhotoBooth team below.
        </p>

        <form className="bg-white bg-opacity-80 rounded-2xl p-6 shadow-lg max-w-md mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-lg border focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Your message..."
              className="w-full px-4 py-2 rounded-lg border focus:ring-pink-500 focus:border-pink-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600 transform transition hover:scale-105"
          >
            Send Message
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-600">
          Or email us directly at{' '}
          <a href="mailto:support@myphotobooth.com" className="text-pink-500 hover:underline">
            support@myphotobooth.com
          </a>
        </p>

        <Link
          to="/"
          className="inline-block mt-6 text-pink-500 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Contact;
