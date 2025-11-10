import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Target, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const PreFooterCTA: React.FC = () => {
  const { user } = useAuth();

  // Hide CTA for premium users
  if (user?.isPremium) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-16 mt-20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Start Your Journey Card */}
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Start Your Journey</h3>
              <p className="text-orange-50 text-sm">
                Discover your perfect career path with AI-driven assessments
              </p>
              <Button
                asChild
                className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold"
              >
                <Link to="/assessment/career">
                  Take Free Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Get Expert Guidance Card */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Expert Guidance</h3>
              <p className="text-purple-50 text-sm">
                Connect with licensed counselors for personalized support
              </p>
              <Button
                asChild
                className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold"
              >
                <Link to="/guidance">
                  Find Counselor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium Features Card */}
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto relative">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Go Premium</h3>
              <p className="text-amber-50 text-sm">
                Unlock unlimited access to all career tools
              </p>
              <Button
                asChild
                className="w-full bg-white text-amber-600 hover:bg-amber-50 font-semibold"
              >
                <Link to="/subscription">
                  View Plans
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
