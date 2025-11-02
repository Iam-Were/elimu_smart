import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Target,
  Users,
  BookOpen,
  Lightbulb,
  Star,
  Award,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getParse } from '@/config/parse';

interface PersonalityReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riasecType: string; // R, I, A, S, E, or C
  hollandCode?: string;
  scores?: Record<string, number>;
}

interface PersonalityTypeData {
  code: string;
  name: string;
  personalityTypeName: string;
  tagline: string;
  description: string;
  coreTraits: string[];
  strengths: string[];
  challenges: string[];
  workStyle: string;
  idealEnvironment: string;
  motivators: string[];
  learningStyle: string;
  decisionMaking: string;
  teamRole: string;
  top3CareerMatches: Array<{
    career: string;
    compatibility: number;
    reason: string;
    kenyaOpportunities: string;
  }>;
  famousKenyans: string[];
  developmentTips: string[];
  avatarSuggestions: {
    style: string;
    colors: string[];
    attributes: string[];
  };
}

const typeColors: Record<string, string> = {
  R: 'from-red-500 to-rose-600',
  I: 'from-blue-500 to-indigo-600',
  A: 'from-purple-500 to-violet-600',
  S: 'from-green-500 to-emerald-600',
  E: 'from-yellow-500 to-amber-600',
  C: 'from-gray-500 to-slate-600',
};

const typeBgColors: Record<string, string> = {
  R: 'bg-red-50',
  I: 'bg-blue-50',
  A: 'bg-purple-50',
  S: 'bg-green-50',
  E: 'bg-yellow-50',
  C: 'bg-gray-50',
};

const typeTextColors: Record<string, string> = {
  R: 'text-red-600',
  I: 'text-blue-600',
  A: 'text-purple-600',
  S: 'text-green-600',
  E: 'text-yellow-600',
  C: 'text-gray-600',
};

