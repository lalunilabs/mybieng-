'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">About MyBeing</h1>
          <p className="text-lg text-purple-700 font-medium">Research-backed self-discovery for real life</p>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            MyBeing exists so you can understand what actually shapes your mind, energy, and behavior—without
            judgement, jargon, or medical framing. Every article and assessment is designed to surface patterns,
            not scores, so you can make deliberate changes that stick. Founded by <span className="font-semibold">Dr N</span>.
          </p>
        </motion.section>

        <section className="mt-16 space-y-6 text-left">
          <h2 className="text-2xl font-semibold text-gray-900">What we do</h2>
          <p className="text-gray-700 leading-relaxed">
            We translate behavioral psychology into plain language: human stories, research-backed frameworks,
            weekly and monthly reflection prompts, and micro check-ins you can actually finish. Our work focuses on
            patterns—motivation, energy, stress, social influence—so you can see how your environment and habits are
            shaping you in real time.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><span className="font-medium">Articles</span> that carry one strong idea, clear research context, and field-tested exercises.</li>
            <li><span className="font-medium">Assessments</span> that surface patterns—never right or wrong answers—and end with immediate next steps.</li>
            <li><span className="font-medium">Research loops</span> that anonymize every response so the platform keeps improving without compromising privacy.</li>
          </ul>
        </section>

        <section className="mt-14 space-y-4 text-left">
          <h2 className="text-2xl font-semibold text-gray-900">Why the blog exists</h2>
          <p className="text-gray-700 leading-relaxed">
            The blog is our open lab notebook. We publish the experiments, check-ins, and pattern frameworks we use in
            research—so you can apply them without needing a degree or a clinical background. Expect deep dives into
            motivation languages, social circle influence, energy audits, and environmental design, each with prompts you
            can run the same day.
          </p>
        </section>

        <section className="mt-14 space-y-4 text-left">
          <h2 className="text-2xl font-semibold text-gray-900">How the assessments work</h2>
          <p className="text-gray-700 leading-relaxed">
            Every quiz is built for pattern recognition. We ask scenario-based questions, group responses into behavioral
            profiles, and translate the findings into language you would actually use with a friend or a coach. You’ll see
            insights, not diagnoses; language, not labels. Results include context, reflection prompts, and quick experiments
            you can test within days.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Transparent methodology and published research references</li>
            <li>Immediate, human-readable summaries (no AI tone or generic bullets)</li>
            <li>Optional follow-up check-ins so you can track shifts over weeks and months</li>
          </ul>
        </section>

        <section className="mt-16 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/blog"
            className="flex-1 text-center px-6 py-3 rounded-md bg-purple-600 text-white font-semibold shadow-sm hover:bg-purple-700 transition"
          >
            Start reading the research notes
          </Link>
          <Link
            href="/quizzes"
            className="flex-1 text-center px-6 py-3 rounded-md border border-purple-200 text-purple-700 font-semibold hover:border-purple-300 hover:bg-purple-50 transition"
          >
            Explore the free assessments
          </Link>
        </section>
      </div>
    </div>
  );
}
