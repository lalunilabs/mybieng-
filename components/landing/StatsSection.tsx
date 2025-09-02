'use client';

import { motion } from 'framer-motion';
import Container from '@/components/Container';

export default function StatsSection() {
  const stats = [
    {
      number: "1000+",
      label: "Self-discoveries made",
      delay: 0.1
    },
    {
      number: "15+", 
      label: "Research-backed quizzes",
      delay: 0.2
    },
    {
      number: "98%",
      label: "Find insights valuable", 
      delay: 0.3
    }
  ];

  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: stat.delay }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
