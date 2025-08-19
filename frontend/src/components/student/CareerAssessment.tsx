import React, { useState } from 'react';
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Progress,
  Radio,
  Slider,
  Alert,
  Badge,
  Divider,
  SimpleGrid,
} from '@mantine/core';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircledIcon,
  ReloadIcon,
  TargetIcon,
} from '@radix-ui/react-icons';
import { notifications } from '@mantine/notifications';

interface AssessmentQuestion {
  id: string;
  type: 'interests' | 'skills' | 'personality' | 'values';
  category: string;
  question: string;
  scale: 'agreement' | 'rating' | 'preference';
  options?: string[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  // Interest Assessment (RIASEC Model)
  {
    id: 'i1',
    type: 'interests',
    category: 'Realistic',
    question: 'I enjoy working with my hands to build or repair things',
    scale: 'agreement'
  },
  {
    id: 'i2',
    type: 'interests',
    category: 'Investigative',
    question: 'I like solving complex problems and conducting research',
    scale: 'agreement'
  },
  {
    id: 'i3',
    type: 'interests',
    category: 'Artistic',
    question: 'I enjoy creative activities like art, music, or writing',
    scale: 'agreement'
  },
  {
    id: 'i4',
    type: 'interests',
    category: 'Social',
    question: 'I like helping and teaching other people',
    scale: 'agreement'
  },
  {
    id: 'i5',
    type: 'interests',
    category: 'Enterprising',
    question: 'I enjoy leading teams and making business decisions',
    scale: 'agreement'
  },
  {
    id: 'i6',
    type: 'interests',
    category: 'Conventional',
    question: 'I prefer organized, systematic work with clear procedures',
    scale: 'agreement'
  },

  // Skills Assessment
  {
    id: 's1',
    type: 'skills',
    category: 'Academic',
    question: 'How would you rate your mathematical skills?',
    scale: 'rating'
  },
  {
    id: 's2',
    type: 'skills',
    category: 'Technical',
    question: 'How comfortable are you with computer technology?',
    scale: 'rating'
  },
  {
    id: 's3',
    type: 'skills',
    category: 'Social',
    question: 'How would you rate your communication skills?',
    scale: 'rating'
  },
  {
    id: 's4',
    type: 'skills',
    category: 'Creative',
    question: 'How would you rate your creative problem-solving abilities?',
    scale: 'rating'
  },

  // Personality Assessment (RIASEC)
  {
    id: 'p1',
    type: 'personality',
    category: 'Work Style',
    question: 'I prefer working independently rather than in teams',
    scale: 'agreement'
  },
  {
    id: 'p2',
    type: 'personality',
    category: 'Work Environment',
    question: 'I thrive in fast-paced, dynamic environments',
    scale: 'agreement'
  },

  // Values Assessment
  {
    id: 'v1',
    type: 'values',
    category: 'Work Values',
    question: 'How important is job security to you?',
    scale: 'rating'
  },
  {
    id: 'v2',
    type: 'values',
    category: 'Work Values',
    question: 'How important is helping others through your work?',
    scale: 'rating'
  },
];

interface AssessmentResponse {
  questionId: string;
  value: number;
}

export const CareerAssessment: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<number | null>(null);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  const handleResponse = (value: number) => {
    setCurrentResponse(value);
  };

  const handleNext = () => {
    if (currentResponse === null) {
      notifications.show({
        title: 'Please provide an answer',
        message: 'Select a response before continuing',
        color: 'orange',
      });
      return;
    }

    // Save response
    const newResponse: AssessmentResponse = {
      questionId: currentQuestion.id,
      value: currentResponse,
    };

    setResponses(prev => [...prev.filter(r => r.questionId !== currentQuestion.id), newResponse]);

    // Move to next question or complete
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentResponse(null);
    } else {
      setIsCompleted(true);
      notifications.show({
        title: 'Assessment Complete!',
        message: 'Your career recommendations are being generated',
        color: 'green',
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Load previous response if it exists
      const prevResponse = responses.find(r => r.questionId === assessmentQuestions[currentQuestionIndex - 1].id);
      setCurrentResponse(prevResponse?.value || null);
    }
  };

  const renderQuestionInput = () => {
    switch (currentQuestion.scale) {
      case 'agreement':
        return (
          <Radio.Group value={currentResponse?.toString() || ''} onChange={(value) => handleResponse(parseInt(value))}>
            <Stack gap="sm" mt="md">
              <Radio value="1" label="Strongly Disagree" />
              <Radio value="2" label="Disagree" />
              <Radio value="3" label="Neutral" />
              <Radio value="4" label="Agree" />
              <Radio value="5" label="Strongly Agree" />
            </Stack>
          </Radio.Group>
        );
      case 'rating':
        return (
          <Stack gap="md" mt="md">
            <Slider
              value={currentResponse || 1}
              onChange={handleResponse}
              min={1}
              max={5}
              step={1}
              marks={[
                { value: 1, label: 'Beginner' },
                { value: 2, label: 'Basic' },
                { value: 3, label: 'Good' },
                { value: 4, label: 'Advanced' },
                { value: 5, label: 'Expert' },
              ]}
              size="lg"
              color="orange"
            />
            <Text size="sm" c="dimmed" ta="center">
              Current rating: {currentResponse || 1}/5
            </Text>
          </Stack>
        );
      default:
        return null;
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, number[]> = {};
    
    responses.forEach(response => {
      const question = assessmentQuestions.find(q => q.id === response.questionId);
      if (question) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = [];
        }
        categoryScores[question.category].push(response.value);
      }
    });

    const averages = Object.entries(categoryScores).map(([category, scores]) => ({
      category,
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      count: scores.length,
    })).sort((a, b) => b.average - a.average);

    return averages;
  };

