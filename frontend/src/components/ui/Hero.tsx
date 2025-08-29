import React from 'react';
import { ArrowRight, Star, Users, Award, TrendingUp } from 'lucide-react';
import Button from './Button';

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryAction: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  badge?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  badge,
  stats
}) => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 gradient-hero-primary">
        <div className="absolute inset-0 bg-white/5 dark:bg-gray-900/50"></div>
        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 gradient-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 gradient-secondary rounded-full blur-3xl opacity-15 animation-delay-1000 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 gradient-info rounded-full blur-3xl opacity-10 animation-delay-2000 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Content */}
          <div className="space-y-8">
            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full gradient-secondary text-white text-sm font-medium shadow-gradient-primary animate-bounce">
                <Star className="h-4 w-4" />
                <span>{badge}</span>
              </div>
            )}
            
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900 dark:text-gray-100">{title}</span>
                <span className="text-gradient-primary block mt-2">{subtitle}</span>
              </h1>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                variant="primary"
                size="lg"
                onClick={primaryAction.onClick}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto group transform hover:scale-105 transition-all duration-300"
              >
                {primaryAction.text}
              </Button>
              
              {secondaryAction && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={secondaryAction.onClick}
                  className="w-full sm:w-auto"
                >
                  {secondaryAction.text}
                </Button>
              )}
            </div>
            
            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-2xl sm:text-3xl font-bold text-gradient-primary group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Hero Visual */}
          <div className="relative">
            {/* Animated Cards */}
            <div className="relative z-10 space-y-4">
              {/* Main Feature Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-gradient-primary p-6 transform hover:scale-105 transition-all duration-300 animate-float">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 gradient-primary rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Career Growth</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track your progress</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Assessment Progress</span>
                    <span className="text-gradient-primary font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="gradient-primary h-2 rounded-full w-[85%] animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Secondary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 animation-delay-500 animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 gradient-success rounded-lg">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">10K+</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Students</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 animation-delay-1000 animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 gradient-warning rounded-lg">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">500+</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Careers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 w-4 h-4 gradient-primary rounded-full animate-ping"></div>
              <div className="absolute top-16 right-12 w-3 h-3 gradient-secondary rounded-full animate-ping animation-delay-1000"></div>
              <div className="absolute bottom-12 left-16 w-2 h-2 gradient-info rounded-full animate-ping animation-delay-2000"></div>
              <div className="absolute bottom-8 right-8 w-3 h-3 gradient-success rounded-full animate-ping animation-delay-1500"></div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;

// Additional CSS needed for animations (add to globals.css)
const animationStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-1500 {
  animation-delay: 1.5s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
`;

export { animationStyles };