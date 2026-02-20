import { useState } from 'react';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, ChevronLeft, Info, Users } from 'lucide-react';

interface StepParentGuardianProps {
  initialData: {
    parentName?: string;
    parentEmail?: string;
    parentPhone?: string;
    parentRelationship?: string;
  };
  onNext: (data: {
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    parentRelationship: string;
  }) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function StepParentGuardian({ initialData, onNext, onBack, onSkip }: StepParentGuardianProps) {
  const [parentName, setParentName] = useState(initialData.parentName || '');
  const [parentEmail, setParentEmail] = useState(initialData.parentEmail || '');
  const [parentPhone, setParentPhone] = useState(initialData.parentPhone || '');
  const [parentRelationship, setParentRelationship] = useState(initialData.parentRelationship || '');

  const isValid = parentName.trim().length >= 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)
    && /^(0|254|\+254)[17]\d{8}$/.test(parentPhone.replace(/\s/g, ''))
    && parentRelationship !== '';

  const handleNext = () => {
    if (!isValid) return;
    onNext({ parentName, parentEmail, parentPhone, parentRelationship });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parent / Guardian Details</h2>
          <p className="text-gray-500 mt-1">
            Required for account verification and premium access
          </p>
        </div>
      </div>

      {/* Why we need this */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 text-sm">
          Kenyan law (Data Protection Act 2019) requires parent or guardian consent before a minor's
          data can be processed. Your parent will receive a consent request and can approve via email.
          Your account and career data always belong to <strong>you</strong>.
        </AlertDescription>
      </Alert>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="parentName">Full Name *</Label>
            <Input
              id="parentName"
              placeholder="e.g. Jane Wanjiku"
              value={parentName}
              onChange={e => setParentName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="relationship">Relationship *</Label>
            <Select value={parentRelationship} onValueChange={setParentRelationship}>
              <SelectTrigger id="relationship">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="sibling">Older Sibling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentEmail">Email Address *</Label>
          <Input
            id="parentEmail"
            type="email"
            placeholder="parent@example.com"
            value={parentEmail}
            onChange={e => setParentEmail(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Consent request and invoice receipts will be sent here
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parentPhone">M-Pesa Phone Number *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              🇰🇪
            </span>
            <Input
              id="parentPhone"
              type="tel"
              placeholder="0712 345 678"
              value={parentPhone}
              onChange={e => setParentPhone(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Premium subscription payments will be sent to this number
          </p>
        </div>
      </div>

      {/* Privacy note */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Shield className="h-3 w-3 mt-0.5 shrink-0" />
        <span>
          Your parent's contact details are encrypted and never shared with third parties.
          They will only receive consent requests and payment receipts from Elimu Smart.
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onSkip} className="text-muted-foreground">
            Skip for now
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="bg-orange-600 hover:bg-orange-700 min-w-[100px]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
