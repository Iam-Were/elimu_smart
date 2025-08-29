# Complete Page Design Documentation - All Elimu Smart Features

## 🎯 Comprehensive Page Architecture Guide

### Dashboard Page Design Pattern
```tsx
const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Page Header with Breadcrumbs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>Dashboard</li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {userData.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Track your career discovery progress and next steps
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button className="bg-gradient-primary text-white">
                <Plus className="mr-2 h-4 w-4" />
                Take Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Progress Overview Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Your Progress
                </h2>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">85%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Assessment Complete</div>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Careers Explored</div>
                </div>
                <div className="text-center">
                  <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Counselor Sessions</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
                  <span className="text-orange-600 font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full w-4/5"></div>
                </div>
              </div>
            </div>
            
            {/* Recent Applications */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Recent Applications
                </h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Application Item */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        University of Nairobi - Computer Science
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Applied 2 days ago
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Pending
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Code className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        KCA University - Software Engineering
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Applied 1 week ago
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Accepted
                  </span>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="ghost">
                  <Target className="mr-3 h-4 w-4" />
                  Continue Assessment
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Calendar className="mr-3 h-4 w-4" />
                  Book Counselor Session
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Search className="mr-3 h-4 w-4" />
                  Explore Careers
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <FileText className="mr-3 h-4 w-4" />
                  Track KUCCPS Status
                </Button>
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Career Fair - Tech Careers
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tomorrow, 2:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Counselor Session
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Friday, 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};
```

### Career Assessment Page Design
```tsx
const CareerAssessmentPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 45;
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Assessment Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
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
              <Button variant="ghost" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                Save & Exit
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
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
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Personality & Interests
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Understanding your preferences and motivations
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
              Which of these activities do you find most engaging and energizing?
            </h3>
          </div>
          
          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {[
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
            ].map((option) => (
              <label
                key={option.id}
                className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="question"
                  value={option.id}
                  className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
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
            <Button variant="outline" disabled={currentQuestion === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestion} of {totalQuestions}
            </div>
            <Button className="bg-gradient-primary text-white">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
};
```

### Subject to Career Mapper Page Design
```tsx
const SubjectToCareerMapper: React.FC = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [gradeData, setGradeData] = useState<Record<string, string>>({});

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>Dashboard</li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span>Subject Mapper</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Subject to Career Mapper
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Discover career paths based on your academic subjects and performance
              </p>
            </div>
            <Button className="bg-gradient-primary text-white">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Subject Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Instructions Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    How to Use the Subject Mapper
                  </h3>
                  <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                    <li>Select your current subjects from the list below</li>
                    <li>Enter your grades or expected grades for each subject</li>
                    <li>View career recommendations based on your subject combination</li>
                    <li>Explore university courses that match your subjects</li>
                  </ol>
                </div>
              </div>
            </div>
            
            {/* Subject Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Select Your Subjects
              </h2>
              
              {/* Subject Categories */}
              <div className="space-y-6">
                
                {/* Core Subjects */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Core Subjects (Required)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'english', name: 'English', required: true },
                      { id: 'kiswahili', name: 'Kiswahili', required: true },
                      { id: 'mathematics', name: 'Mathematics', required: true }
                    ].map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject.id)}
                            onChange={() => {/* handle selection */}}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            disabled={subject.required}
                          />
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {subject.name}
                          </span>
                          {subject.required && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700">
                          <option value="">Grade</option>
                          <option value="A">A</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="B-">B-</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                          <option value="C-">C-</option>
                          <option value="D+">D+</option>
                          <option value="D">D</option>
                          <option value="D-">D-</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Science Subjects */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Sciences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'biology', name: 'Biology', icon: Microscope },
                      { id: 'chemistry', name: 'Chemistry', icon: Flask },
                      { id: 'physics', name: 'Physics', icon: Atom },
                      { id: 'computer', name: 'Computer Studies', icon: Monitor }
                    ].map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject.id)}
                            onChange={() => {/* handle selection */}}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <subject.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-gray-100">
                            {subject.name}
                          </span>
                        </div>
                        <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700">
                          <option value="">Grade</option>
                          <option value="A">A</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="B-">B-</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                          <option value="C-">C-</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Humanities */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Humanities & Social Sciences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'history', name: 'History & Government', icon: Clock },
                      { id: 'geography', name: 'Geography', icon: Globe },
                      { id: 'cre', name: 'Christian Religious Education', icon: Book },
                      { id: 'business', name: 'Business Studies', icon: Briefcase }
                    ].map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject.id)}
                            onChange={() => {/* handle selection */}}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <subject.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900 dark:text-gray-100">
                            {subject.name}
                          </span>
                        </div>
                        <select className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700">
                          <option value="">Grade</option>
                          <option value="A">A</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B">B</option>
                          <option value="B-">B-</option>
                          <option value="C+">C+</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
              
              {/* Analysis Button */}
              <div className="mt-8 text-center">
                <Button className="bg-gradient-primary text-white px-8">
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Career Matches
                </Button>
              </div>
            </div>
            
          </div>
          
          {/* Results Sidebar */}
          <div className="space-y-6">
            
            {/* Subject Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Selected Subjects
              </h3>
              {selectedSubjects.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Select subjects to see your combination summary
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedSubjects.map((subjectId) => (
                    <div key={subjectId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 dark:text-gray-100 capitalize">
                        {subjectId.replace('_', ' ')}
                      </span>
                      <span className="font-medium text-orange-600">
                        {gradeData[subjectId] || 'Not set'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Career Matches */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Career Matches
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Code className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Software Engineering
                    </span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">95%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Data Science
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">88%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Palette className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      UX Design
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">82%</span>
                </div>
              </div>
            </div>
            
            {/* University Courses */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Recommended Courses
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    Bachelor of Computer Science
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    University of Nairobi
                  </p>
                  <div className="flex items-center mt-2 text-xs">
                    <span className="text-gray-500">Min Grade:</span>
                    <span className="ml-1 font-medium text-orange-600">B+</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};
```

