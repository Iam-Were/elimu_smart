import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Save,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCcw,
  Eye,
  EyeOff,
  HelpCircle,
  Shield,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'number' | 'select';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: (value: string) => string | null;
  options?: { value: string; label: string }[];
}

interface FormData {
  [key: string]: string;
}

interface SmartFormProps {
  title: string;
  description?: string;
  fields: FormField[];
  onSubmit: (data: FormData) => Promise<void>;
  onSaveDraft?: (data: FormData) => Promise<void>;
  initialData?: FormData;
  autoSaveInterval?: number; // milliseconds
  showPreview?: boolean;
  className?: string;
}

interface FormState {
  data: FormData;
  errors: { [key: string]: string };
  isDirty: boolean;
  isSubmitting: boolean;
  lastSaved: Date | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export const SmartForm: React.FC<SmartFormProps> = ({
  title,
  description,
  fields,
  onSubmit,
  onSaveDraft,
  initialData = {},
  autoSaveInterval = 30000, // 30 seconds
  showPreview = true,
  className,
}) => {
  const [formState, setFormState] = useState<FormState>({
    data: initialData,
    errors: {},
    isDirty: false,
    isSubmitting: false,
    lastSaved: initialData && Object.keys(initialData).length > 0 ? new Date() : null,
    saveStatus: 'idle',
  });

  const [showPreviewMode, setShowPreviewMode] = useState(false);
  const [recoveryData, setRecoveryData] = useState<FormData | null>(null);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!formState.isDirty || !onSaveDraft || formState.saveStatus === 'saving') {
      return;
    }

    try {
      setFormState(prev => ({ ...prev, saveStatus: 'saving' }));
      await onSaveDraft(formState.data);
      setFormState(prev => ({ 
        ...prev, 
        saveStatus: 'saved', 
        lastSaved: new Date(),
        isDirty: false 
      }));
      
      // Store in localStorage as backup
      localStorage.setItem(`form_draft_${title}`, JSON.stringify({
        data: formState.data,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      setFormState(prev => ({ ...prev, saveStatus: 'error' }));
      console.error('Auto-save failed:', error);
    }
  }, [formState.isDirty, formState.data, formState.saveStatus, onSaveDraft, title]);

  // Set up auto-save interval
  useEffect(() => {
    const interval = setInterval(autoSave, autoSaveInterval);
    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval]);

  // Check for recovery data on mount
  useEffect(() => {
    const recoveryKey = `form_draft_${title}`;
    const stored = localStorage.getItem(recoveryKey);
    
    if (stored) {
      try {
        const { data, timestamp } = JSON.parse(stored);
        const recoveryTime = new Date(timestamp);
        const hoursSince = (Date.now() - recoveryTime.getTime()) / (1000 * 60 * 60);
        
        // Offer recovery if data is less than 24 hours old and different from initial
        if (hoursSince < 24 && JSON.stringify(data) !== JSON.stringify(initialData)) {
          setRecoveryData(data);
        }
      } catch (error) {
        console.error('Failed to parse recovery data:', error);
      }
    }
  }, [title, initialData]);

  const updateField = (fieldId: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [fieldId]: value },
      isDirty: true,
      errors: { ...prev.errors, [fieldId]: '' }, // Clear error on change
    }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formState.data[field.id] || '';
      
      // Required field validation
      if (field.required && !value.trim()) {
        errors[field.id] = `${field.label} is required`;
        isValid = false;
      }
      
      // Custom validation
      if (value && field.validation) {
        const validationError = field.validation(value);
        if (validationError) {
          errors[field.id] = validationError;
          isValid = false;
        }
      }
    });

    setFormState(prev => ({ ...prev, errors }));
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isSubmitting: true }));
      await onSubmit(formState.data);
      
      // Clear recovery data on successful submission
      localStorage.removeItem(`form_draft_${title}`);
      
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        isDirty: false,
        saveStatus: 'saved'
      }));
    } catch (error) {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
      console.error('Form submission failed:', error);
    }
  };

  const restoreFromRecovery = () => {
    if (recoveryData) {
      setFormState(prev => ({
        ...prev,
        data: recoveryData,
        isDirty: true,
      }));
      setRecoveryData(null);
    }
  };

  const dismissRecovery = () => {
    localStorage.removeItem(`form_draft_${title}`);
    setRecoveryData(null);
  };

  const getSaveStatusIcon = () => {
    switch (formState.saveStatus) {
      case 'saving':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'saved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Save className="h-4 w-4" />;
    }
  };

  const getSaveStatusText = () => {
    switch (formState.saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return formState.lastSaved ? `Saved ${formatRelativeTime(formState.lastSaved)}` : 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return formState.isDirty ? 'Unsaved changes' : 'Up to date';
    }
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const renderField = (field: FormField) => {
    const value = formState.data[field.id] || '';
    const error = formState.errors[field.id];
    const hasError = Boolean(error);

    const baseInputClasses = cn(
      "transition-colors",
      hasError ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-orange-500"
    );

    return (
      <div key={field.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={field.id} className={cn(hasError && "text-red-700")}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {field.helpText && (
            <div className="group relative">
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              <div className="absolute right-0 top-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded max-w-xs z-10">
                {field.helpText}
              </div>
            </div>
          )}
        </div>

        {field.type === 'textarea' ? (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={baseInputClasses}
            rows={4}
          />
        ) : field.type === 'select' ? (
          <select
            id={field.id}
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={cn("flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm", baseInputClasses)}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className={baseInputClasses}
          />
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Recovery Banner */}
      {recoveryData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <RefreshCcw className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Recovery Available</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    We found unsaved progress from a previous session. Would you like to restore it?
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" onClick={restoreFromRecovery}>
                  Restore
                </Button>
                <Button size="sm" variant="secondary" onClick={dismissRecovery}>
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {title}
                {formState.isDirty && (
                  <Badge variant="secondary" className="text-xs">
                    Modified
                  </Badge>
                )}
              </CardTitle>
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            
            {/* Save Status */}
            <div className="flex items-center gap-4 text-sm">
              {onSaveDraft && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getSaveStatusIcon()}
                  {getSaveStatusText()}
                </div>
              )}
              
              {showPreview && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPreviewMode(!showPreviewMode)}
                >
                  {showPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showPreviewMode ? 'Edit' : 'Preview'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {showPreviewMode ? (
            /* Preview Mode */
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Eye className="h-4 w-4" />
                Preview mode - Review your responses before submitting
              </div>
              
              {fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="font-medium">{field.label}</Label>
                  <div className="p-3 bg-muted rounded-md min-h-[2.5rem] flex items-center">
                    {formState.data[field.id] || <span className="text-muted-foreground italic">No response</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Edit Mode */
            <div className="space-y-6">
              {fields.map(renderField)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          Your responses are saved securely and can be recovered if needed
        </div>
        
        <div className="flex gap-3">
          {onSaveDraft && formState.isDirty && (
            <Button variant="secondary" onClick={autoSave} disabled={formState.saveStatus === 'saving'}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={formState.isSubmitting || (showPreviewMode && Object.keys(formState.errors).length > 0)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          >
            {formState.isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Submit
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Progress (if multiple sections) */}
      {fields.length > 5 && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completion Progress</span>
              <span className="text-sm text-muted-foreground">
                {Object.values(formState.data).filter(Boolean).length} of {fields.length} fields completed
              </span>
            </div>
            <Progress 
              value={(Object.values(formState.data).filter(Boolean).length / fields.length) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartForm;