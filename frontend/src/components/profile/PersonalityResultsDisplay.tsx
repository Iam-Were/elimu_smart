import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { getRiasecCharacter, RIASEC_METADATA } from './RiasecCharacters';

interface TraitSlider {
  label: string;
  percentage: number;
  leftLabel: string;
  rightLabel: string;
  color: string;
}

interface PersonalityResultsDisplayProps {
  hollandCode: string;
  traits: TraitSlider[];
  topCareer?: string;
  insightText?: string;
  testDate: string;
  onViewDetails?: () => void;
  onLearnMore?: () => void;
}

export const PersonalityResultsDisplay: React.FC<PersonalityResultsDisplayProps> = ({
  hollandCode,
  traits,
  topCareer,
  insightText,
  testDate,
  onViewDetails,
  onLearnMore
}) => {
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  // Get all types from Holland Code
  const types = hollandCode.split('');
  const currentType = types[currentTypeIndex];
  const metadata = RIASEC_METADATA[currentType as keyof typeof RIASEC_METADATA];
  const CharacterComponent = getRiasecCharacter(currentType);

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* LEFT PANEL: Character Card */}
        <div className="flex flex-col items-center justify-between bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
          {/* Character Illustration */}
          <div className="mb-4">
            <CharacterComponent className="w-40 h-40" />
          </div>

          {/* Type Information */}
          <div className="text-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {metadata.title}
            </h3>
            <p className="text-sm font-medium text-gray-600 mb-3">
              {metadata.name} Type
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {metadata.tagline}
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

          {/* Pagination Dots (if multiple types) */}
          {types.length > 1 && (
            <div className="flex items-center gap-2 mt-4">
              {types.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTypeIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTypeIndex
                      ? 'bg-orange-600 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View type ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CENTER PANEL: Trait Sliders */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Traits</h3>

            <div className="space-y-6">
              {traits.map((trait, index) => (
                <div key={index}>
                  {/* Trait Label and Percentage */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{trait.label}</span>
                    <span className={`text-sm font-bold ${trait.color}`}>
                      {trait.percentage}%
                    </span>
                  </div>

                  {/* Slider Track */}
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                        trait.color.includes('blue') ? 'bg-blue-500' :
                        trait.color.includes('amber') ? 'bg-amber-500' :
                        trait.color.includes('green') ? 'bg-green-500' :
                        trait.color.includes('purple') ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${trait.percentage}%` }}
                    >
                      {/* Slider Thumb */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-current" />
                    </div>
                  </div>

                  {/* Endpoint Labels */}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{trait.leftLabel}</span>
                    <span className="text-xs text-gray-500">{trait.rightLabel}</span>
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

        {/* RIGHT PANEL: Nature/Insights */}
        <div className="flex flex-col items-center justify-between bg-gradient-to-br from-orange-50/30 to-white p-6 rounded-xl border border-orange-200">
          {/* Nature Label */}
          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Nature
            </p>
            <h3 className={`text-3xl font-bold bg-gradient-to-r ${metadata.color} bg-clip-text text-transparent mb-4`}>
              {metadata.name}
            </h3>
          </div>

          {/* Secondary Character (smaller) */}
          <div className="mb-4">
            <CharacterComponent className="w-24 h-24 opacity-40" />
          </div>

          {/* Insight Text */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              {insightText || `You focus on ${metadata.name.toLowerCase()} approaches, bringing unique strengths to your chosen path.`}
            </p>
            {topCareer && (
              <p className="text-sm font-medium text-orange-600 mt-3">
                Top career match: {topCareer}
              </p>
            )}
          </div>

          {/* Learn More Button */}
          {onLearnMore && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLearnMore}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
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
