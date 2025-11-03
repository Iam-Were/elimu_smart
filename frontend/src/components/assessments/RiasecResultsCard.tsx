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
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
// TODO: Uncomment when custom Lottie animations are ready
// import Lottie from 'lottie-react';

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
  // const [lottieData, setLottieData] = useState<unknown>(null); // TODO: Re-enable when implementing 16Personalities avatars

  const colors = typeColors[primaryType] || typeColors.R;
  const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const topScore = (scores[primaryType] / total) * 100;

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

  // TODO: Re-enable when implementing 16Personalities avatars
  const fetchLottieAnimation = async () => {
    try {
      const url = getLottieAvatar(primaryType);
      const response = await fetch(url);
      await response.json(); // Fetch animation data (disabled for now)
      // setLottieData(data);
    } catch (error) {
      console.error('Failed to fetch Lottie animation:', error);
      // setLottieData(null);
    }
  };

  // TEMPORARY: Using 16Personalities CDN avatars for testing only
  // TODO: Replace with custom commissioned animations before production
  // WARNING: These are copyrighted assets - TESTING ONLY, not for commercial use
  const getLottieAvatar = (personalityType: string) => {
    // Map RIASEC types to 16Personalities avatar names (closest personality match)
    const riasecTo16P: Record<string, string> = {
      // Realistic (R) → Virtuoso (ISTP) - hands-on, technical, practical
      R: 'virtuoso',
      // Investigative (I) → Logician (INTP) - analytical, curious, theoretical
      I: 'logician',
      // Artistic (A) → Mediator (INFP) - creative, idealistic, expressive
      A: 'mediator',
      // Social (S) → Protagonist (ENFJ) - empathetic, inspiring, supportive
      S: 'protagonist',
      // Enterprising (E) → Commander (ENTJ) - ambitious, strategic, leadership
      E: 'commander',
      // Conventional (C) → Logistician (ISTJ) - organized, reliable, detail-oriented
      C: 'logistician',
    };

    const avatarName = riasecTo16P[personalityType] || 'virtuoso';
    // Use male avatars for consistency (can randomize or add gender selection later)
    return `https://www.16personalities.com/static/animations/avatars/all/${avatarName}-male.json`;
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
            <div className="flex flex-col items-center gap-6">
              {/* Avatar - Lottie Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex-shrink-0"
              >
                <div className="w-40 h-40 rounded-full bg-white p-4 shadow-2xl flex items-center justify-center overflow-hidden">
                  {/* TODO: Replace with Lottie animation when custom animations are ready */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Brain className="w-16 h-16" />
                  </div>
                </div>
              </motion.div>

              {/* Personality Type - PROMINENT under icon */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">
                  {personalityData.personalityTypeName}
                </h2>
                <div className="flex items-center gap-2 justify-center mb-2">
                  <Star className="h-5 w-5 fill-white" />
                  <span className="text-lg font-semibold">{primaryType} - {personalityData.name}</span>
                </div>
                {/* Normalized Percentage Display */}
                <div className="text-sm text-white/90 font-medium">
                  {topScore.toFixed(1)}% {primaryType} match
                </div>
              </motion.div>

              {/* Top Career Match */}
              {personalityData.top3CareerMatches?.[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center gap-2 justify-center"
                >
                  <Target className="h-5 w-5 fill-white text-white" />
                  <span className="text-lg font-semibold">Top Match: {personalityData.top3CareerMatches[0].career}</span>
                  <Badge className="bg-white/30 text-white border-white/50 text-sm px-3 py-1">
                    {personalityData.top3CareerMatches[0].compatibility.toFixed(0)}% Compatible
                  </Badge>
                </motion.div>
              )}

              {/* Holland Code Badge - Below top career match */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="inline-block"
              >
                <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1.5 backdrop-blur-sm">
                  Holland Code: {hollandCode}
                </Badge>
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center max-w-2xl"
              >
                <p className="text-xl md:text-2xl text-white/90 font-medium italic">
                  "{personalityData.tagline}"
                </p>
              </motion.div>
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
              <div className="text-lg font-bold text-gray-900 leading-tight">
                {personalityData.top3CareerMatches.slice(0, 3).map((c) => c.career).join(', ')}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-1">Top Career Matches</div>
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

      {/* RIASEC Score Visualization - Two Charts Side by Side */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-8 border-2 border-gray-200 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your RIASEC Profile</h2>
              <p className="text-sm text-gray-600">Personality distribution across six dimensions</p>
            </div>
          </div>

          {/* Two Charts: Radar (Spider/Hexagon) + Bar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Radar Chart (Spider/Hexagon) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Personality Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={(() => {
                  const typeColors: Record<string, string> = {
                    R: '#ef4444', I: '#3b82f6', A: '#a855f7',
                    S: '#10b981', E: '#f59e0b', C: '#6b7280'
                  };
                  return Object.entries(scores).map(([type, score]) => {
                    const percentage = ((score as number / total) * 100);
                    return {
                      type,
                      name: { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' }[type],
                      value: percentage,
                      fill: typeColors[type]
                    };
                  });
                })()}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px' }}
                    formatter={(value) => [`${(value as number).toFixed(1)}%`, 'Percentage']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Right: Horizontal Progress Bars (16personalities style) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Score Breakdown</h3>
              <div className="space-y-4">
                {(() => {
                  const typeInfo: Record<string, { name: string; gradient: string }> = {
                    R: { name: 'Realistic', gradient: 'from-red-500 to-red-600' },
                    I: { name: 'Investigative', gradient: 'from-blue-500 to-blue-600' },
                    A: { name: 'Artistic', gradient: 'from-purple-500 to-purple-600' },
                    S: { name: 'Social', gradient: 'from-green-500 to-green-600' },
                    E: { name: 'Enterprising', gradient: 'from-yellow-500 to-yellow-600' },
                    C: { name: 'Conventional', gradient: 'from-gray-500 to-gray-600' }
                  };

                  const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
                  const sortedEntries = Object.entries(scores).sort(([, a], [, b]) => (b as number) - (a as number));
                  const highestScore = sortedEntries[0][1] as number;

                  return sortedEntries.map(([type, score], index) => {
                    const percentage = ((score as number / total) * 100).toFixed(1);
                    const isTopScore = score === highestScore;

                    return (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900 w-16">{type} - {typeInfo[type].name}</span>
                            {isTopScore && <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
                          </div>
                          <span className="text-sm font-extrabold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${typeInfo[type].gradient} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Description Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
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
