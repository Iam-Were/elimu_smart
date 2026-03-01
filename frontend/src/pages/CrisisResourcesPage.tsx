import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Phone, MessageCircle, Clock, Heart, AlertTriangle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HotlineCard {
  name: string;
  number: string;
  description: string;
  hours: string;
  free: boolean;
  color: string;
  icon: React.ReactNode;
}

const hotlines: HotlineCard[] = [
  {
    name: 'Childline Kenya',
    number: '116',
    description: 'Free, confidential helpline for children and young people in distress. Trained counselors available 24/7.',
    hours: '24 hours, 7 days',
    free: true,
    color: 'from-teal-500 to-teal-600',
    icon: <Heart className="w-6 h-6 text-white" />,
  },
  {
    name: 'NACADA Helpline',
    number: '1192',
    description: 'National Authority for the Campaign Against Alcohol and Drug Abuse. Support for substance issues and mental health.',
    hours: '8am – 5pm, Mon–Fri',
    free: true,
    color: 'from-amber-500 to-amber-600',
    icon: <MessageCircle className="w-6 h-6 text-white" />,
  },
  {
    name: 'Befrienders Kenya',
    number: '+254 722 178 177',
    description: 'Emotional support for anyone in distress, feeling lonely or struggling. Trained volunteers listen without judgement.',
    hours: 'Daily, 7am – 9pm',
    free: false,
    color: 'from-blue-500 to-blue-600',
    icon: <Phone className="w-6 h-6 text-white" />,
  },
  {
    name: 'KNH Mental Health',
    number: '+254 20 272 6300',
    description: 'Kenyatta National Hospital Psychiatry Department. Professional mental health assessment and referral services.',
    hours: 'Mon–Fri, 8am – 5pm',
    free: false,
    color: 'from-violet-500 to-violet-600',
    icon: <Heart className="w-6 h-6 text-white" />,
  },
];

const CrisisResourcesPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-teal-500 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-card-foreground">
              Crisis & Mental Health Resources
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Kenya — verified helplines and support services
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="flex gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              If you or someone you know is in immediate danger
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Call <strong>999</strong> (Police) or <strong>112</strong> (Emergency) immediately.
              These helplines are for emotional support and non-emergency mental health concerns.
            </p>
          </div>
        </div>
      </div>

      {/* Hotline Cards */}
      <div className="grid gap-4">
        {hotlines.map((hotline) => (
          <Card key={hotline.name} className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                  `bg-gradient-to-br ${hotline.color}`
                )}>
                  {hotline.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-base font-semibold text-card-foreground">
                      {hotline.name}
                    </CardTitle>
                    {hotline.free && (
                      <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 border-0">
                        Free
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{hotline.hours}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {hotline.description}
              </p>
              <Button
                onClick={() => window.open(`tel:${hotline.number.replace(/\s/g, '')}`, '_self')}
                className={cn(
                  'w-full text-sm font-medium min-h-[44px] rounded-md',
                  `bg-gradient-to-r ${hotline.color} hover:opacity-90 text-white transition-opacity`
                )}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call {hotline.number}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer note */}
      <div className="flex gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          These are verified external services, not operated by Elimu Smart.
          Reaching out is a sign of strength — trained counselors are here to listen and support you.
        </p>
      </div>
    </div>
  );
};

export default CrisisResourcesPage;
