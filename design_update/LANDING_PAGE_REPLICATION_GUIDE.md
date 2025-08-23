# Landing Page Element-by-Element Replication Guide

## 🎯 Exact Landing Page Architecture

### Landing Page Master Template
```tsx
// EXACT structure that must be replicated element for element
const ElimuSmartLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      
      {/* Navigation Header - EXACT positioning */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - EXACT spacing */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Elimu Smart</h1>
                <p className="text-xs text-orange-600 font-medium">Career Guidance</p>
              </div>
            </div>
            
            {/* Navigation Menu - EXACT items */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-orange-600 transition-colors font-medium">
                About
              </a>
            </div>
            
            {/* CTA Buttons - EXACT styling */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={onLoginClick}
                className="text-gray-600 hover:text-orange-600"
              >
                Sign In
              </Button>
              <Button 
                onClick={onGetStarted}
                className="bg-gradient-primary text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - EXACT layout */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-100/30"></div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Content - EXACT text hierarchy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>AI-Powered Career Guidance</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Discover Your
                  <span className="block text-transparent bg-clip-text bg-gradient-primary">
                    Perfect Career
                  </span>
                  Path
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Elimu Smart combines AI technology with expert counseling to guide Kenyan students 
                  toward their ideal career paths based on interests, skills, and market opportunities.
                </p>
              </div>
              
              {/* Hero CTAs - EXACT positioning */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={onGetStarted}
                  className="bg-gradient-primary text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Social Proof - EXACT stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Students Guided</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Career Paths</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
            
            {/* Hero Visual - EXACT composition */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main Hero Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Target className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Career Assessment</h3>
                        <p className="text-sm text-gray-600">Discover your strengths</p>
                      </div>
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Assessment Progress</span>
                        <span className="text-orange-600 font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-primary h-2 rounded-full w-4/5"></div>
                      </div>
                    </div>
                    
                    {/* Sample Results */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Top Career Matches:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Code className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Software Engineering</span>
                          </div>
                          <span className="text-sm font-bold text-orange-600">95%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Briefcase className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Data Science</span>
                          </div>
                          <span className="text-sm font-bold text-orange-600">88%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Palette className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">UX Design</span>
                          </div>
                          <span className="text-sm font-bold text-orange-600">82%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-900">AI Active</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900">24/7 Support</span>
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-orange-200/20 rounded-2xl transform rotate-2 scale-105 -z-10"></div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section - EXACT grid layout */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4" />
              <span>Core Features</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Everything You Need for
              <span className="block text-transparent bg-clip-text bg-gradient-primary">
                Career Success
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides students with AI-powered assessments, 
              expert guidance, and real-time market insights.
            </p>
          </div>
          
          {/* Features Grid - EXACT 3-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 - Career Assessment */}
            <div className="group bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Target className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">AI Career Assessment</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced psychometric testing powered by AI to identify your natural talents, 
                  interests, and personality traits for optimal career matching.
                </p>
                <div className="flex items-center text-orange-600 font-medium">
                  <span>Take Assessment</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 2 - Subject Mapping */}
            <div className="group bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <BookOpen className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Subject to Career Mapping</h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover how your current subjects and grades translate into specific career 
                  opportunities and university course requirements.
                </p>
                <div className="flex items-center text-orange-600 font-medium">
                  <span>Explore Mapping</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 3 - Expert Counseling */}
            <div className="group bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <MessageCircle className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Expert Counseling</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect with certified career counselors who provide personalized guidance 
                  and support throughout your career discovery journey.
                </p>
                <div className="flex items-center text-orange-600 font-medium">
                  <span>Book Session</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 4 - University Tracking */}
            <div className="group bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <School className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">KUCCPS Integration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Real-time tracking of university placements, course availability, and 
                  admission requirements directly from KUCCPS database.
                </p>
                <div className="flex items-center text-orange-600 font-medium">
                  <span>Track Placement</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 5 - Skills Development */}
            <div className="group bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Zap className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Skills for Future</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access curated learning resources and skill development programs aligned 
                  with future job market demands and industry trends.
                </p>
                <div className="flex items-center text-orange-600 font-medium">
                  <span>Build Skills</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Feature 6 - Career Spotlights */}
            <div className="group bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="space-y-4">
                <div className="h-14 w-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Spotlight className="h-7 w-7 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Career Spotlights</h3>
                <p className="text-gray-600 leading-relaxed">
                  In-depth profiles of emerging careers, salary expectations, growth prospects, 
                  and success stories from industry professionals.
                </p>
                <div className="flex items-center text-orange-600 font-medium">
                  <span>Browse Careers</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* How It Works Section - EXACT 4-step process */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              <Compass className="h-4 w-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Your Journey to
              <span className="block text-transparent bg-clip-text bg-gradient-primary">
                Career Clarity
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow our proven 4-step process to discover your ideal career path 
              and create an actionable plan for success.
            </p>
          </div>
          
          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up & Assess</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Create your profile and complete our comprehensive AI-powered career assessment
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative text-center">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Matched</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Receive personalized career recommendations based on your assessment results
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative text-center">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore & Plan</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Dive deep into career options and create your personalized education plan
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange-200"></div>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Action</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Execute your plan with ongoing support from expert counselors
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Testimonials Section - EXACT social proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              <Heart className="h-4 w-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Trusted by Students
              <span className="block text-transparent bg-clip-text bg-gradient-primary">
                Across Kenya
              </span>
            </h2>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Elimu Smart helped me discover my passion for data science. The assessment was 
                incredibly accurate and the counselor guidance was invaluable."
              </p>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Wanjiku</div>
                  <div className="text-sm text-gray-600">Form 4 Student, Nairobi</div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The subject-to-career mapping feature opened my eyes to opportunities I never 
                knew existed. Now I'm confidently pursuing engineering."
              </p>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">James Kiprotich</div>
                  <div className="text-sm text-gray-600">University Freshman, Eldoret</div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "As a parent, seeing my daughter gain career clarity through Elimu Smart 
                has been amazing. The platform is comprehensive and user-friendly."
              </p>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Grace Muthoni</div>
                  <div className="text-sm text-gray-600">Parent, Kisumu</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Pricing Section - EXACT pricing tiers */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
              <CreditCard className="h-4 w-4" />
              <span>Simple Pricing</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Choose Your
              <span className="block text-transparent bg-clip-text bg-gradient-primary">
                Success Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options designed to fit every student's needs and budget.
            </p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Basic Plan */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-900">Free</div>
                  <div className="text-sm text-gray-600">Forever</div>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Basic career assessment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Limited career suggestions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Get Started Free
                </Button>
              </div>
            </div>
            
            {/* Premium Plan - HIGHLIGHTED */}
            <div className="bg-white rounded-xl p-8 border-2 border-orange-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Premium</h3>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-900">KSh 2,500</div>
                  <div className="text-sm text-gray-600">Per month</div>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Advanced AI assessment</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Unlimited career exploration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Expert counselor sessions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>KUCCPS tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-primary text-white">
                  Start Premium
                </Button>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-gray-900">Custom</div>
                  <div className="text-sm text-gray-600">For schools</div>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>All premium features</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Bulk student management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Analytics dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>White-label options</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* CTA Section - EXACT final conversion */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
            Ready to Discover Your
            <span className="block">Perfect Career Path?</span>
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of Kenyan students who have found clarity and direction 
            through our AI-powered career guidance platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-orange-600 hover:bg-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-orange-300 text-white hover:bg-orange-500"
            >
              <Phone className="mr-2 h-5 w-5" />
              Talk to Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - EXACT structure */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white text-lg">Elimu Smart</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering Kenyan students with AI-powered career guidance for a brighter future.
              </p>
              <div className="flex space-x-4">
                <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-xs">f</span>
                </div>
                <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-xs">t</span>
                </div>
                <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>
            
            {/* Platform Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Career Assessment</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Subject Mapping</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Expert Counseling</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">University Tracking</a></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>hello@elimusmart.co.ke</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+254 700 123 456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Footer Bottom */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 Elimu Smart. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  );
};
```

