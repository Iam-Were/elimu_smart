import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  GraduationCap,
  BookOpen,
  Briefcase,
  FileQuestion,
  Database,
  Settings,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { AdminRoleType } from '@/utils/adminPermissions';

interface AdminContentCard {
  id: string;
  title: string;
  description: string; // <100 chars
  icon: React.ReactNode;
  iconGradient: string;
  actionText: string;
  actionLink: string;
  itemCount: number;
  category: string;
  priority: 'high' | 'medium' | 'low';
  allowedRoles: AdminRoleType[]; // RBAC: which admin roles can access
}

const adminContentCards: AdminContentCard[] = [
  {
    id: 'universities',
    title: 'Universities',
    description: 'Manage Kenyan universities and institutions',
    icon: <GraduationCap className="h-6 w-6" />,
    iconGradient: 'from-indigo-500 to-indigo-600',
    actionText: 'Manage Universities',
    actionLink: '/admin/content/universities',
    itemCount: 42,
    category: 'Education',
    priority: 'high',
    allowedRoles: ['operations', 'platform'], // Operations & Platform admins
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'Manage university courses and programs',
    icon: <BookOpen className="h-6 w-6" />,
    iconGradient: 'from-blue-500 to-blue-600',
    actionText: 'Manage Courses',
    actionLink: '/admin/content/courses',
    itemCount: 156,
    category: 'Education',
    priority: 'high',
    allowedRoles: ['operations', 'platform'], // Operations & Platform admins
  },
  {
    id: 'careers',
    title: 'Careers',
    description: 'Manage career profiles and information',
    icon: <Briefcase className="h-6 w-6" />,
    iconGradient: 'from-amber-500 to-amber-600',
    actionText: 'Manage Careers',
    actionLink: '/admin/content/careers',
    itemCount: 42,
    category: 'Career Guidance',
    priority: 'high',
    allowedRoles: ['operations', 'platform'], // Operations & Platform admins
  },
  {
    id: 'assessments',
    title: 'Assessment Questions',
    description: 'Manage RIASEC and Skills assessment questions',
    icon: <FileQuestion className="h-6 w-6" />,
    iconGradient: 'from-purple-500 to-purple-600',
    actionText: 'Manage Questions',
    actionLink: '/admin/content/assessments',
    itemCount: 132,
    category: 'Assessments',
    priority: 'medium',
    allowedRoles: ['operations'], // Operations only (technical content)
  },
  {
    id: 'subject-mappings',
    title: 'Subject Mappings',
    description: 'Manage subject-to-career relationships',
    icon: <Database className="h-6 w-6" />,
    iconGradient: 'from-green-500 to-green-600',
    actionText: 'View Mappings',
    actionLink: '/admin/content/subject-mappings',
    itemCount: 37,
    category: 'Relationships',
    priority: 'low',
    allowedRoles: ['operations'], // Operations only (data relationships)
  },
  {
    id: 'content-settings',
    title: 'Content Settings',
    description: 'Configure content management preferences',
    icon: <Settings className="h-6 w-6" />,
    iconGradient: 'from-gray-500 to-gray-600',
    actionText: 'Configure',
    actionLink: '/admin/content/settings',
    itemCount: 0,
    category: 'Configuration',
    priority: 'low',
    allowedRoles: ['operations'], // Operations only (system config)
  },
];

