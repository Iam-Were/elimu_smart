import React, { useState, useCallback, useEffect } from 'react';
import {
  Stack,
  Group,
  Text,
  TextInput,
  Textarea,
  Select,
  Button,
  Progress,
  Card,
  Alert,
  Checkbox,
  MultiSelect,
  NumberInput,
  Badge,
  ActionIcon,
} from '@mantine/core';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';

interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
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
  conditional?: (formData: Record<string, any>) => boolean;
  autoSuggest?: string[]; // Suggestions for the field
  defaultValue?: any;
}

interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditional?: (formData: Record<string, any>) => boolean;
}

interface SmartFormProps {
  sections: FormSection[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onSave?: (data: Record<string, any>) => Promise<void>; // Auto-save function
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
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {};
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
  const validateField = useCallback((field: FormField, value: any): string | null => {
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
          if (value && !emailRegex.test(value)) {
            return rule.message;
          }
          break;
        }
        case 'minLength':
          if (value && value.length < rule.value) {
            return rule.message;
          }
          break;
        case 'maxLength':
          if (value && value.length > rule.value) {
            return rule.message;
          }
          break;
        case 'pattern':
          if (value && !new RegExp(rule.value).test(value)) {
            return rule.message;
          }
          break;
        case 'custom':
          if (value && rule.validator && !rule.validator(value)) {
            return rule.message;
          }
          break;
      }
    }
    return null;
  }, []);

  // Handle field change
  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Find the field definition
    const field = sections
      .flatMap(section => section.fields)
      .find(f => f.id === fieldId);
    
    if (field && touched[fieldId]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [fieldId]: error || '' }));
    }

    // Generate suggestions for text fields
    if (field?.autoSuggest && typeof value === 'string' && value.length > 2) {
      const filteredSuggestions = field.autoSuggest.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(prev => ({ ...prev, [fieldId]: filteredSuggestions }));
    } else {
      setSuggestions(prev => ({ ...prev, [fieldId]: [] }));
    }
  }, [sections, touched, validateField]);

  // Handle field blur
  const handleFieldBlur = useCallback((fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    
    const field = sections
      .flatMap(section => section.fields)
      .find(f => f.id === fieldId);
    
    if (field) {
      const error = validateField(field, formData[fieldId]);
      setErrors(prev => ({ ...prev, [fieldId]: error || '' }));
    }
  }, [sections, formData, validateField]);

  // Calculate form completion
  const calculateProgress = (): number => {
    const visibleFields = sections
      .filter(section => !section.conditional || section.conditional(formData))
      .flatMap(section => 
        section.fields.filter(field => !field.conditional || field.conditional(formData))
      );
    
    const completedFields = visibleFields.filter(field => {
      const value = formData[field.id];
      return value !== undefined && value !== '' && value !== null;
    });

    return visibleFields.length > 0 ? (completedFields.length / visibleFields.length) * 100 : 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all visible fields
    const visibleFields = sections
      .filter(section => !section.conditional || section.conditional(formData))
      .flatMap(section => 
        section.fields.filter(field => !field.conditional || field.conditional(formData))
      );

    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    visibleFields.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(
      visibleFields.reduce((acc, field) => ({ ...acc, [field.id]: true }), {})
    );

    if (!hasErrors) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Render form field
  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    const isTouched = touched[field.id];
    const fieldSuggestions = suggestions[field.id] || [];

    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      description: field.description,
      error: isTouched && error ? error : undefined,
      required: field.required,
      value,
      onChange: (val: any) => handleFieldChange(field.id, val),
      onBlur: () => handleFieldBlur(field.id),
      style: { marginBottom: '1rem' },
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div key={field.id} style={{ position: 'relative' }}>
            <TextInput
              {...commonProps}
              type={field.type}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              rightSection={
                isTouched && !error ? (
                  <CheckCircledIcon width={16} height={16} style={{ color: 'var(--success)' }} />
                ) : isTouched && error ? (
                  <ExclamationTriangleIcon width={16} height={16} style={{ color: 'var(--destructive)' }} />
                ) : null
              }
            />
            
            {/* Auto-suggestions */}
            {fieldSuggestions.length > 0 && (
              <Card
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  marginTop: '4px',
                  maxHeight: '150px',
                  overflow: 'auto',
                }}
              >
                <Stack gap="xs">
                  {fieldSuggestions.map((suggestion, index) => (
                    <Text
                      key={index}
                      size="sm"
                      style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                      onClick={() => {
                        handleFieldChange(field.id, suggestion);
                        setSuggestions(prev => ({ ...prev, [field.id]: [] }));
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sidebar-accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {suggestion}
                    </Text>
                  ))}
                </Stack>
              </Card>
            )}
          </div>
        );

      case 'password':
        return (
          <TextInput
            key={field.id}
            {...commonProps}
            type={showPassword[field.id] ? 'text' : 'password'}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            rightSection={
              <Group gap="xs">
                <ActionIcon
                  variant="subtle"
                  onClick={() => setShowPassword(prev => ({
                    ...prev,
                    [field.id]: !prev[field.id]
                  }))}
                >
                  {showPassword[field.id] ? (
                    <EyeClosedIcon width={16} height={16} />
                  ) : (
                    <EyeOpenIcon width={16} height={16} />
                  )}
                </ActionIcon>
                {isTouched && !error && (
                  <CheckCircledIcon width={16} height={16} style={{ color: 'var(--success)' }} />
                )}
              </Group>
            }
          />
        );

      case 'textarea':
        return (
          <Textarea
            key={field.id}
            {...commonProps}
            autosize
            minRows={3}
            maxRows={6}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select
            key={field.id}
            {...commonProps}
            data={field.options || []}
            onChange={(val) => handleFieldChange(field.id, val)}
            clearable
            searchable
          />
        );

      case 'multiselect':
        return (
          <MultiSelect
            key={field.id}
            {...commonProps}
            data={field.options || []}
            onChange={(val) => handleFieldChange(field.id, val)}
            clearable
            searchable
          />
        );

      case 'number':
        return (
          <NumberInput
            key={field.id}
            {...commonProps}
            onChange={(val) => handleFieldChange(field.id, val)}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            key={field.id}
            label={field.label}
            description={field.description}
            checked={value}
            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
            error={isTouched && error ? error : undefined}
            style={{ marginBottom: '1rem' }}
          />
        );

      default:
        return null;
    }
  };

  const progress = calculateProgress();

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        {/* Form Header */}
        {(title || description) && (
          <div>
            {title && (
              <Text size="xl" fw={700} mb="xs">
                {title}
              </Text>
            )}
            {description && (
              <Text size="md" c="dimmed">
                {description}
              </Text>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && (
          <Card
            style={{
              backgroundColor: 'var(--muted)',
              padding: '16px',
            }}
          >
            <Group justify="space-between" align="center" mb="xs">
              <Text size="sm" fw={500}>
                Form Progress
              </Text>
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  {Math.round(progress)}% complete
                </Text>
                {autoSave && (
                  <Badge
                    size="sm"
                    variant="light"
                    color={
                      autoSaveStatus === 'saved' ? 'green' :
                      autoSaveStatus === 'saving' ? 'blue' :
                      autoSaveStatus === 'error' ? 'red' : 'gray'
                    }
                  >
                    {autoSaveStatus === 'saved' ? 'Saved' :
                     autoSaveStatus === 'saving' ? 'Saving...' :
                     autoSaveStatus === 'error' ? 'Save Error' : 'Draft'}
                  </Badge>
                )}
              </Group>
            </Group>
            <Progress value={progress} size="md" />
          </Card>
        )}

        {/* Form Sections */}
        {sections
          .filter(section => !section.conditional || section.conditional(formData))
          .map(section => (
            <Card
              key={section.id}
              className="card-linkedin dashboard-card"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <Stack gap="md">
                {/* Section Header */}
                <div>
                  <Text size="lg" fw={600} mb="xs">
                    {section.title}
                  </Text>
                  {section.description && (
                    <Text size="sm" c="dimmed">
                      {section.description}
                    </Text>
                  )}
                </div>

                {/* Section Fields */}
                <Stack gap="md">
                  {section.fields
                    .filter(field => !field.conditional || field.conditional(formData))
                    .map(renderField)}
                </Stack>
              </Stack>
            </Card>
          ))}

        {/* Form Actions */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            {autoSaveStatus === 'error' && (
              <Alert
                icon={<ExclamationTriangleIcon width={16} height={16} />}
                color="red"
                variant="light"
              >
                Auto-save failed. Please save manually.
              </Alert>
            )}
          </Group>

          <Group gap="sm">
            {onSave && (
              <Button
                variant="light"
                leftSection={<ReloadIcon width={16} height={16} />}
                onClick={() => onSave(formData)}
                loading={autoSaveStatus === 'saving'}
                className="btn-ghost-linkedin btn-md"
              >
                Save Draft
              </Button>
            )}
            
            <Button
              type="submit"
              loading={isSubmitting}
              className="btn-primary-linkedin btn-md"
              leftSection={<CheckCircledIcon width={16} height={16} />}
            >
              {submitLabel}
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
};