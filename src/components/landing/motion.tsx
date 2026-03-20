"use client";

import { motion } from "framer-motion";

export function SectionReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.09,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.article>
  );
}
