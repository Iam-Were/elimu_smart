import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Shield, Loader2, AlertCircle } from 'lucide-react';
import { getParse } from '@/config/parse';

type PageState = 'loading' | 'ready' | 'submitting' | 'accepted' | 'declined' | 'error';

export function ConsentPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>('loading');
  const [studentName, setStudentName] = useState('');
  const [message, setMessage] = useState('');

  // Validate the token on mount — just try to fetch consent details
  useEffect(() => {
    if (!token) { setState('error'); return; }
    setState('ready');
  }, [token]);

  const handleDecision = async (decision: 'accept' | 'decline') => {
    setState('submitting');
    try {
      const Parse = getParse();
      const result = await Parse.Cloud.run('recordParentConsent', { token, decision });
      setStudentName(result.studentName || '');
      setMessage(result.message || '');
      setState(decision === 'accept' ? 'accepted' : 'declined');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setMessage(msg);
      setState('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-3">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Elimu Smart</h1>
          <p className="text-muted-foreground">Career Guidance for Kenyan Students</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center">Parent / Guardian Consent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {state === 'loading' && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            )}

            {state === 'ready' && (
              <>
                <div className="space-y-4 text-sm text-gray-700">
                  <p>
                    Your child has registered on Elimu Smart, a career guidance platform helping
                    Kenyan secondary school students explore career paths and connect with
                    professional counselors.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-gray-900">We collect and process:</p>
                    <ul className="space-y-1 list-disc list-inside text-gray-600">
                      <li>Name, school name, and academic subjects</li>
                      <li>Career interest and skills assessment results</li>
                      <li>University and career preferences</li>
                      <li>Counselor session notes (premium subscribers only)</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-900 mb-1">Your child's rights:</p>
                    <ul className="space-y-1 list-disc list-inside text-blue-700 text-xs">
                      <li>Their account and career data belong entirely to them</li>
                      <li>Data is encrypted and never sold to third parties</li>
                      <li>Can request full data deletion at any time</li>
                      <li>Protected under Kenya Data Protection Act 2019</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={() => handleDecision('accept')}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-base"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    I Give My Consent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDecision('decline')}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    I Do Not Consent
                  </Button>
                </div>
              </>
            )}

            {state === 'submitting' && (
              <div className="flex flex-col items-center py-8 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <p className="text-muted-foreground">Recording your decision...</p>
              </div>
            )}

            {state === 'accepted' && (
              <div className="flex flex-col items-center py-6 gap-4 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
                <div>
                  <p className="text-xl font-bold text-green-700">Consent Given</p>
                  <p className="text-muted-foreground mt-2">{message}</p>
                  {studentName && (
                    <p className="text-sm text-gray-600 mt-3">
                      <strong>{studentName}</strong> can now access Elimu Smart's career guidance tools.
                    </p>
                  )}
                </div>
                <Alert className="bg-green-50 border-green-200 text-left">
                  <AlertDescription className="text-green-800 text-xs">
                    You will receive payment receipts and important account notifications at this email address.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {state === 'declined' && (
              <div className="flex flex-col items-center py-6 gap-4 text-center">
                <XCircle className="h-16 w-16 text-red-500" />
                <div>
                  <p className="text-xl font-bold text-red-700">Consent Declined</p>
                  <p className="text-muted-foreground mt-2">{message}</p>
                </div>
                <Alert>
                  <AlertDescription className="text-xs">
                    If this was a mistake, please contact support@elimu-smart.co.ke and we can
                    send a new consent request.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {state === 'error' && (
              <div className="flex flex-col items-center py-6 gap-4 text-center">
                <AlertCircle className="h-16 w-16 text-orange-500" />
                <div>
                  <p className="text-xl font-bold">Link Invalid or Expired</p>
                  <p className="text-muted-foreground mt-2">
                    {message || 'This consent link is no longer valid.'}
                  </p>
                </div>
                <Alert>
                  <AlertDescription className="text-xs">
                    Ask your child to log in to Elimu Smart and send a new consent request,
                    or email us at support@elimu-smart.co.ke
                  </AlertDescription>
                </Alert>
              </div>
            )}

          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Elimu Smart · Nairobi, Kenya · support@elimu-smart.co.ke
        </p>
      </div>
    </div>
  );
}
