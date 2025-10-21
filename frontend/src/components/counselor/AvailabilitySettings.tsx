import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Save, ExternalLink, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Parse from 'parse';

interface SessionType {
  id: string;
  name: string;
  duration: number; // minutes
  price: number; // KES
  description: string;
  isActive: boolean;
}

export const AvailabilitySettings = () => {
  const [saving, setSaving] = useState(false);
  
  // Cal.com settings
  const [calUsername, setCalUsername] = useState('');
  const [hasCalAccount, setHasCalAccount] = useState(false);
  
  // Session types
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([
    {
      id: '1',
      name: 'Quick Chat',
      duration: 30,
      price: 0,
      description: 'Free 30-minute introduction call',
      isActive: true
    },
    {
      id: '2',
      name: 'Career Mapping',
      duration: 60,
      price: 500,
      description: 'Deep dive into your career goals and action plan',
      isActive: true
    }
  ]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) return;

      const calUsernameStored = currentUser.get('calUsername');
      const sessionTypesStored = currentUser.get('sessionTypes');

      if (calUsernameStored) {
        setCalUsername(calUsernameStored);
        setHasCalAccount(true);
      }

      if (sessionTypesStored) {
        setSessionTypes(sessionTypesStored);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const currentUser = Parse.User.current();
      if (!currentUser) throw new Error('Not authenticated');

      currentUser.set('calUsername', calUsername);
      currentUser.set('sessionTypes', sessionTypes);

      await currentUser.save();

      toast.success('Settings saved', {
        description: 'Your availability settings have been updated.'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Error', {
        description: 'Failed to save settings: ' + errorMessage
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSessionType = (id: string, updates: Partial<SessionType>) => {
    setSessionTypes(prev => 
      prev.map(session => 
        session.id === id ? { ...session, ...updates } : session
      )
    );
  };

  const addSessionType = () => {
    const newSession: SessionType = {
      id: Date.now().toString(),
      name: 'New Session Type',
      duration: 60,
      price: 1000,
      description: '',
      isActive: false
    };
    setSessionTypes(prev => [...prev, newSession]);
  };

  const removeSessionType = (id: string) => {
    setSessionTypes(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Availability & Booking Settings</h2>
          <p className="text-muted-foreground">Manage your calendar and session types</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar Integration
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Clock className="h-4 w-4 mr-2" />
            Session Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cal.com Integration</CardTitle>
              <CardDescription>
                Connect your Cal.com account to enable automated scheduling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasCalAccount ? (
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Don't have Cal.com yet?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Cal.com is a free, open-source scheduling platform. Create an account to get started.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.open('https://cal.com/signup', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Create Free Cal.com Account
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calUsername">Cal.com Username</Label>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">cal.com/</span>
                        <Input
                          id="calUsername"
                          placeholder="your-username"
                          value={calUsername}
                          onChange={(e) => setCalUsername(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (calUsername) {
                            setHasCalAccount(true);
                            toast.success('Username saved', {
                              description: 'Remember to save your settings!'
                            });
                          }
                        }}
                      >
                        Connect
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter your Cal.com username (e.g., if your link is cal.com/john-doe, enter "john-doe")
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-semibold">Connected to Cal.com</p>
                      <p className="text-sm text-muted-foreground">
                        Your booking page: cal.com/{calUsername}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://cal.com/${calUsername}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Page
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://cal.com/availability', '_blank')}
                      >
                        Edit Availability
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Embed Preview</Label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <p className="text-sm text-muted-foreground mb-2">
                        This is how students will book sessions:
                      </p>
                      <div className="bg-white border rounded p-4 text-center">
                        <Button
                          variant="default"
                          onClick={() => window.open(`https://cal.com/${calUsername}`, '_blank')}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book a Session
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setHasCalAccount(false);
                      setCalUsername('');
                    }}
                  >
                    Disconnect Cal.com
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Types</CardTitle>
              <CardDescription>
                Define different types of counseling sessions you offer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionTypes.map((session) => (
                <Card key={session.id} className="border-2">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <Input
                            value={session.name}
                            onChange={(e) => updateSessionType(session.id, { name: e.target.value })}
                            className="font-semibold"
                          />
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={session.isActive}
                              onCheckedChange={(checked) => 
                                updateSessionType(session.id, { isActive: checked })
                              }
                            />
                            <Label className="text-sm">Active</Label>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Duration (minutes)</Label>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                value={session.duration}
                                onChange={(e) => 
                                  updateSessionType(session.id, { duration: parseInt(e.target.value) || 0 })
                                }
                                min={15}
                                step={15}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Price (KES)</Label>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                value={session.price}
                                onChange={(e) => 
                                  updateSessionType(session.id, { price: parseInt(e.target.value) || 0 })
                                }
                                min={0}
                                step={100}
                              />
                            </div>
                            {session.price === 0 && (
                              <Badge variant="secondary">Free</Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={session.description}
                            onChange={(e) => 
                              updateSessionType(session.id, { description: e.target.value })
                            }
                            placeholder="Describe what this session includes..."
                            rows={2}
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSessionType(session.id)}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addSessionType} variant="outline" className="w-full">
                + Add Session Type
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
