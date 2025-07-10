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
              <span className="text-pink-500 text-shadow-pink-200 ">cherish the magic</span>
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
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/60">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/30 to-purple-200/30 backdrop-blur-sm z-10"></div>

      {/* Aesthetic preview image */}
      <img 
        src="https://images.unsplash.com/photo-1544717305-996b815c338c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
        alt="Photo Booth Preview" 
        className="w-full h-full object-cover z-0"
      />

      {/* Soft floating decorations */}
      <div className="absolute -top-5 -right-5 w-20 h-20 bg-pink-100 rounded-xl rotate-12 shadow-md z-20"></div>
      <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-purple-100 rounded-xl -rotate-12 shadow-md z-20"></div>
    </div>
  </motion.div>
  
      </div>
    </motion.div>
  );
}

export default Hero;
