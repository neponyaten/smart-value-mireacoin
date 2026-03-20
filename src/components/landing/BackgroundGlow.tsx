"use client";
import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none"
      animate={{ opacity: [0.45, 0.7, 0.45] }}
      transition={{ duration: 10, repeat: Infinity }}
    >
      <div className="absolute w-[860px] h-[860px] bg-cyan-500/8 blur-[200px] rounded-full top-[10%] left-[60%]" />
      <div className="absolute w-[640px] h-[640px] bg-indigo-500/8 blur-[180px] rounded-full top-[44%] left-[10%]" />
      <motion.div
        className="absolute inset-x-[-18%] top-[24%] h-[280px] bg-[radial-gradient(70%_70%_at_50%_50%,rgba(86,208,255,0.12),transparent_70%)]"
        animate={{ x: [-24, 24, -24] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-x-[-24%] bottom-[6%] h-[300px] bg-[radial-gradient(70%_70%_at_50%_50%,rgba(92,125,255,0.10),transparent_70%)]"
        animate={{ x: [26, -26, 26] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}