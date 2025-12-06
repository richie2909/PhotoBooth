import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full px-5 max-w-7xl mx-auto"
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
            <h1 className="text-4xl md:text-2xl lg:text-6xl font-bold text-slate-900 leading-tight">
            SnapCharm{" "}
              <span className="text-pink-500 text-shadow-pink-200 ">Online PhotoBooth</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              Professional photo booth experience with AI-powered filters, 
              stunning layouts, and instant digital delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mx-w-1/2 lg:flex-1/2">
            <Link
              to="/booth"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-pink-400 text-white text-lg font-medium shadow-sm hover:bg-pink-300 transition-colors duration-200"
            >
              <FaCamera className="mr-2" />
              Start Session
            </Link>

          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-6 pt-8">
          {[
            { title: "Cute Filters", desc: "Fun, soft, and aesthetic effects" },
            { title: "Easy Sharing", desc: "Save or share in just one tap" },
            { title: "Clean Layouts", desc: "Simple, stylish photo frames" },
            { title: "Clear Quality", desc: "Crisp, bright, camera-perfect shots" }
          ].map((feature, index) => (
            <div key={index} className="space-y-1">
              <h3 className="font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
       </motion.div>

        {/* Right content - Preview Image */}
       {/* Right content - Preview Image */}
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
    className="relative"
  >
    
  </motion.div>
  
      </div>
    </motion.div>
  );
}

export default Hero;
