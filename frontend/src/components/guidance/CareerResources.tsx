import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  BookOpen,
  Video,
  FileText,
  Download,
  ExternalLink,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Calendar,
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'guide' | 'video' | 'pdf' | 'tool';
  category: 'career' | 'university' | 'kcse' | 'kuccps' | 'skills';
  description: string;
  url?: string;
  downloadUrl?: string;
  duration?: string;
  pages?: number;
  popularity: number;
  tags: string[];
}

const sampleResources: Resource[] = [
  {
    id: '1',
    title: 'Complete KCSE Subject Combination Guide 2025',
    type: 'pdf',
    category: 'kcse',
    description: 'Comprehensive guide on choosing the right subject combinations for your target career path. Includes cluster points calculation.',
    downloadUrl: '/resources/kcse-subject-guide.pdf',
    pages: 28,
    popularity: 1250,
    tags: ['kcse', 'subjects', 'career-planning']
  },
  {
    id: '2',
    title: 'How to Choose Your University Course',
    type: 'video',
    category: 'university',
    description: 'Expert counselors explain the factors to consider when choosing a university course. Real student experiences included.',
    url: '/resources/videos/university-choice',
    duration: '18 mins',
    popularity: 890,
    tags: ['university', 'kuccps', 'decision-making']
  },
  {
    id: '3',
    title: 'Kenya Careers Database Explorer',
    type: 'tool',
    category: 'career',
    description: 'Interactive tool to explore 200+ careers available in Kenya. Filter by education level, salary range, and industry.',
    url: '/assessment/explore',
    popularity: 2100,
    tags: ['careers', 'exploration', 'interactive']
  },
  {
    id: '4',
    title: 'KUCCPS Application Timeline & Checklist',
    type: 'guide',
    category: 'kuccps',
    description: 'Step-by-step timeline for KUCCPS application process. Never miss a deadline with our comprehensive checklist.',
    url: '/resources/kuccps-timeline',
    popularity: 1450,
    tags: ['kuccps', 'deadlines', 'application']
  },
  {
    id: '5',
    title: 'Building Career Skills While in Form 3-4',
    type: 'guide',
    category: 'skills',
    description: 'Practical guide on developing employability skills before university. Includes volunteer opportunities and online courses.',
    url: '/student/skills-development',
    popularity: 678,
    tags: ['skills', 'development', 'preparation']
  },
  {
    id: '6',
    title: 'University Comparison Tool',
    type: 'tool',
    category: 'university',
    description: 'Compare Kenyan universities side-by-side: fees, programs, accommodation, student life, and graduate outcomes.',
    url: '/assessment/university',
    popularity: 1820,
    tags: ['university', 'comparison', 'research']
  },
];

const CareerResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Resources', count: 45 },
    { value: 'career', label: 'Careers', count: 15 },
    { value: 'university', label: 'Universities', count: 12 },
    { value: 'kcse', label: 'KCSE', count: 8 },
    { value: 'kuccps', label: 'KUCCPS', count: 6 },
    { value: 'skills', label: 'Skills', count: 4 },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'tool': return <TrendingUp className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'pdf': return 'bg-green-100 text-green-700';
      case 'tool': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Career Resources</h1>
        <p className="text-muted-foreground">
          Guides, videos, and tools to help you make informed career and university decisions.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">45+</p>
                <p className="text-sm text-muted-foreground">Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">PDF Guides</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label} ({cat.count})
          </Button>
        ))}
      </div>

      {/* Featured Resources */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Popular Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {resource.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {resource.duration && (
                    <>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {resource.duration}
                      </span>
                    </>
                  )}
                  {resource.pages && (
                    <>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {resource.pages} pages
                      </span>
                    </>
                  )}
                  <span>{resource.popularity.toLocaleString()} views</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {resource.url && (
                    <Button className="flex-1" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  )}
                  {resource.downloadUrl && (
                    <Button className="flex-1" size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-orange-600" />
              University Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className="p-0 h-auto text-left">
                  KUCCPS Application Guide
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="p-0 h-auto text-left">
                  University Comparison Tool
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="p-0 h-auto text-left">
                  Scholarship Opportunities
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="p-0 h-auto text-left">
                  Accommodation Guide
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-orange-600" />
              Career Exploration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className="p-0 h-auto text-left">
                  Kenya Careers Database
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="p-0 h-auto text-left">
                  Subject-Career Mapper
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="p-0 h-auto text-left">
                  Skills Development Guide
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="p-0 h-auto text-left">
                  Career Success Stories
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerResources;