  if (isCompleted) {
    const results = calculateResults();

    return (
      <Container size="md" py="xl">
        <Card shadow="sm" padding="xl" radius="md">
          <Stack gap="lg">
            <Group justify="center">
              <Badge size="xl" color="green" variant="light" leftSection={<CheckCircledIcon />}>
                Assessment Complete! 
              </Badge>
            </Group>

            <Title order={2} ta="center">Your Career Assessment Results</Title>

            <Text c="dimmed" ta="center">
              Based on your responses, here are your strongest areas:
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {results.slice(0, 6).map((result, index) => (
                <Card key={result.category} shadow="xs" padding="md" radius="sm" withBorder>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text fw={500} size="sm">{result.category}</Text>
                      <Badge size="sm" color="orange" variant="light">
                        #{index + 1}
                      </Badge>
                    </Group>
                    <Progress 
                      value={(result.average / 5) * 100} 
                      color="orange"
                      size="sm"
                    />
                    <Text size="xs" c="dimmed">
                      Score: {result.average.toFixed(1)}/5.0
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>

            <Alert color="blue" variant="light">
              <Stack gap="xs">
                <Text fw={500}>What's Next?</Text>
                <Text size="sm">
                  Your results suggest careers in: <strong>{results.slice(0, 3).map(r => r.category).join(', ')}</strong>
                </Text>
                <Text size="sm">
                  Visit your dashboard to see personalized career recommendations based on these results.
                </Text>
              </Stack>
            </Alert>

            <Group justify="center">
              <Button 
                size="md" 
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
                leftSection={<ReloadIcon />}
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentQuestionIndex(0);
                  setResponses([]);
                  setCurrentResponse(null);
                }}
              >
                Take Assessment Again
              </Button>
              <Button variant="light" size="md" leftSection={<TargetIcon />}>
                View Career Matches
              </Button>
            </Group>
          </Stack>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Card shadow="sm" padding="xl" radius="md">
        <Stack gap="lg">
          {/* Header */}
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs">
                <Title order={2}>Career Assessment</Title>
                <Text c="dimmed">
                  Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
                </Text>
              </Stack>
              <Badge size="lg" color="orange" variant="light">
                {currentQuestion.type.charAt(0).toUpperCase() + currentQuestion.type.slice(1)}
              </Badge>
            </Group>
            
            <Progress value={progress} color="orange" size="md" />
          </Stack>

          <Divider />

          {/* Question */}
          <Stack gap="md">
            <Badge size="md" color="gray" variant="light">
              {currentQuestion.category}
            </Badge>
            
            <Title order={3} fw={400}>
              {currentQuestion.question}
            </Title>

            {renderQuestionInput()}
          </Stack>

          <Divider />

          {/* Navigation */}
          <Group justify="space-between">
            <Button
              variant="subtle"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevious}
              leftSection={<ArrowLeftIcon />}
            >
              Previous
            </Button>

            <Text size="sm" c="dimmed">
              {Math.round(progress)}% Complete
            </Text>

            <Button
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              }}
              onClick={handleNext}
              disabled={currentResponse === null}
              rightSection={currentQuestionIndex === assessmentQuestions.length - 1 ? <CheckCircledIcon /> : <ArrowRightIcon />}
            >
              {currentQuestionIndex === assessmentQuestions.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
};