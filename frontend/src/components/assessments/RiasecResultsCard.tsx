import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  TrendingUp,
  Target,
  Sparkles,
  Award,
  Users,
  Briefcase,
  ChevronRight,
  Star,
  Zap,
} from 'lucide-react';
import { getParse } from '@/config/parse';
import Lottie from 'lottie-react';

interface RiasecResultsCardProps {
  primaryType: string;
  hollandCode: string;
  scores: Record<string, number>;
  onLearnMore: () => void;
}

interface PersonalityTypeData {
  code: string;
  name: string;
  personalityTypeName: string;
  tagline: string;
  description: string;
  coreTraits: string[];
  strengths: string[];
  top3CareerMatches: Array<{
    career: string;
    compatibility: number;
  }>;
  teamRole: string;
  famousKenyans: string[];
}

const typeColors: Record<string, { gradient: string; bg: string; text: string; light: string }> = {
  R: {
    gradient: 'from-red-500 via-red-600 to-rose-700',
    bg: 'bg-red-500',
    text: 'text-red-600',
    light: 'bg-red-50'
  },
  I: {
    gradient: 'from-blue-500 via-blue-600 to-indigo-700',
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    light: 'bg-blue-50'
  },
  A: {
    gradient: 'from-purple-500 via-purple-600 to-violet-700',
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    light: 'bg-purple-50'
  },
  S: {
    gradient: 'from-green-500 via-green-600 to-emerald-700',
    bg: 'bg-green-500',
    text: 'text-green-600',
    light: 'bg-green-50'
  },
  E: {
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    bg: 'bg-yellow-500',
    text: 'text-yellow-600',
    light: 'bg-yellow-50'
  },
  C: {
    gradient: 'from-gray-500 via-gray-600 to-slate-700',
    bg: 'bg-gray-500',
    text: 'text-gray-600',
    light: 'bg-gray-50'
  },
};