### Profile Management Page Design
```tsx
const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Picture Upload Section */}
              <div className="relative">
                <div className="h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {userData.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center text-white hover:bg-orange-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
                
                {/* Hidden file input for image upload */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-picture"
                  onChange={(e) => {/* handle file upload */}}
                />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {userData.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {userData.email}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                    <Circle className="mr-1 h-2 w-2 fill-current" />
                    {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              <Button className="bg-gradient-primary text-white">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
          
          {/* Profile Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {[
                { id: 'personal', name: 'Personal Info', icon: User },
                { id: 'academic', name: 'Academic Info', icon: GraduationCap },
                { id: 'preferences', name: 'Preferences', icon: Settings },
                { id: 'documents', name: 'Documents', icon: FileText },
                { id: 'privacy', name: 'Privacy & Security', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={userData.name}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={userData.email}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+254 700 123 456"
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City, County"
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button className="bg-gradient-primary text-white">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Documents & Certificates
                  </h2>
                  <Button className="bg-gradient-primary text-white">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
                
                {/* Document Upload Area */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6">
                  <div className="space-y-4">
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Upload your documents
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Drag and drop files here, or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        id="document-upload"
                        onChange={(e) => {/* handle file upload */}}
                      />
                      <label
                        htmlFor="document-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        Choose Files
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB each)
                    </p>
                  </div>
                </div>
                
                {/* Document List */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Uploaded Documents
                  </h3>
                  
                  {/* Document Item */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          KCSE Certificate
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Uploaded 2 days ago • 2.4 MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Image className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          School ID Photo
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Uploaded 1 week ago • 1.2 MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Completion */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Profile Completion
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-orange-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full w-3/4"></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Basic info completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Profile picture uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Academic info missing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Documents not uploaded</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Account Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Assessments Taken</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Careers Explored</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">25</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sessions with Counselors</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Days Active</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">45</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};
```

## 🎨 Universal Design Patterns Summary

### Page Structure Template
```tsx
// EVERY page follows this exact structure
const UniversalPageTemplate = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Page Header - White background with border */}
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs + Title + Actions */}
      </div>
    </div>
    
    {/* Main Content - Gray background canvas */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main: lg:col-span-2, Sidebar: Default span */}
      </div>
    </div>
  </div>
);
```

### File Upload Pattern
```tsx
// Standard file upload component
const FileUploadArea = () => (
  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
      <Upload className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
      Upload files
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Drag and drop files here, or click to browse
    </p>
    <input type="file" className="hidden" id="file-upload" />
    <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
      Choose Files
    </label>
  </div>
);
```

### Form Input Pattern
```tsx
// Standard form input structure
const FormInput = ({ label, type, placeholder, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
    />
  </div>
);
```

This comprehensive documentation covers all current page designs with exact element structures, file upload patterns, and form layouts that maintain consistency across the entire Elimu Smart platform.