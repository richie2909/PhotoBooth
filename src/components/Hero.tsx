import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full max-w-7xl mx-auto"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-left space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Capture the moment,{" "}
              <span className="text-indigo-600">cherish the magic</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              Professional photo booth experience with AI-powered filters, 
              stunning layouts, and instant digital delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/booth"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-indigo-600 text-white text-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors duration-200"
            >
              <FaCamera className="mr-2" />
              Start Session
            </Link>
            <Link
              to="/layouts"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-slate-300 text-slate-700 text-lg font-medium hover:bg-slate-50 transition-colors duration-200"
            >
              View Layouts
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-6 pt-8">
            {[
              { title: "AI Filters", desc: "Smart filters for perfect shots" },
              { title: "Instant Share", desc: "Download & share instantly" },
              { title: "Custom Layouts", desc: "Professional photo layouts" },
              { title: "High Quality", desc: "4K camera support" }
            ].map((feature, index) => (
              <div key={index} className="space-y-1">
                <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right content - Preview Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm"></div>
            <img 
              src="/preview.jpg" 
              alt="Photo Booth Preview" 
              className="w-full h-full object-cover"
            />
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-100 rounded-lg rotate-12"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-100 rounded-lg -rotate-12"></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Hero;