export const RiasecResultsCard: React.FC<RiasecResultsCardProps> = ({
  primaryType,
  hollandCode,
  scores,
  onLearnMore,
}) => {
  const [personalityData, setPersonalityData] = useState<PersonalityTypeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lottieData, setLottieData] = useState<unknown>(null);

  const colors = typeColors[primaryType] || typeColors.R;
  const topScore = (scores[primaryType] / 20) * 100;

  useEffect(() => {
    fetchPersonalityData();
    fetchLottieAnimation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryType]);

  const fetchPersonalityData = async () => {
    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getRiasecPersonalityType', {
        typeCode: primaryType,
      });
      setPersonalityData(result);
    } catch (error) {
      console.error('Failed to fetch personality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLottieAnimation = async () => {
    try {
      const url = getLottieAvatar(primaryType);
      const response = await fetch(url);
      const data = await response.json();
      setLottieData(data);
    } catch (error) {
      console.error('Failed to fetch Lottie animation:', error);
      setLottieData(null);
    }
  };

  // TEMPORARY: Free Lottie animations from LottieFiles (for testing only)
  // TODO: Replace with custom commissioned animations before production
  const getLottieAvatar = (personalityType: string) => {
    // Using free professional-looking Lottie animations
    const lottieAvatars: Record<string, string> = {
      // Realistic (R) - The Craftsman: Engineer/builder animation
      R: 'https://lottie.host/embed/b8c4c9e4-0b5a-4f5e-8f8e-5c9f3e8d4b2a/9KqrxqjQFl.json',
      // Investigative (I) - The Analyst: Scientist/thinker animation
      I: 'https://assets2.lottiefiles.com/packages/lf20_j3gumpgp.json',
      // Artistic (A) - The Innovator: Creative/artist animation
      A: 'https://assets5.lottiefiles.com/packages/lf20_khzniaya.json',
      // Social (S) - The Advocate: People/helping animation
      S: 'https://assets8.lottiefiles.com/packages/lf20_kd7sktub.json',
      // Enterprising (E) - The Commander: Leader/business animation
      E: 'https://assets10.lottiefiles.com/packages/lf20_vykpwt8b.json',
      // Conventional (C) - The Coordinator: Organized/systematic animation
      C: 'https://assets4.lottiefiles.com/packages/lf20_t9gkkhz4.json',
    };

    return lottieAvatars[personalityType] || lottieAvatars.R;
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
        </div>
      </Card>
    );
  }

  if (!personalityData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Hero Section - 16 Personalities Style */}
      <Card className="overflow-hidden border-2 border-gray-200 shadow-2xl">
        <div className={`relative bg-gradient-to-br ${colors.gradient} p-8 text-white`}>
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative z-10">
            {/* Holland Code Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1 backdrop-blur-sm">
                Holland Code: {hollandCode}
              </Badge>
            </motion.div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar - Lottie Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="flex-shrink-0"
              >
                <div className="w-40 h-40 rounded-full bg-white p-4 shadow-2xl flex items-center justify-center overflow-hidden">
                  {lottieData ? (
                    <Lottie
                      animationData={lottieData}
                      loop={true}
                      autoplay={true}
                      style={{ width: '120%', height: '120%' }}
                      renderer="svg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Brain className="w-16 h-16" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Title & Tagline */}
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-5xl md:text-6xl font-bold mb-2 drop-shadow-lg">
                    {personalityData.personalityTypeName}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 font-medium italic mb-4">
                    "{personalityData.tagline}"
                  </p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Star className="h-5 w-5 fill-white" />
                    <span className="text-lg font-semibold">{primaryType} - {personalityData.name}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={`${colors.light} border-t-2 border-gray-200`}>
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 text-center"
            >
              <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${colors.text}`} />
              <div className="text-3xl font-bold text-gray-900">{topScore.toFixed(0)}%</div>
              <div className="text-sm text-gray-600 font-medium">Personality Match</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 text-center"
            >
              <Briefcase className={`h-8 w-8 mx-auto mb-2 ${colors.text}`} />
              <div className="text-3xl font-bold text-gray-900">{personalityData.top3CareerMatches.length}</div>
              <div className="text-sm text-gray-600 font-medium">Top Career Matches</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 text-center"
            >
              <Award className={`h-8 w-8 mx-auto mb-2 ${colors.text}`} />
              <div className="text-3xl font-bold text-gray-900">{personalityData.strengths.length}</div>
              <div className="text-sm text-gray-600 font-medium">Key Strengths</div>
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Description Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Who You Are</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {personalityData.description}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Strengths Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Zap className={`h-7 w-7 ${colors.text}`} />
            <h2 className="text-2xl font-bold text-gray-900">Your Superpowers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalityData.strengths.slice(0, 4).map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className={`flex items-center gap-3 p-4 ${colors.light} rounded-xl border border-gray-200`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-base font-semibold text-gray-800">{strength}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top 3 Career Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <Card className="p-8 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Target className={`h-7 w-7 ${colors.text}`} />
            <h2 className="text-2xl font-bold text-gray-900">Perfect Career Matches</h2>
          </div>
          <div className="space-y-4">
            {personalityData.top3CareerMatches.map((match, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-md group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {match.career}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${match.compatibility}%` }}
                        transition={{ delay: 1.3 + index * 0.1, duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                      />
                    </div>
                    <span className={`text-sm font-bold ${colors.text} min-w-[60px] text-right`}>
                      {match.compatibility.toFixed(1)}% Match
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Team Role & Famous Kenyans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Card className="p-6 border-2 border-gray-200 shadow-lg h-full">
            <div className="flex items-center gap-3 mb-4">
              <Users className={`h-6 w-6 ${colors.text}`} />
              <h3 className="text-xl font-bold text-gray-900">Your Role in Teams</h3>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              {personalityData.teamRole}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Card className="p-6 border-2 border-gray-200 shadow-lg h-full">
            <div className="flex items-center gap-3 mb-4">
              <Star className={`h-6 w-6 ${colors.text}`} />
              <h3 className="text-xl font-bold text-gray-900">Famous Kenyans Like You</h3>
            </div>
            <div className="space-y-2">
              {personalityData.famousKenyans.map((person, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                  <span className="text-sm font-medium text-gray-700">{person}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
      >
        <Card className={`p-8 bg-gradient-to-br ${colors.gradient} text-white border-none shadow-2xl`}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3">Ready to Explore Your Full Potential?</h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Discover in-depth insights about your personality, detailed career pathways, and personalized growth recommendations.
            </p>
            <Button
              onClick={onLearnMore}
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl font-bold text-lg px-8 py-6 h-auto"
            >
              <Brain className="h-6 w-6 mr-2" />
              View Complete Personality Report
              <ChevronRight className="h-6 w-6 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
