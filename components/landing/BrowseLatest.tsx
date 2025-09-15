"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

export default function BrowseLatest() {
  const links = [
    { href: "/quizzes", label: "Latest Assessments" },
    { href: "/blog", label: "Latest Articles" },
    { href: "/research", label: "Research Updates" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-400 to-indigo-400">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <SectionHeader
              overline={<span className="text-white/90">Browse</span>}
              title="The Latest"
              highlight="Across MyBeing"
              description="Explore new assessments, articles, and research curated to help you understand your patterns and make steady progress."
              align="left"
              gradientClass="from-white to-white"
              className="mb-0 text-white"
              tone="light"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {links.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  href={item.href}
                  className="block text-center w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-medium border border-white/20 hover:bg-white/20 transition"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
