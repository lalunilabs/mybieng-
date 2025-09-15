"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import PrimaryCTA from "@/components/ui/PrimaryCTA";

export default function NewThisWeek() {
  return (
    <section className="py-14 bg-gradient-to-br from-purple-50 to-rose-50 border-y border-purple-100">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-purple-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="flex-1">
            <SectionHeader
              overline={<span className="inline-flex items-center gap-2"><span>★</span> New this week</span>}
              title="Fresh insights"
              highlight="This Week"
              description="New research-backed articles and assessments added regularly."
              align="left"
            />
          </div>
          <div className="sm:ml-auto flex gap-3 w-full sm:w-auto">
            <PrimaryCTA href="/quizzes" variant="uiverse" className="px-4 py-2">Explore quizzes</PrimaryCTA>
            <PrimaryCTA href="/blog" variant="outline" className="px-4 py-2">Read latest</PrimaryCTA>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
