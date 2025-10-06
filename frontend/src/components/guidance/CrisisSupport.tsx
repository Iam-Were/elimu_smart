import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Phone,
  MessageCircle,
  Globe,
  AlertCircle,
  Shield,
  Heart,
  Brain,
  Users,
  ExternalLink,
} from 'lucide-react';

interface CrisisResource {
  id: string;
  name: string;
  type: 'hotline' | 'sms' | 'online' | 'in-person';
  category: 'mental-health' | 'abuse' | 'substance' | 'academic' | 'general';
  description: string;
  contact: {
    phone?: string;
    sms?: string;
    website?: string;
    hours?: string;
  };
  isFree: boolean;
  isConfidential: boolean;
  languages: string[];
}

const crisisResources: CrisisResource[] = [
  {
    id: '1',
    name: 'Childline Kenya',
    type: 'hotline',
    category: 'general',
    description: 'Free 24/7 helpline for children and young people facing any challenge. Trained counselors provide immediate support.',
    contact: {
      phone: '116',
      website: 'https://www.childlinekenya.co.ke',
      hours: '24/7'
    },
    isFree: true,
    isConfidential: true,
    languages: ['English', 'Swahili']
  },
  {
    id: '2',
    name: 'NACADA Toll-Free Helpline',
    type: 'hotline',
    category: 'substance',
    description: 'National Authority for the Campaign Against Alcohol and Drug Abuse. Confidential support for substance abuse issues.',
    contact: {
      phone: '1192',
      website: 'https://www.nacada.go.ke',
      hours: 'Mon-Fri, 8AM-5PM'
    },
    isFree: true,
    isConfidential: true,
    languages: ['English', 'Swahili']
  },
  {
    id: '3',
    name: 'Befrienders Kenya',
    type: 'hotline',
    category: 'mental-health',
    description: 'Emotional support for anyone feeling depressed, distressed, or suicidal. Trained volunteers provide a listening ear.',
    contact: {
      phone: '+254 722 178 177',
      sms: '+254 722 178 177',
      website: 'https://www.befrienderskenya.org',
      hours: 'Daily, 9AM-9PM'
    },
    isFree: true,
    isConfidential: true,
    languages: ['English', 'Swahili']
  },
  {
    id: '4',
    name: 'Kenya Red Cross Psychosocial Support',
    type: 'online',
    category: 'mental-health',
    description: 'Mental health and psychosocial support services. Counseling for stress, anxiety, and trauma.',
    contact: {
      phone: '1199',
      website: 'https://www.redcross.or.ke',
      hours: '24/7'
    },
    isFree: true,
    isConfidential: true,
    languages: ['English', 'Swahili']
  },
  {
    id: '5',
    name: 'Gender Violence Recovery Centre',
    type: 'hotline',
    category: 'abuse',
    description: 'Support for survivors of sexual and gender-based violence. Medical, legal, and counseling services available.',
    contact: {
      phone: '0709 419 000',
      website: 'https://www.gvrc.or.ke',
      hours: '24/7'
    },
    isFree: true,
    isConfidential: true,
    languages: ['English', 'Swahili']
  },
  {
    id: '6',
    name: 'Academic Stress Support',
    type: 'in-person',
    category: 'academic',
    description: 'School counselors and educational psychologists available at your institution. Contact your school administration.',
    contact: {
      hours: 'School hours'
    },
    isFree: true,
    isConfidential: true,
    languages: ['English', 'Swahili']
  },
];

const CrisisSupport: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotline': return <Phone className="h-5 w-5" />;
      case 'sms': return <MessageCircle className="h-5 w-5" />;
      case 'online': return <Globe className="h-5 w-5" />;
      case 'in-person': return <Users className="h-5 w-5" />;
      default: return <Phone className="h-5 w-5" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mental-health': return <Brain className="h-5 w-5 text-purple-600" />;
      case 'abuse': return <Shield className="h-5 w-5 text-red-600" />;
      case 'substance': return <Heart className="h-5 w-5 text-green-600" />;
      case 'academic': return <Users className="h-5 w-5 text-blue-600" />;
      case 'general': return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mental-health': return 'bg-purple-100 text-purple-700';
      case 'abuse': return 'bg-red-100 text-red-700';
      case 'substance': return 'bg-green-100 text-green-700';
      case 'academic': return 'bg-blue-100 text-blue-700';
      case 'general': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Crisis Support Resources</h1>
        <p className="text-muted-foreground">
          Free, confidential help available 24/7. You're not alone - reach out for support.
        </p>
      </div>

      {/* Emergency Alert */}
      <Alert className="mb-8 border-red-600 bg-red-50">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-900">
          <strong>In immediate danger?</strong> Call 999 (Police Emergency) or 112 (Emergency Services) right away.
        </AlertDescription>
      </Alert>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Childline Kenya</p>
                <p className="text-2xl font-bold text-purple-600">116</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Free, 24/7 youth helpline</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-600 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">NACADA</p>
                <p className="text-2xl font-bold text-green-600">1192</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Substance abuse support</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Red Cross</p>
                <p className="text-2xl font-bold text-blue-600">1199</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Psychosocial support</p>
          </CardContent>
        </Card>
      </div>

      {/* All Resources */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">All Support Services</h2>
        <div className="space-y-4">
          {crisisResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{resource.name}</CardTitle>
                        {resource.isFree && (
                          <Badge variant="secondary" className="text-xs">
                            FREE
                          </Badge>
                        )}
                        {resource.isConfidential && (
                          <Badge variant="secondary" className="text-xs">
                            CONFIDENTIAL
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getCategoryColor(resource.category)}>
                    {getCategoryIcon(resource.category)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    {resource.contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{resource.contact.phone}</span>
                      </div>
                    )}
                    {resource.contact.sms && (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span>SMS: {resource.contact.sms}</span>
                      </div>
                    )}
                    {resource.contact.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={resource.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:underline"
                        >
                          Visit Website
                          <ExternalLink className="inline h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-2">
                    {resource.contact.hours && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Hours:</span> {resource.contact.hours}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="text-muted-foreground">Languages:</span> {resource.languages.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {resource.contact.phone && (
                  <Button className="w-full md:w-auto">
                    <Phone className="h-4 w-4 mr-2" />
                    Call {resource.contact.phone}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Important Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>All services listed are FREE and CONFIDENTIAL.</strong> They are run by verified organizations
            and staffed by trained professionals.
          </p>
          <p>
            <strong>This platform does NOT provide crisis counseling.</strong> The resources above are external
            organizations that specialize in crisis support.
          </p>
          <p>
            <strong>When to seek help:</strong> If you're experiencing thoughts of self-harm, abuse, severe anxiety,
            depression, substance issues, or academic pressure - these services are here for you.
          </p>
          <p>
            <strong>Your privacy matters:</strong> All helplines maintain strict confidentiality unless there's
            immediate danger to you or others.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisSupport;
