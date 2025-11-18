import { Button } from '@/components/ui/button';
import { Rocket, Target, TrendingUp } from 'lucide-react';

interface StepWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

export function StepWelcome({ onNext, onSkip }: StepWelcomeProps) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <Rocket className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Elimu Smart!
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        We're here to help you discover your ideal career path and navigate your educational journey with confidence.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Personalized Guidance
          </h3>
          <p className="text-sm text-gray-600">
            Get matched with a dedicated counselor who understands your goals
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Career Assessments
          </h3>
          <p className="text-sm text-gray-600">
            Discover your strengths and explore matching career paths
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            University Matching
          </h3>
          <p className="text-sm text-gray-600">
            Find the perfect programs based on your KCSE subjects and interests
          </p>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white mb-8">
        <p className="text-lg font-semibold mb-2">
          🎁 Special Welcome Gift
        </p>
        <p className="text-white/90">
          You'll get 3 months of Premium access for FREE - including direct counselor messaging, priority support, and advanced assessments!
        </p>
      </div>

      <p className="text-gray-600 mb-8">
        Let's get started by learning a bit about you. This will only take 5-7 minutes.
      </p>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Let's Get Started
        </Button>

        <Button
          onClick={onSkip}
          variant="ghost"
          size="lg"
          className="text-gray-600 hover:text-orange-600 font-medium"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
}
