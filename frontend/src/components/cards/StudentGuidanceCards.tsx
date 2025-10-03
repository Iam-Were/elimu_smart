import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  MessageSquare,
  Heart,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDynamicDashboard } from '@/hooks/useDynamicDashboard';

interface StudentGuidanceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'active' | 'urgent';
  actionText: string;
  actionLink: string;
  value?: string;
  change?: string;
  isDynamic?: boolean;
}

// Clean, essential guidance cards
const studentGuidanceCards: StudentGuidanceCard[] = [
  {
    id: 'counselor-support',
    title: 'Talk to Counselor',
    description: 'Professional guidance & support',
    icon: <Users className="h-6 w-6" />,
    status: 'available',
    actionText: 'Get Help',
    actionLink: '/guidance',
    value: 'Available',
    change: 'Counselors online',
    isDynamic: true
  },
  {
    id: 'quick-questions',
    title: 'Ask Questions',
    description: 'Get quick expert answers',
    icon: <MessageSquare className="h-6 w-6" />,
    status: 'available',
    actionText: 'Ask Now',
    actionLink: '/guidance',
    value: 'Free',
    change: '2-4 hour response',
    isDynamic: true
  },
  {
    id: 'career-mentorship',
    title: 'Find Mentor',
    description: 'Connect with professionals',
    icon: <Compass className="h-6 w-6" />,
    status: 'available',
    actionText: 'Get Mentor',
    actionLink: '/guidance',
    value: 'Free',
    change: 'Monthly meetings',
    isDynamic: true
  },
  {
    id: 'crisis-support',
    title: 'Crisis Support',
    description: '24/7 emergency help',
    icon: <Heart className="h-6 w-6" />,
    status: 'urgent',
    actionText: 'Get Help Now',
    actionLink: '/guidance',
    value: 'Available',
    change: 'Always online'
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'urgent': return 'text-red-600';
    case 'active': return 'text-blue-600';
    default: return 'text-green-600';
  }
};

interface StudentGuidanceCardsProps {
  className?: string;
  showAll?: boolean;
  maxCards?: number;
}

export const StudentGuidanceCards: React.FC<StudentGuidanceCardsProps> = ({
  className,
  showAll = false,
  maxCards = 4,
}) => {
  const navigate = useNavigate();
  const { logActivity } = useDynamicDashboard();

  // Update cards with backend data
  const getUpdatedCards = () => {
    return studentGuidanceCards.map(card => {
      if (!card.isDynamic) return card;

      switch (card.id) {
        case 'counselor-support':
          return { ...card, value: 'Available', change: 'Counselors online' };
        case 'quick-questions':
          return { ...card, value: 'Free', change: '2-4 hour response' };
        case 'career-mentorship':
          return { ...card, value: 'Free', change: 'Monthly meetings' };
        default:
          return card;
      }
    });
  };

  const displayedCards = getUpdatedCards().slice(0, showAll ? undefined : maxCards);

  const handleCardClick = (card: StudentGuidanceCard) => {
    try {
      logActivity('guidance_card_click', {
        cardId: card.id,
        cardTitle: card.title
      });
    } catch (error) {
      console.warn('Failed to log activity:', error);
    }
    navigate(card.actionLink);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Clean card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedCards.map((card) => (
          <Card
            key={card.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-orange-200"
            onClick={() => handleCardClick(card)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  {card.icon}
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-slate-800">
                    {card.title}
                  </CardTitle>
                  <p className="text-sm text-slate-600">{card.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <Badge variant="outline" className={getStatusColor(card.status)}>
                  {card.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-800">
                    {card.value || 'Ready'}
                  </div>
                  <p className="text-xs text-slate-500">
                    {card.change || 'Click to access'}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card);
                  }}
                >
                  {card.actionText}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary stats */}
      {!showAll && studentGuidanceCards.length > maxCards && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {studentGuidanceCards.filter(card => card.status === 'available').length}
              </div>
              <div className="text-sm text-orange-700">Available Now</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {studentGuidanceCards.filter(card => card.value === 'Free').length}
              </div>
              <div className="text-sm text-orange-700">Free Services</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentGuidanceCards;