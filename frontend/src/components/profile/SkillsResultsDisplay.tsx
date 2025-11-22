import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp } from 'lucide-react';

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

export const SkillsResultsDisplay: React.FC<SkillsResultsDisplayProps> = ({
  skills,
  topSkill,
  testDate,
  onViewDetails,
  onLearnMore
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* LEFT PANEL: Skills Icon & Summary */}
        <div className="flex flex-col items-center justify-between bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-200">
          {/* Skills Icon */}
          <div className="mb-4">
            <div className="w-40 h-40 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <TrendingUp className="w-20 h-20 text-white" />
            </div>
          </div>

          {/* Type Information */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              Skills Profile
            </h3>
            <p className="text-sm font-medium text-gray-600 mb-3">
              Professional Competencies
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your strongest skill is {topSkill}, showing your key professional strengths.
            </p>
          </div>

          {/* View Details Button */}
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="w-full"
            >
              View Details
            </Button>
          )}
        </div>

        {/* CENTER PANEL: Skill Sliders */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Skills</h3>

            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index}>
                  {/* Skill Label and Percentage */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{skill.label}</span>
                    <span className={`text-sm font-bold ${skill.color}`}>
                      {skill.percentage}%
                    </span>
                  </div>

                  {/* Slider Track */}
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                        skill.color.includes('blue') ? 'bg-blue-500' :
                        skill.color.includes('green') ? 'bg-green-500' :
                        skill.color.includes('purple') ? 'bg-purple-500' :
                        skill.color.includes('amber') ? 'bg-amber-500' :
                        skill.color.includes('red') ? 'bg-red-500' :
                        'bg-teal-500'
                      }`}
                      style={{ width: `${skill.percentage}%` }}
                    >
                      {/* Slider Thumb */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-current" />
                    </div>
                  </div>

                  {/* Endpoint Labels */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{skill.leftLabel}</span>
                    <span className="text-xs text-gray-500">{skill.rightLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Date */}
          <p className="text-xs text-gray-500 mt-6">
            Test taken: {new Date(testDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* RIGHT PANEL: Career Insights */}
        <div className="flex flex-col items-center justify-between bg-gradient-to-br from-green-50/30 to-white p-6 rounded-xl border border-green-200">
          {/* Label */}
          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Top Strength
            </p>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-4">
              {topSkill}
            </h3>
          </div>

          {/* Icon */}
          <div className="mb-4">
            <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg opacity-40">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Insight Text */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              This assessment reveals your professional competencies and readiness for career advancement.
            </p>
          </div>

          {/* Learn More Button */}
          {onLearnMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLearnMore}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              Learn More
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
