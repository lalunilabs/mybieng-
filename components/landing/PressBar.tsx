"use client";

import { motion } from "framer-motion";

export default function PressBar() {
  const logos = [
    { name: "VOGUE", className: "font-serif" },
    { name: "BuzzFeed", className: "font-semibold" },
    { name: "BAZAAR", className: "tracking-widest" },
    { name: "On Your Mind", className: "italic" },
  ];

  return (
    <section className="py-10 bg-white/80 border-y border-purple-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center">
          {logos.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="text-gray-800/70 text-lg sm:text-xl md:text-2xl"
            >
              {logo.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