export const PersonalityReportModal: React.FC<PersonalityReportModalProps> = ({
  open,
  onOpenChange,
  riasecType,
  hollandCode,
  scores,
}) => {
  const [personalityData, setPersonalityData] = useState<PersonalityTypeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && riasecType) {
      fetchPersonalityData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, riasecType]);

  const fetchPersonalityData = async () => {
    setLoading(true);
    setError(null);

    try {
      const Parse = await getParse();
      const result = await Parse.Cloud.run('getRiasecPersonalityType', {
        typeCode: riasecType,
      });

      setPersonalityData(result);
    } catch (err) {
      console.error('Failed to fetch personality data:', err);
      setError('Failed to load personality report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScorePercentage = (type: string): number => {
    if (!scores || !scores[type]) return 0;
    return ((scores[type] / 20) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[riasecType]} flex items-center justify-center shadow-lg`}>
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading Your Personality Report...</span>
                </div>
              ) : personalityData ? (
                <>
                  <h2 className="text-2xl font-bold">{personalityData.personalityTypeName}</h2>
                  <p className="text-sm text-muted-foreground font-normal">{personalityData.tagline}</p>
                </>
              ) : (
                <span>Personality Report</span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        ) : personalityData ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="careers">Careers</TabsTrigger>
              <TabsTrigger value="growth">Growth</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Holland Code Badge */}
              {hollandCode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Holland Code: <span className="font-bold ml-1">{hollandCode}</span>
                  </Badge>
                </motion.div>
              )}

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`p-6 rounded-xl ${typeBgColors[riasecType]} border-l-4 border-${riasecType === 'R' ? 'red' : riasecType === 'I' ? 'blue' : riasecType === 'A' ? 'purple' : riasecType === 'S' ? 'green' : riasecType === 'E' ? 'yellow' : 'gray'}-500`}
              >
                <p className="text-lg leading-relaxed">{personalityData.description}</p>
              </motion.div>

              {/* Core Traits */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className={`h-5 w-5 ${typeTextColors[riasecType]}`} />
                  <h3 className="text-lg font-bold">Core Personality Traits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {personalityData.coreTraits.map((trait, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <CheckCircle2 className={`h-5 w-5 ${typeTextColors[riasecType]} flex-shrink-0 mt-0.5`} />
                      <span className="text-sm">{trait}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Work Style */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className={`h-5 w-5 ${typeTextColors[riasecType]}`} />
                  <h3 className="text-lg font-bold">How You Work Best</h3>
                </div>
                <p className="text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
                  {personalityData.workStyle}
                </p>
              </motion.div>

              {/* Ideal Environment */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className={`h-5 w-5 ${typeTextColors[riasecType]}`} />
                  <h3 className="text-lg font-bold">Ideal Work Environment</h3>
                </div>
                <p className="text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
                  {personalityData.idealEnvironment}
                </p>
              </motion.div>

              {/* Motivators */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className={`h-5 w-5 ${typeTextColors[riasecType]}`} />
                  <h3 className="text-lg font-bold">What Motivates You</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {personalityData.motivators.map((motivator, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {motivator}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Learning & Decision Making */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className={`h-5 w-5 ${typeTextColors[riasecType]}`} />
                    <h4 className="font-bold">Learning Style</h4>
                  </div>
                  <p className="text-sm text-gray-700">{personalityData.learningStyle}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className={`h-5 w-5 ${typeTextColors[riasecType]}`} />
                    <h4 className="font-bold">Decision Making</h4>
                  </div>
                  <p className="text-sm text-gray-700">{personalityData.decisionMaking}</p>
                </motion.div>
              </div>

              {/* Team Role */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Users className={`h-5 w-5 ${typeTextColors[riasecType]}`} />
                  <h3 className="text-lg font-bold">Your Role in Teams</h3>
                </div>
                <p className="text-sm text-gray-700 bg-white p-4 rounded-lg border border-gray-200 leading-relaxed">
                  {personalityData.teamRole}
                </p>
              </motion.div>
            </TabsContent>

            {/* Strengths & Challenges Tab */}
            <TabsContent value="strengths" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-bold">Your Strengths</h3>
                  </div>
                  <div className="space-y-3">
                    {personalityData.strengths.map((strength, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-green-900">{strength}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Challenges */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h3 className="text-lg font-bold">Growth Areas</h3>
                  </div>
                  <div className="space-y-3">
                    {personalityData.challenges.map((challenge, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200"
                      >
                        <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-orange-900">{challenge}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Scores Visualization (if available) */}
              {scores && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <h3 className="text-lg font-bold mb-4">Your RIASEC Score Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(scores)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([type, score], index) => {
                        const percentage = getScorePercentage(type);
                        const typeNames: Record<string, string> = {
                          R: 'Realistic',
                          I: 'Investigative',
                          A: 'Artistic',
                          S: 'Social',
                          E: 'Enterprising',
                          C: 'Conventional',
                        };

                        return (
                          <div key={type}>
                            <div className="flex justify-between mb-1.5">
                              <span className="text-sm font-semibold">
                                {type} - {typeNames[type]}
                              </span>
                              <span className="text-sm font-bold">{score}/20 ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                                className={`h-full bg-gradient-to-r ${typeColors[type]} rounded-full`}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* Careers Tab */}
            <TabsContent value="careers" className="space-y-6 mt-6">
              <div className="flex items-center gap-2 mb-6">
                <Award className={`h-5 w-5 ${typeTextColors[riasecType]}`} />
                <h3 className="text-lg font-bold">Top 3 Career Matches for Your Personality</h3>
              </div>

              <div className="space-y-4">
                {personalityData.top3CareerMatches.map((match, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${typeColors[riasecType]} flex items-center justify-center text-white font-bold text-lg`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold">{match.career}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${typeColors[riasecType]}`}
                                style={{ width: `${match.compatibility}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${typeTextColors[riasecType]}`}>
                              {match.compatibility.toFixed(1)}% Match
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 italic">
                      "{match.reason}"
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-900 mb-1">🇰🇪 Kenya Opportunities</p>
                      <p className="text-sm text-blue-800">{match.kenyaOpportunities}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Famous Kenyans */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200"
              >
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  Famous Kenyans with Similar Personality
                </h4>
                <div className="space-y-2">
                  {personalityData.famousKenyans.map((person, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{person}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Growth Tab */}
            <TabsContent value="growth" className="space-y-6 mt-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-bold">Personal Development Recommendations</h3>
              </div>

              <div className="space-y-4">
                {personalityData.developmentTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">{tip}</p>
                  </motion.div>
                ))}
              </div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200"
              >
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Recommended Next Steps
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Explore the Top 3 Career Matches and research university programs</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Connect with counselors or professionals in your matched careers</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Use the Subject-Career Mapper to align your KCSE subjects with career paths</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Build skills relevant to your strengths through online courses or projects</span>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
