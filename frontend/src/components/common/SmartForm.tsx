import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number | RegExp;
  message: string;
  validator?: (value: unknown) => boolean;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'multiselect' | 'number' | 'checkbox';
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: Array<{ value: string; label: string }>;
  dependencies?: string[]; // Field IDs this field depends on
  conditional?: (formData: Record<string, unknown>) => boolean;
  autoSuggest?: string[]; // Suggestions for the field
  defaultValue?: unknown;
}

interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditional?: (formData: Record<string, unknown>) => boolean;
}

interface SmartFormProps {
  sections: FormSection[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onSave?: (data: Record<string, unknown>) => Promise<void>; // Auto-save function
  autoSave?: boolean;
  showProgress?: boolean;
  submitLabel?: string;
  title?: string;
  description?: string;
}

export const SmartForm: React.FC<SmartFormProps> = ({
  sections,
  onSubmit,
  onSave,
  autoSave = true,
  showProgress = true,
  submitLabel = 'Submit',
  title,
  description,
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, unknown> = {};
    sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        }
      });
    });
    setFormData(initialData);
  }, [sections]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onSave) return;

    const saveTimer = setTimeout(async () => {
      if (Object.keys(formData).length > 0 && autoSaveStatus !== 'saving') {
        setAutoSaveStatus('saving');
        try {
          await onSave(formData);
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        } catch {
          setAutoSaveStatus('error');
          setTimeout(() => setAutoSaveStatus('idle'), 3000);
        }
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [formData, autoSave, onSave, autoSaveStatus]);

  // Validation function
  const validateField = useCallback((field: FormField, value: unknown): string | null => {
    if (!field.validation) return null;

    for (const rule of field.validation) {
      switch (rule.type) {
        case 'required':
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return rule.message;
          }
          break;
        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (value && typeof value === 'string' && !emailRegex.test(value)) {
            return rule.message;
          }
          break;
        }
        case 'minLength':
          if (value && typeof value === 'string' && rule.value && typeof rule.value === 'number' && value.length < rule.value) {
            return rule.message;
          }
          break;
        case 'maxLength':
          if (value && typeof value === 'string' && rule.value && typeof rule.value === 'number' && value.length > rule.value) {
            return rule.message;
          }
          break;
        case 'pattern':
          if (value && typeof value === 'string' && rule.value && (typeof rule.value === 'string' || rule.value instanceof RegExp) && !new RegExp(rule.value).test(value)) {
            return rule.message;
          }
          break;
        case 'custom':
          if (rule.validator && !rule.validator(value)) {
            return rule.message;
          }
          break;
      }
    }
    return null;
  }, []);

  const handleFieldChange = useCallback((fieldId: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
    
    // Update suggestions
    const field = sections.flatMap(s => s.fields).find(f => f.id === fieldId);
    if (field?.autoSuggest && typeof value === 'string') {
      const filteredSuggestions = field.autoSuggest.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase()) && suggestion !== value
      );
      setSuggestions(prev => ({ ...prev, [fieldId]: filteredSuggestions }));
    }
  }, [errors, sections]);

  const handleFieldBlur = useCallback((fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    
    const field = sections.flatMap(s => s.fields).find(f => f.id === fieldId);
    if (field) {
      const value = formData[fieldId];
      const error = validateField(field, value);
      if (error) {
        setErrors(prev => ({ ...prev, [fieldId]: error }));
      }
    }
    
    // Clear suggestions
    setSuggestions(prev => ({ ...prev, [fieldId]: [] }));
  }, [formData, sections, validateField]);

  // Calculate form completion progress
  const calculateProgress = useCallback(() => {
    const visibleFields = sections.flatMap(section => {
      if (section.conditional && !section.conditional(formData)) return [];
      return section.fields.filter(field => !field.conditional || field.conditional(formData));
    });
    
    const completedFields = visibleFields.filter(field => {
      const value = formData[field.id];
      if (field.required) {
        return value !== undefined && value !== '' && value !== false;
      }
      return value !== undefined && value !== '';
    });
    
    return visibleFields.length > 0 ? Math.round((completedFields.length / visibleFields.length) * 100) : 0;
  }, [sections, formData]);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    let hasErrors = false;
    const newErrors: Record<string, string> = {};
    
    sections.forEach(section => {
      if (section.conditional && !section.conditional(formData)) return;
      
      section.fields.forEach(field => {
        if (field.conditional && !field.conditional(formData)) return;
        
        const value = formData[field.id];
        const error = validateField(field, value);
        if (error) {
          newErrors[field.id] = error;
          hasErrors = true;
        }
      });
    });
    
    setErrors(newErrors);
    
    if (hasErrors) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form field
  const renderField = (field: FormField) => {
    const getValue = () => {
      const storedValue = formData[field.id];
      if (storedValue !== undefined) return storedValue;
      
      // Return appropriate default values based on field type
      switch (field.type) {
        case 'multiselect':
          return [];
        case 'checkbox':
          return false;
        case 'number':
          return undefined;
        default:
          return '';
      }
    };
    
    const value = getValue();
    const error = errors[field.id];
    const isTouched = touched[field.id];
    const fieldSuggestions = suggestions[field.id] || [];

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(field.required && "after:content-['*'] after:text-red-500 after:ml-1")}>
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={value as string}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                onBlur={() => handleFieldBlur(field.id)}
                className={cn(
                  error && isTouched && "border-red-500",
                  !error && isTouched && value && "border-green-500"
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isTouched && !error && value ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : isTouched && error ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : null}
              </div>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {isTouched && error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            
            {/* Auto-suggestions */}
            {fieldSuggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-40 overflow-auto">
                <CardContent className="p-0">
                  {fieldSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 cursor-pointer hover:bg-muted rounded-sm"
                      onClick={() => {
                        handleFieldChange(field.id, suggestion);
                        setSuggestions(prev => ({ ...prev, [field.id]: [] }));
                      }}
                    >
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'password':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(field.required && "after:content-['*'] after:text-red-500 after:ml-1")}>
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={field.id}
                type={showPassword[field.id] ? 'text' : 'password'}
                placeholder={field.placeholder}
                value={value as string}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                onBlur={() => handleFieldBlur(field.id)}
                className={cn(
                  error && isTouched && "border-red-500",
                  !error && isTouched && value && "border-green-500"
                )}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(prev => ({ ...prev, [field.id]: !prev[field.id] }))}
              >
                {showPassword[field.id] ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {isTouched && error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(field.required && "after:content-['*'] after:text-red-500 after:ml-1")}>
              {field.label}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onBlur={() => handleFieldBlur(field.id)}
              className={cn(
                "min-h-[100px]",
                error && isTouched && "border-red-500",
                !error && isTouched && value && "border-green-500"
              )}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {isTouched && error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(field.required && "after:content-['*'] after:text-red-500 after:ml-1")}>
              {field.label}
            </Label>
            <Select
              value={value as string}
              onValueChange={(val) => handleFieldChange(field.id, val)}
            >
              <SelectTrigger
                className={cn(
                  error && isTouched && "border-red-500",
                  !error && isTouched && value && "border-green-500"
                )}
              >
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {isTouched && error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={cn(field.required && "after:content-['*'] after:text-red-500 after:ml-1")}>
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value ? Number(e.target.value) : undefined)}
              onBlur={() => handleFieldBlur(field.id)}
              className={cn(
                error && isTouched && "border-red-500",
                !error && isTouched && value !== undefined && "border-green-500"
              )}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {isTouched && error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.id}
                checked={value as boolean}
                onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                onBlur={() => handleFieldBlur(field.id)}
              />
              <Label htmlFor={field.id} className={cn("text-sm", field.required && "after:content-['*'] after:text-red-500 after:ml-1")}>
                {field.label}
              </Label>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground pl-6">{field.description}</p>
            )}
            {isTouched && error && (
              <p className="text-sm text-red-500 pl-6">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const progress = calculateProgress();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      {(title || description) && (
        <div className="text-center space-y-2">
          {title && <h1 className="text-3xl font-bold">{title}</h1>}
          {description && <p className="text-muted-foreground text-lg">{description}</p>}
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Form Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Auto-save status */}
      {autoSave && onSave && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {autoSaveStatus === 'saving' && (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {autoSaveStatus === 'saved' && (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-green-600">Saved</span>
            </>
          )}
          {autoSaveStatus === 'error' && (
            <>
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-red-600">Save failed</span>
            </>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {sections.map(section => {
          // Check section visibility
          if (section.conditional && !section.conditional(formData)) return null;

          return (
            <Card key={section.id}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.description && (
                  <p className="text-muted-foreground">{section.description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {section.fields.map(field => {
                  // Check field visibility
                  if (field.conditional && !field.conditional(formData)) return null;
                  return renderField(field);
                })}
              </CardContent>
            </Card>
          );
        })}

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SmartForm;