## 🎨 Element Replication Checklist

### MANDATORY Elements (Never Skip):
- [ ] **Navigation Bar**: White/90 background, backdrop blur, sticky positioning
- [ ] **Logo Section**: Gradient icon + company name + tagline
- [ ] **Hero Gradient**: Background from gray-50 to orange-50/30
- [ ] **Hero Card**: Assessment demo with progress bar and career matches
- [ ] **Feature Grid**: Exactly 6 features in 3-column layout
- [ ] **Process Steps**: 4 numbered circles with connecting lines
- [ ] **Testimonials**: 3-column grid with 5-star ratings
- [ ] **Pricing Cards**: Free, Premium (highlighted), Enterprise
- [ ] **CTA Section**: Orange gradient background, dual buttons
- [ ] **Footer**: 4-column layout with company info, links, contact

### Color Usage Rules:
```tsx
// EXACT color applications
Navigation: "bg-white/90"
Hero Background: "bg-gradient-to-br from-gray-50 to-orange-50/30"
Primary Buttons: "bg-gradient-primary"
Feature Cards: "bg-white border-gray-100"
Section Badges: "bg-orange-100 text-orange-800"
Process Numbers: "bg-gradient-primary text-white"
Testimonial Background: "bg-gray-50"
CTA Section: "bg-gradient-to-br from-orange-600 to-orange-700"
Footer: "bg-gray-900 text-gray-300"
```

### Typography Hierarchy:
```tsx
// EXACT text sizing
Main Hero Title: "text-4xl lg:text-6xl font-bold"
Section Titles: "text-3xl lg:text-4xl font-bold"
Feature Titles: "text-xl font-semibold"
Body Text: "text-xl text-gray-600" (hero) | "text-gray-600" (features)
Badge Text: "text-sm font-medium"
Button Text: Default (uses CSS font-weight-medium)
```

### Spacing System:
```tsx
// EXACT spacing applications
Section Padding: "py-20"
Container Max Width: "max-w-7xl mx-auto"
Container Padding: "px-4 sm:px-6 lg:px-8"
Feature Grid Gap: "gap-8"
Hero Content Gap: "space-y-8"
Button Groups: "space-x-3" | "gap-4"
Icon-Text Spacing: "space-x-2" | "space-x-3"
```

### Interactive States:
```tsx
// EXACT hover effects
Cards: "hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
Buttons: "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
Links: "hover:text-orange-600 transition-colors"
Feature Icons: "group-hover:bg-orange-200 transition-colors"
Arrow Icons: "group-hover:translate-x-1 transition-transform"
```

This guide ensures pixel-perfect replication of the Elimu Smart landing page with every element, color, spacing, and interaction exactly as designed.