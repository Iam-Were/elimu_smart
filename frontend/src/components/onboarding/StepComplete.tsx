import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, MessageCircle, Calendar } from 'lucide-react';

interface StepCompleteProps {
  counselorName: string;
  counselorEmail: string;
  onFinish: () => void;
}

export function StepComplete({ counselorName, counselorEmail, onFinish }: StepCompleteProps) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        All Set! 🎉
      </h1>

      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Your account is ready. We've activated your premium trial and assigned you a counselor!
      </p>

      {/* Premium Trial Info */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <p className="text-lg font-bold">
            3-Month Premium Trial Activated!
          </p>
        </div>
        <p className="text-white/90">
          You now have full access to direct counselor messaging, session booking, priority support, and advanced assessments - completely free until {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Counselor Introduction */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-orange-50 to-purple-50 border-2 border-orange-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Meet Your Counselor
        </h2>

        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white">
          {counselorName.split(' ').map(n => n[0]).join('')}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {counselorName}
        </h3>

        <p className="text-gray-600 mb-1">
          Career Counselor
        </p>

        <p className="text-sm text-gray-500 mb-6">
          {counselorEmail}
        </p>

        <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={onFinish}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 transition-colors font-semibold"
          >
            <MessageCircle className="w-5 h-5" />
            Message {counselorName.split(' ')[0]}
          </button>

          <button
            onClick={onFinish}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-colors font-semibold"
          >
            <Calendar className="w-5 h-5" />
            Book a Session
          </button>
        </div>
      </div>

      {/* Next Steps */}
      <div className="text-left max-w-2xl mx-auto mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Recommended Next Steps
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-gray-900">Take the Full RIASEC Assessment</p>
              <p className="text-sm text-gray-600">Get detailed career matches based on your personality</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-gray-900">Message Your Counselor</p>
              <p className="text-sm text-gray-600">Introduce yourself and ask any questions</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-gray-900">Explore University Programs</p>
              <p className="text-sm text-gray-600">Find programs that match your subjects and interests</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onFinish}
        size="lg"
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        Go to Dashboard
      </Button>

      <p className="text-sm text-gray-500 mt-6">
        You can always access your counselor from the Guidance tab
      </p>
    </div>
  );
}
