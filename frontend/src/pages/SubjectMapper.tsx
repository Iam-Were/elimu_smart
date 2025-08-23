import React, { useState } from 'react';
import { 
  ChevronRight,
  Download,
  Info,
  Search,
  Microscope,
  Atom,
  Monitor,
  Clock,
  Globe,
  Book,
  Briefcase,
  Code,
  Database,
  Palette
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Subject {
  id: string;
  name: string;
  required?: boolean;
  icon?: React.ElementType;
}

interface SubjectCategory {
  title: string;
  subjects: Subject[];
}

const subjectCategories: SubjectCategory[] = [
  {
    title: 'Core Subjects (Required)',
    subjects: [
      { id: 'english', name: 'English', required: true },
      { id: 'kiswahili', name: 'Kiswahili', required: true },
      { id: 'mathematics', name: 'Mathematics', required: true }
    ]
  },
  {
    title: 'Sciences',
    subjects: [
      { id: 'biology', name: 'Biology', icon: Microscope },
      { id: 'chemistry', name: 'Chemistry', icon: Atom },
      { id: 'physics', name: 'Physics', icon: Atom },
      { id: 'computer', name: 'Computer Studies', icon: Monitor }
    ]
  },
  {
    title: 'Humanities & Social Sciences',
    subjects: [
      { id: 'history', name: 'History & Government', icon: Clock },
      { id: 'geography', name: 'Geography', icon: Globe },
      { id: 'cre', name: 'Christian Religious Education', icon: Book },
      { id: 'business', name: 'Business Studies', icon: Briefcase }
    ]
  }
];

const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'];

const mockCareerMatches = [
  { name: 'Software Engineering', match: 95, icon: Code },
  { name: 'Data Science', match: 88, icon: Database },
  { name: 'UX Design', match: 82, icon: Palette }
];

const mockCourses = [
  {
    title: 'Bachelor of Computer Science',
    university: 'University of Nairobi',
    minGrade: 'B+'
  },
  {
    title: 'Bachelor of Information Technology',
    university: 'KCA University',
    minGrade: 'B'
  }
];

const SubjectMapperPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['english', 'kiswahili', 'mathematics']);
  const [gradeData, setGradeData] = useState<Record<string, string>>({});

  const handleSubjectToggle = (subjectId: string, required?: boolean) => {
    if (required) return; // Can't toggle required subjects

    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(prev => prev.filter(id => id !== subjectId));
      // Remove grade data for unselected subject
      setGradeData(prev => {
        const updated = { ...prev };
        delete updated[subjectId];
        return updated;
      });
    } else {
      setSelectedSubjects(prev => [...prev, subjectId]);
    }
  };

  const handleGradeChange = (subjectId: string, grade: string) => {
    setGradeData(prev => ({ ...prev, [subjectId]: grade }));
  };

  const analyzeMatches = () => {
    // In real app, this would call an API
    console.log('Analyzing matches for subjects:', selectedSubjects, 'with grades:', gradeData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="hover:text-orange-600 transition-colors duration-200"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-gray-900 dark:text-gray-100 font-medium">Subject Mapper</span>
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
            <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </button>
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
                
                {subjectCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      {category.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {category.subjects.map((subject) => (
                        <div 
                          key={subject.id} 
                          className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                            subject.required 
                              ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                              : selectedSubjects.includes(subject.id)
                                ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-600'
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedSubjects.includes(subject.id)}
                              onChange={() => handleSubjectToggle(subject.id, subject.required)}
                              disabled={subject.required}
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            {subject.icon && (
                              <subject.icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            )}
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {subject.name}
                            </span>
                            {subject.required && (
                              <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          <select 
                            value={gradeData[subject.id] || ''}
                            onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Grade</option>
                            {gradeOptions.map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
              </div>
              
              {/* Analysis Button */}
              <div className="mt-8 text-center">
                <button 
                  onClick={analyzeMatches}
                  className="inline-flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Analyze Career Matches
                </button>
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
                  {selectedSubjects.map((subjectId) => {
                    const subject = subjectCategories
                      .flatMap(cat => cat.subjects)
                      .find(s => s.id === subjectId);
                    return (
                      <div key={subjectId} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900 dark:text-gray-100">
                          {subject?.name}
                        </span>
                        <span className="font-medium text-orange-600">
                          {gradeData[subjectId] || 'Not set'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Career Matches */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Career Matches
              </h3>
              <div className="space-y-3">
                {mockCareerMatches.map((career, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 
                        ? 'bg-orange-50 dark:bg-orange-900/20' 
                        : 'bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <career.icon className={`h-4 w-4 ${
                        index === 0 ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'
                      }`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {career.name}
                      </span>
                    </div>
                    <span className={`text-sm font-bold ${
                      index === 0 ? 'text-orange-600' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {career.match}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* University Courses */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Recommended Courses
              </h3>
              <div className="space-y-3">
                {mockCourses.map((course, index) => (
                  <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {course.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {course.university}
                    </p>
                    <div className="flex items-center mt-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Min Grade:</span>
                      <span className="ml-1 font-medium text-orange-600">{course.minGrade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default SubjectMapperPage;