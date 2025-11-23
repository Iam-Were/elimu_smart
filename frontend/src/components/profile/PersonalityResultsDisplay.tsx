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

interface CareerMatch {
  title: string;
  match: number;
}

interface PersonalityResultsDisplayProps {
  hollandCode: string;
  traits: TraitSlider[];
  topCareer?: string;
  insightText?: string;
  testDate: string;
  strengths?: string[];
  developmentAreas?: string[];
  careerMatches?: CareerMatch[];
  onViewDetails?: () => void;
  onLearnMore?: () => void;
}

export const PersonalityResultsDisplay: React.FC<PersonalityResultsDisplayProps> = ({
  hollandCode,
  traits,
  topCareer,
  insightText,
  testDate,
  strengths = [],
  developmentAreas = [],
  careerMatches = [],
  onViewDetails,
  onLearnMore
}) => {
  const [currentSection, setCurrentSection] = useState<number>(0);

  // Get primary type from Holland Code
  const primaryType = hollandCode[0];
  const metadata = RIASEC_METADATA[primaryType as keyof typeof RIASEC_METADATA];
  const CharacterComponent = getRiasecCharacter(primaryType);

  // Define 3 carousel sections
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'strengths', label: 'Strengths & Growth' },
    { id: 'careers', label: 'Career Matches' }
  ];

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* LEFT CARD: 3-Section Carousel */}
        <div className="flex flex-col items-center justify-between bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border border-gray-200">
          {/* Section 1: Character + Overview */}
          {currentSection === 0 && (
            <>
              <div className="mb-6">
                <CharacterComponent className="w-48 h-48" />
              </div>
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {metadata.title}
                </h3>
                <p className="text-base font-medium text-gray-600 mb-4">
                  {metadata.name} Type
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {metadata.tagline}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Nature
                  </p>
                  <h4 className={`text-2xl font-bold bg-gradient-to-r ${metadata.color} bg-clip-text text-transparent mb-3`}>
                    {metadata.name}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {insightText || `You focus on ${metadata.name.toLowerCase()} approaches, bringing unique strengths to your chosen path.`}
                  </p>
                  {topCareer && (
                    <p className="text-sm font-medium text-orange-600 mt-3">
                      Top career match: {topCareer}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Section 2: Strengths & Development Areas */}
          {currentSection === 1 && (
            <div className="w-full space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Your Strengths</h3>
                <p className="text-sm text-gray-600">What you naturally excel at</p>
              </div>
              <div className="space-y-3">
                {strengths.length > 0 ? (
                  strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${metadata.color}`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">Complete full assessment to see strengths</p>
                )}
              </div>
              {developmentAreas.length > 0 && (
                <>
                  <div className="text-center mt-8">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Growth Areas</h4>
                    <p className="text-xs text-gray-600">Opportunities for development</p>
                  </div>
                  <div className="space-y-2">
                    {developmentAreas.slice(0, 3).map((area, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <p className="text-xs text-gray-700">{area}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Section 3: Career Matches */}
          {currentSection === 2 && (
            <div className="w-full space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Top Career Matches</h3>
                <p className="text-sm text-gray-600">Careers aligned with your personality</p>
              </div>
              <div className="space-y-3">
                {careerMatches.length > 0 ? (
                  careerMatches.slice(0, 5).map((career, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${metadata.color}`}>
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{career.title}</p>
                          <p className="text-xs text-gray-500">{career.match}% match</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${metadata.color}`}
                            style={{ width: `${career.match}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">Complete full assessment to see career matches</p>
                )}
              </div>
            </div>
          )}

          {/* Pagination Dots - Always show 3 sections */}
          <div className="flex items-center gap-2 mt-6">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSection
                    ? 'bg-orange-600 w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View section ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT CARD: Trait Sliders */}
        <div className="flex flex-col justify-between p-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Your Traits</h3>

            <div className="space-y-6">
              {traits.map((trait, index) => (
                <div key={index}>
                  {/* Trait Label and Percentage */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{trait.label}</span>
                    <span className={`text-lg font-bold ${trait.color}`}>
                      {trait.percentage}%
                    </span>
                  </div>

                  {/* Full-Color Bar with Dial Marker (16 Personalities Style) */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{trait.leftLabel}</span>

                    {/* Full-width colored bar */}
                    <div className="flex-1 relative h-2 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-0 rounded-full ${
                          trait.color.includes('blue') ? 'bg-blue-500' :
                          trait.color.includes('teal') ? 'bg-teal-500' :
                          trait.color.includes('amber') ? 'bg-amber-500' :
                          trait.color.includes('green') ? 'bg-green-500' :
                          trait.color.includes('purple') ? 'bg-purple-500' :
                          trait.color.includes('pink') ? 'bg-pink-500' :
                          trait.color.includes('slate') ? 'bg-slate-500' :
                          'bg-orange-500'
                        }`}
                      />
                      {/* Dial marker (white circle positioned at percentage) */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-500 ${
                          trait.color.includes('blue') ? 'border-blue-500' :
                          trait.color.includes('teal') ? 'border-teal-500' :
                          trait.color.includes('amber') ? 'border-amber-500' :
                          trait.color.includes('green') ? 'border-green-500' :
                          trait.color.includes('purple') ? 'border-purple-500' :
                          trait.color.includes('pink') ? 'border-pink-500' :
                          trait.color.includes('slate') ? 'border-slate-500' :
                          'border-orange-500'
                        } border-2`}
                        style={{ left: `${trait.percentage}%` }}
                      />
                    </div>

                    <span className="text-xs text-gray-500">{trait.rightLabel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Date and Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-4">
              Test taken: {new Date(testDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <div className="flex gap-3">
              {onViewDetails && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewDetails}
                  className="flex-1"
                >
                  View Details
                </Button>
              )}
              {onLearnMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLearnMore}
                  className="flex-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  Learn More
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
