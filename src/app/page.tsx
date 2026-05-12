"use client";

import { motion } from "framer-motion";
import { Camera, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-blue-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[90vh] text-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 mb-8">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure & Privacy-Focused</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent leading-tight">
            Find Your Event Photos Instantly
          </h1>
          <p className="text-lg text-neutral-400 mb-12 leading-relaxed">
            The platform where photographers host event galleries, and you securely find only your own photos using advanced facial recognition. No more scrolling through thousands of strangers.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl"
        >
          {/* Customer Action */}
          <Link href="/customer/login" className="group block">
            <div className="h-full bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 p-8 shadow-xl transition-all duration-300 hover:bg-neutral-900 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">I'm a Customer</h2>
              <p className="text-sm text-neutral-400">
                Take a quick selfie to securely unlock and download high-resolution photos of yourself from recent events.
              </p>
            </div>
          </Link>

          {/* Photographer Action */}
          <Link href="/photographer/login" className="group block">
            <div className="h-full bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 p-8 shadow-xl transition-all duration-300 hover:bg-neutral-900 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">I'm a Photographer</h2>
              <p className="text-sm text-neutral-400">
                Upload massive batches of event photos. We automatically process, optimize, and organize them for your clients.
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