const getPriorityBadge = (priority: string) => {
  const configs = {
    high: { label: 'High Priority', className: 'bg-red-50 text-red-700 border-red-200' },
    medium: { label: 'Medium', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    low: { label: 'Low Priority', className: 'bg-gray-50 text-gray-700 border-gray-200' },
  };
  return configs[priority as keyof typeof configs] || configs.medium;
};

interface AdminContentManagementCardsProps {
  className?: string;
}

export const AdminContentManagementCards: React.FC<AdminContentManagementCardsProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get admin role from user metadata (default to operations for all admins)
  const adminRole: AdminRoleType = (user?.role === 'admin' ? (user as { adminRole?: AdminRoleType }).adminRole : undefined) || 'operations';

  // Check if current admin has access to a card
  const hasAccess = (card: AdminContentCard): boolean => {
    return card.allowedRoles.includes(adminRole);
  };

  const handleCardClick = (card: AdminContentCard) => {
    if (!hasAccess(card)) {
      return; // Don't navigate for restricted cards
    }
    navigate(card.actionLink);
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Admin Content Management Header */}
      <Card className="border-purple-200/30 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-purple-900">
                Content Management
              </div>
              <div className="text-sm text-purple-600 font-medium">
                Manage all platform educational content
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl text-center space-y-2 shadow-sm">
              <div className="text-3xl font-bold text-indigo-600">
                {adminContentCards.find(c => c.id === 'universities')?.itemCount || 0}
              </div>
              <div className="text-sm font-medium text-gray-700">Universities</div>
            </div>

            <div className="bg-white p-4 rounded-xl text-center space-y-2 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">
                {adminContentCards.find(c => c.id === 'courses')?.itemCount || 0}
              </div>
              <div className="text-sm font-medium text-gray-700">Courses</div>
            </div>

            <div className="bg-white p-4 rounded-xl text-center space-y-2 shadow-sm">
              <div className="text-3xl font-bold text-amber-600">
                {adminContentCards.find(c => c.id === 'careers')?.itemCount || 0}
              </div>
              <div className="text-sm font-medium text-gray-700">Careers</div>
            </div>

            <div className="bg-white p-4 rounded-xl text-center space-y-2 shadow-sm">
              <div className="text-3xl font-bold text-purple-600">
                {adminContentCards.find(c => c.id === 'assessments')?.itemCount || 0}
              </div>
              <div className="text-sm font-medium text-gray-700">Questions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Management Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {adminContentCards.map((card) => {
          const priorityBadge = getPriorityBadge(card.priority);
          const cardHasAccess = hasAccess(card);

          return (
            <Card
              key={card.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300",
                cardHasAccess && "cursor-pointer hover:scale-[1.02] hover:shadow-xl",
                !cardHasAccess && "opacity-60 cursor-not-allowed",
                "bg-white border border-purple-200/30 rounded-xl",
                card.priority === 'high' && cardHasAccess && "ring-2 ring-purple-300/50 shadow-lg shadow-purple-500/10"
              )}
            >
              {/* Priority/Access Indicator */}
              {card.priority === 'high' && cardHasAccess && (
                <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  Essential
                </div>
              )}
              {!cardHasAccess && (
                <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Restricted
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                      `bg-gradient-to-br ${card.iconGradient}`
                    )}
                  >
                    {React.cloneElement(card.icon as React.ReactElement<{ className?: string }>, {
                      className: "w-6 h-6 text-white",
                    })}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      {card.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {card.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <CardDescription className="text-sm text-slate-600">
                  {card.description}
                </CardDescription>

                {/* Item Count */}
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-700">Total Items</span>
                    <span className="text-2xl font-bold text-purple-600">{card.itemCount}</span>
                  </div>
                </div>

                {/* Priority Badge */}
                <Badge
                  variant="secondary"
                  className={cn(priorityBadge.className, "text-xs w-full justify-center py-1")}
                >
                  {priorityBadge.label}
                </Badge>
              </CardContent>

              <CardFooter className="pt-3">
                <Button
                  onClick={() => handleCardClick(card)}
                  disabled={!cardHasAccess}
                  className={cn(
                    "w-full gap-2 font-medium",
                    cardHasAccess && card.priority === 'high' && "bg-purple-600 hover:bg-purple-700 text-white",
                    cardHasAccess && card.priority !== 'high' && "bg-purple-500 hover:bg-purple-600 text-white",
                    !cardHasAccess && "bg-gray-400 text-gray-200 cursor-not-allowed"
                  )}
                >
                  {cardHasAccess ? card.actionText : 'Access Restricted'}
                  {cardHasAccess ? <ArrowRight className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminContentManagementCards;
