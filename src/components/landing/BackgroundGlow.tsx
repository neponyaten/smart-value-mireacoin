"use client";
import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 8, repeat: Infinity }}
    >
      <div className="absolute w-[900px] h-[900px] bg-cyan-500/10 blur-[180px] rounded-full top-[10%] left-[60%]" />
      <div className="absolute w-[700px] h-[700px] bg-indigo-500/10 blur-[160px] rounded-full top-[40%] left-[10%]" />
    </motion.div>
  );
}