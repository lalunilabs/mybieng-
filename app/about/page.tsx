'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GraduationCap, Award, BookOpen, Users, Mail, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-black rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Meet the Expert
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            About
            <span className="block text-gradient bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Dr N
            </span>
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Leading researcher in psychology and behavioral science, dedicated to making self-discovery accessible through evidence-based assessments.
          </p>
        </motion.div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Profile Image & Basic Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-purple-200 shadow-soft">
              <CardContent className="pt-6 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-white">👩‍⚕️</span>
                </div>
                <h2 className="text-2xl font-bold text-black mb-2">Dr N</h2>
                <p className="text-black mb-4">Clinical Psychologist & Researcher</p>
                <div className="flex justify-center gap-3">
                  <Button size="sm" variant="outline" className="border-purple-600 text-black hover:bg-yellow-50">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="border-purple-600 text-black hover:bg-yellow-50">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bio & Expertise */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-purple-200 shadow-soft">
              <CardHeader>
                <CardTitle className="text-black">Background & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black leading-relaxed mb-4">
                  Dr N is a renowned clinical psychologist with over 15 years of experience in personality assessment, 
                  cognitive behavioral therapy, and research methodology. She holds a Ph.D. in Clinical Psychology 
                  from a leading university and has published extensively in peer-reviewed journals.
                </p>
                <p className="text-black leading-relaxed">
                  Her passion lies in making psychological insights accessible to everyone through scientifically 
                  validated assessments and personalized recommendations. Dr N believes that understanding oneself 
                  is the foundation for personal growth and meaningful relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-purple-200 shadow-soft">
              <CardHeader>
                <CardTitle className="text-black">Research Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-black mb-2">Personality Psychology</h4>
                    <p className="text-sm text-black">Individual differences and trait measurement</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Cognitive Assessment</h4>
                    <p className="text-sm text-black">Decision-making and bias identification</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Behavioral Change</h4>
                    <p className="text-sm text-black">Habit formation and motivation</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-2">Digital Psychology</h4>
                    <p className="text-sm text-black">Technology-assisted self-discovery</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-black">Ph.D. Clinical Psychology</div>
                  <div className="text-sm text-black">Stanford University</div>
                </div>
                <div>
                  <div className="font-semibold text-black">M.A. Psychology</div>
                  <div className="text-sm text-black">Harvard University</div>
                </div>
                <div>
                  <div className="font-semibold text-black">B.A. Psychology</div>
                  <div className="text-sm text-black">Yale University</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-black">50+ Publications</div>
                  <div className="text-sm text-black">Peer-reviewed journals</div>
                </div>
                <div>
                  <div className="font-semibold text-black">Research Excellence Award</div>
                  <div className="text-sm text-black">American Psychological Association</div>
                </div>
                <div>
                  <div className="font-semibold text-black">Licensed Psychologist</div>
                  <div className="text-sm text-black">California & New York</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-purple-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-black">Journal of Personality</div>
                  <div className="text-sm text-black">Lead author, 12 articles</div>
                </div>
                <div>
                  <div className="font-semibold text-black">Psychological Science</div>
                  <div className="text-sm text-black">Contributing author, 8 articles</div>
                </div>
                <div>
                  <div className="font-semibold text-black">Clinical Psychology Review</div>
                  <div className="text-sm text-black">Senior author, 6 articles</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-yellow-100 to-purple-100 border-purple-200 max-w-4xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold text-black mb-4">
                "Understanding yourself is the beginning of all wisdom."
              </h3>
              <p className="text-black mb-6 leading-relaxed">
                My mission is to democratize access to psychological insights through scientifically rigorous, 
                yet accessible assessments. Every quiz and article on MyBeing is crafted with the same care 
                and evidence-based approach I use in my clinical practice and research.
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                asChild
              >
                <Link href="/quizzes">
                  Explore My Assessments
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
