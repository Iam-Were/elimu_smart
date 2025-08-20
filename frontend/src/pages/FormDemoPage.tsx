import React from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';
import { SmartForm } from '../components/common/SmartForm';
import { notifications } from '@mantine/notifications';

export const FormDemoPage: React.FC = () => {
  const handleSubmit = async (data: Record<string, any>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    notifications.show({
      title: 'Form Submitted!',
      message: 'Your information has been successfully submitted.',
      color: 'green',
    });
    
    console.log('Form submitted:', data);
  };

  const handleSave = async (data: Record<string, any>) => {
    // Simulate auto-save
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Form auto-saved:', data);
  };

  const formSections = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic information about yourself',
      fields: [
        {
          id: 'firstName',
          type: 'text' as const,
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
          validation: [
            { type: 'required' as const, message: 'First name is required' },
            { type: 'minLength' as const, value: 2, message: 'First name must be at least 2 characters' }
          ],
          autoSuggest: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma']
        },
        {
          id: 'lastName',
          type: 'text' as const,
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
          validation: [
            { type: 'required' as const, message: 'Last name is required' },
            { type: 'minLength' as const, value: 2, message: 'Last name must be at least 2 characters' }
          ],
          autoSuggest: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia']
        },
        {
          id: 'email',
          type: 'email' as const,
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true,
          validation: [
            { type: 'required' as const, message: 'Email is required' },
            { type: 'email' as const, message: 'Please enter a valid email address' }
          ]
        },
        {
          id: 'phone',
          type: 'text' as const,
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          validation: [
            { type: 'pattern' as const, value: '^[\\+]?[1-9][\\d]{0,15}$', message: 'Please enter a valid phone number' }
          ]
        }
      ]
    },
    {
      id: 'academic',
      title: 'Academic Information',
      description: 'Your educational background',
      fields: [
        {
          id: 'education',
          type: 'select' as const,
          label: 'Education Level',
          placeholder: 'Select your education level',
          required: true,
          options: [
            { value: 'high_school', label: 'High School' },
            { value: 'associate', label: 'Associate Degree' },
            { value: 'bachelor', label: 'Bachelor\'s Degree' },
            { value: 'master', label: 'Master\'s Degree' },
            { value: 'phd', label: 'PhD' }
          ],
          validation: [
            { type: 'required' as const, message: 'Education level is required' }
          ]
        },
        {
          id: 'major',
          type: 'text' as const,
          label: 'Field of Study / Major',
          placeholder: 'Enter your field of study',
          conditional: (formData: any) => formData.education && formData.education !== 'high_school',
          autoSuggest: [
            'Computer Science', 'Engineering', 'Business Administration', 
            'Psychology', 'Biology', 'Mathematics', 'English Literature',
            'History', 'Physics', 'Chemistry'
          ]
        },
        {
          id: 'gpa',
          type: 'number' as const,
          label: 'GPA',
          placeholder: 'Enter your GPA',
          conditional: (formData: any) => formData.education && formData.education !== 'high_school',
          validation: [
            { type: 'custom' as const, validator: (value: any) => !value || (value >= 0 && value <= 4), message: 'GPA must be between 0 and 4' }
          ]
        },
        {
          id: 'skills',
          type: 'multiselect' as const,
          label: 'Skills',
          placeholder: 'Select your skills',
          options: [
            { value: 'programming', label: 'Programming' },
            { value: 'data_analysis', label: 'Data Analysis' },
            { value: 'project_management', label: 'Project Management' },
            { value: 'communication', label: 'Communication' },
            { value: 'leadership', label: 'Leadership' },
            { value: 'research', label: 'Research' },
            { value: 'writing', label: 'Writing' },
            { value: 'design', label: 'Design' }
          ]
        }
      ]
    },
    {
      id: 'preferences',
      title: 'Career Preferences',
      description: 'Tell us about your career interests',
      fields: [
        {
          id: 'careerGoals',
          type: 'textarea' as const,
          label: 'Career Goals',
          placeholder: 'Describe your career goals and aspirations...',
          description: 'Share your short-term and long-term career objectives'
        },
        {
          id: 'workEnvironment',
          type: 'select' as const,
          label: 'Preferred Work Environment',
          placeholder: 'Select your preference',
          options: [
            { value: 'office', label: 'Office Environment' },
            { value: 'remote', label: 'Remote Work' },
            { value: 'hybrid', label: 'Hybrid (Office + Remote)' },
            { value: 'field', label: 'Field Work' },
            { value: 'laboratory', label: 'Laboratory' },
            { value: 'outdoors', label: 'Outdoors' }
          ]
        },
        {
          id: 'salaryExpectation',
          type: 'number' as const,
          label: 'Salary Expectation (Annual)',
          placeholder: 'Enter expected salary',
          description: 'Optional: Your expected annual salary in USD'
        },
        {
          id: 'newsletter',
          type: 'checkbox' as const,
          label: 'Subscribe to Career Newsletter',
          description: 'Receive weekly career tips and opportunities'
        },
        {
          id: 'termsAccepted',
          type: 'checkbox' as const,
          label: 'I accept the terms and conditions',
          required: true,
          validation: [
            { type: 'custom' as const, validator: (value: any) => value === true, message: 'You must accept the terms and conditions' }
          ]
        }
      ]
    }
  ];

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="sm">
            Smart Form Demo
          </Title>
          <Text size="lg" c="dimmed">
            This is a demonstration of our advanced form component with intelligent validation, 
            auto-save functionality, conditional fields, and auto-suggestions.
          </Text>
        </div>

        <SmartForm
          sections={formSections}
          onSubmit={handleSubmit}
          onSave={handleSave}
          autoSave={true}
          showProgress={true}
          submitLabel="Submit Application"
          title="Career Assessment Form"
          description="Complete this form to help us understand your background and career preferences."
        />
      </Stack>
    </Container>
  );
};