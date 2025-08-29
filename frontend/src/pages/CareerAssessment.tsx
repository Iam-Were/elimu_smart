import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Pause, 
  Brain,
  Calculator,
  Users,
  Presentation,
  FileText,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssessmentQuestion {
  id: string;
  category: string;
  categoryIcon: React.ElementType;
  question: string;
  options: {
    id: string;
    text: string;
    icon: React.ElementType;
  }[];
}

const mockQuestions: AssessmentQuestion[] = [
  {
    id: '1',
    category: 'Personality & Interests',
    categoryIcon: Brain,
    question: 'Which of these activities do you find most engaging and energizing?',
    options: [
      {
        id: 'a',
        text: 'Working on complex problem-solving tasks that require analytical thinking',
        icon: Calculator
      },
      {
        id: 'b',
        text: 'Collaborating with others on creative projects and brainstorming ideas',
        icon: Users
      },
      {
        id: 'c',
        text: 'Leading team discussions and presenting ideas to groups',
        icon: Presentation
      },
      {
        id: 'd',
        text: 'Working independently on detailed, structured tasks',
        icon: FileText
      }
    ]
  },
  // Add more questions as needed
];

const CareerAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const totalQuestions = 45; // This would be dynamic in real implementation
  const progress = (currentQuestion / totalQuestions) * 100;
  const question = mockQuestions[0]; // In real app, this would be based on currentQuestion

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
      
      if (currentQuestion < totalQuestions) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Assessment complete
        navigate('/assessment-results');
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
    }
  };

  const handleSaveAndExit = () => {
    // Save progress and navigate back
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Assessment Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Career Assessment
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Question {currentQuestion} of {totalQuestions}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progress)}% Complete
              </div>
              <button 
                onClick={handleSaveAndExit}
                className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <Pause className="h-4 w-4 mr-2" />
                Save & Exit
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          
          {/* Question Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 gradient-primary rounded-full flex items-center justify-center shadow-gradient-primary">
                <question.categoryIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {question.category}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understanding your preferences and motivations
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
              {question.question}
            </h3>
          </div>
          
          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {question.options.map((option) => (
              <label
                key={option.id}
                className={`flex items-start space-x-4 p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAnswer === option.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-400'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <input
                  type="radio"
                  name="question"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 dark:border-gray-600"
                />
                <div className="flex items-start space-x-3 flex-1">
                  <div className="h-10 w-10 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <option.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 leading-relaxed">
                    {option.text}
                  </span>
                </div>
              </label>
            ))}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestion} of {totalQuestions}
            </div>
            
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="inline-flex items-center px-6 py-2 rounded-lg gradient-primary text-white font-medium hover:shadow-gradient-primary hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all duration-200"
            >
              {currentQuestion === totalQuestions ? (
                <>
                  Complete
                  <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default CareerAssessmentPage;