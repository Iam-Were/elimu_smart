import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, TrendingUp, Star, ArrowUp } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface SkillSlider {
  label: string;
  percentage: number;
  leftLabel: string;
  rightLabel: string;
  color: string;
}

interface SkillsResultsDisplayProps {
  skills: SkillSlider[];
  topSkill: string;
  testDate: string;
  onViewDetails?: () => void;
  onLearnMore?: () => void;
}

const SKILL_COLORS: Record<number, string> = {
  0: '#3b82f6',
  1: '#22c55e',
  2: '#a855f7',
  3: '#f59e0b',
  4: '#ef4444',
  5: '#14b8a6',
};

export const SkillsResultsDisplay: React.FC<SkillsResultsDisplayProps> = ({
  skills,
  topSkill,
  testDate,
  onViewDetails,
  onLearnMore,
}) => {
  const sorted = [...skills].sort((a, b) => b.percentage - a.percentage);
  const strengths = sorted.slice(0, 3);
  const growthAreas = sorted.slice(-3).reverse();

  const chartData = skills.map((s) => ({
    subject: s.label.length > 10 ? s.label.substring(0, 10) + '…' : s.label,
    fullLabel: s.label,
    score: s.percentage,
  }));

  const chartConfig = {
    score: {
      label: 'Score',
      color: '#3b82f6',
    },
  };

  const getProgressColor = (pct: number): string => {
    if (pct >= 75) return 'bg-green-500';
    if (pct >= 50) return 'bg-blue-500';
    if (pct >= 30) return 'bg-amber-500';
    return 'bg-red-400';
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x">
        {/* LEFT: Radar Chart + Summary */}
        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="w-full mb-3">
            <h3 className="text-lg font-semibold text-center text-gray-900 mb-1">Skills Radar</h3>
            <p className="text-xs text-center text-muted-foreground mb-4">Professional Competencies</p>
          </div>

          <ChartContainer config={chartConfig} className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 4, right: 16, bottom: 4, left: 16 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                />
                <Radar
                  name="Skills"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Top strength: <span className="font-semibold text-blue-700">{topSkill}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Tested: {new Date(testDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails} className="w-full mt-4">
              View Details
            </Button>
          )}
        </div>

        {/* CENTER: Skill Bars */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Skills</h3>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{skill.label}</span>
                  <span className="text-sm font-bold" style={{ color: SKILL_COLORS[index] ?? '#6b7280' }}>
                    {skill.percentage}%
                  </span>
                </div>
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${getProgressColor(skill.percentage)}`}
                    style={{
                      width: `${skill.percentage}%`,
                      background: `linear-gradient(90deg, ${SKILL_COLORS[index] ?? '#6b7280'}99, ${SKILL_COLORS[index] ?? '#6b7280'})`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-gray-400">{skill.leftLabel}</span>
                  <span className="text-xs text-gray-400">{skill.rightLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Strengths vs Growth */}
        <div className="p-6 bg-gradient-to-br from-green-50/30 to-white">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Strengths</h4>
            </div>
            <div className="space-y-2">
              {strengths.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-sm font-medium text-gray-800">{s.label}</span>
                  <Badge className="bg-green-500 text-white text-xs">{s.percentage}%</Badge>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ArrowUp className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Growth Areas</h4>
            </div>
            <div className="space-y-2">
              {growthAreas.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-sm font-medium text-gray-800">{s.label}</span>
                  <Badge variant="outline" className="text-amber-700 border-amber-300 text-xs">{s.percentage}%</Badge>
                </div>
              ))}
            </div>
          </div>

          {onLearnMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLearnMore}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 mt-4 w-full"
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Improve Skills
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
      {/* Print hide for non-essential */}
      <style>{`@media print { .print\\:hidden { display: none !important; } }`}</style>
    </Card>
  );
};
