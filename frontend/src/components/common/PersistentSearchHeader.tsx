import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getParse } from '@/config/parse';

interface SearchResult {
  type: 'career' | 'assessment' | 'guidance' | 'resource' | 'university' | 'course';
  title: string;
  description: string;
  url: string;
}

export const PersistentSearchHeader: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-collapse on scroll (LinkedIn style)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
        setIsFocused(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Real backend search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    try {
      const Parse = await getParse();
      const searchResults: SearchResult[] = [];

      // Search careers via Cloud Function
      try {
        const careerResults = await Parse.Cloud.run('exploreCareers', {
          searchQuery: searchQuery,
          limit: 3
        });

        if (careerResults && Array.isArray(careerResults)) {
          careerResults.forEach((career: { title?: string; name?: string; description?: string; id?: string }) => {
            searchResults.push({
              type: 'career',
              title: career.title || career.name || 'Unknown Career',
              description: career.description || 'Career information',
              url: `/assessment/explore?career=${career.id || (career.title || career.name || '').toLowerCase().replace(/\s+/g, '-')}`
            });
          });
        }
      } catch (error) {
        console.warn('Career search failed:', error);
      }

      // Search universities via Parse.Query
      try {
        const universityQuery = new Parse.Query('University');
        universityQuery.matches('name', new RegExp(searchQuery, 'i'));
        universityQuery.limit(2);
        const universities = await universityQuery.find();

        universities.forEach(university => {
          searchResults.push({
            type: 'university',
            title: university.get('name') || 'Unknown University',
            description: university.get('description') || university.get('location') || 'University information',
            url: `/assessment/university-finder?university=${university.id}`
          });
        });
      } catch (error) {
        console.warn('University search failed:', error);
      }

      // Search courses via Parse.Query
      try {
        const courseQuery = new Parse.Query('Course');
        courseQuery.matches('name', new RegExp(searchQuery, 'i'));
        courseQuery.limit(2);
        const courses = await courseQuery.find();

        courses.forEach(course => {
          searchResults.push({
            type: 'course',
            title: course.get('name') || 'Unknown Course',
            description: course.get('description') || course.get('category') || 'Course information',
            url: `/assessment/university-finder?course=${course.id}`
          });
        });
      } catch (error) {
        console.warn('Course search failed:', error);
      }

      // Add static assessment/guidance results with keyword matching
      const staticResults: SearchResult[] = [
        {
          type: 'assessment',
          title: 'RIASEC Career Assessment',
          description: 'Discover careers that match your personality',
          url: '/assessment/career'
        },
        {
          type: 'assessment',
          title: 'Skills Assessment',
          description: 'Identify your strengths and development areas',
          url: '/assessment/skills'
        },
        {
          type: 'assessment',
          title: 'University Course Finder',
          description: 'Find the perfect course and university for you',
          url: '/assessment/university-finder'
        },
        {
          type: 'assessment',
          title: 'Career Explorer',
          description: 'Browse hundreds of career options',
          url: '/assessment/explore'
        },
        {
          type: 'assessment',
          title: 'Subject-Career Mapper',
          description: 'See which careers match your KCSE subjects',
          url: '/assessment/subject-career'
        },
        {
          type: 'guidance',
          title: 'Community Q&A',
          description: 'Ask questions and get answers from counselors',
          url: '/guidance?tab=services'
        },
        {
          type: 'guidance',
          title: 'Book Counseling Session',
          description: 'Schedule a 1-on-1 session with a career counselor',
          url: '/guidance?tab=bookings'
        },
        {
          type: 'resource',
          title: 'Career Resources Library',
          description: 'Guides, videos, and tools for career planning',
          url: '/guidance?tab=resources'
        },
        {
          type: 'guidance',
          title: 'Professional Network',
          description: 'Connect with professionals in your field',
          url: '/guidance?tab=network'
        }
      ];

      // Filter static results by keyword matching
      const matchedStaticResults = staticResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Combine all results (backend first, then static)
      const allResults = [...searchResults, ...matchedStaticResults];
      setResults(allResults.slice(0, 8));
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to static results only if backend completely fails
      const staticResults: SearchResult[] = [
        {
          type: 'assessment',
          title: 'RIASEC Career Assessment',
          description: 'Discover careers that match your personality',
          url: '/assessment/career'
        },
        {
          type: 'assessment',
          title: 'Career Explorer',
          description: 'Browse hundreds of career options',
          url: '/assessment/explore'
        }
      ];
      const matchedResults = staticResults.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(matchedResults);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim()) {
      setIsSearching(true);
      // Debounce search by 300ms
      debounceTimerRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };

  const handleResultClick = (url: string) => {
    navigate(url);
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  const getResultBadgeColor = (type: string) => {
    switch (type) {
      case 'career':
        return 'bg-purple-100 text-purple-700';
      case 'assessment':
        return 'bg-orange-100 text-orange-700';
      case 'guidance':
        return 'bg-amber-100 text-amber-700';
      case 'resource':
        return 'bg-green-100 text-green-700';
      case 'university':
        return 'bg-blue-100 text-blue-700';
      case 'course':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      ref={searchRef}
      className={cn(
        'sticky top-16 z-40 transition-all duration-300 bg-background/95 backdrop-blur-sm border-b border-border/40',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      )}
    >
      <div className="container max-w-5xl mx-auto py-3 px-4">
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin pointer-events-none" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            )}
            <Input
              type="text"
              placeholder="Search careers, courses, resources..."
              value={query}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              className={cn(
                'pl-10 pr-10 h-11 w-full bg-background border-border/60 focus:border-orange-500 transition-colors',
                isFocused && 'ring-2 ring-orange-500/20'
              )}
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isFocused && results.length > 0 && !isSearching && (
            <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg border-border/60 animate-in fade-in slide-in-from-top-2 duration-200">
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result.url)}
                      className="w-full text-left p-4 hover:bg-muted transition-colors border-b last:border-b-0 border-border/40"
                    >
                      <div className="flex items-start gap-3">
                        <Search className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm truncate">{result.title}</span>
                            <Badge className={cn('text-xs', getResultBadgeColor(result.type))}>
                              {result.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {result.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Results */}
          {isFocused && query && results.length === 0 && !isSearching && (
            <Card className="absolute top-full left-0 right-0 mt-2 shadow-lg border-border/60 animate-in fade-in slide-in-from-top-2 duration-200">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                <p className="text-xs text-muted-foreground mt-1">Try different keywords</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
