import React, { useState } from 'react';
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  SimpleGrid,
  Alert,
  Progress,
  Divider,
  Tabs,
  ScrollArea,
} from '@mantine/core';
import {
  BookOpenIcon,
  TargetIcon,
  CheckIcon,
  CrossCircledIcon,
  StarIcon,
  TrendingUpIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { notifications } from '@mantine/notifications';

interface Subject {
  id: string;
  name: string;
  category: 'core' | 'science' | 'language' | 'humanity' | 'technical';
  required?: boolean;
}

interface Career {
  id: string;
  title: string;
  description: string;
  matchPercentage: number;
  requirements: {
    subjects: string[];
    minGrades: Record<string, string>;
  };
  prospects: {
    salaryRange: [number, number];
    jobGrowth: number;
    demand: 'High' | 'Medium' | 'Low';
  };
  universities: string[];
  kuccpsCluster: string;
  pathways: string[];
}

// Kenya KCSE subjects
const availableSubjects: Subject[] = [
  // Core subjects (mandatory)
  { id: 'english', name: 'English', category: 'core', required: true },
  { id: 'kiswahili', name: 'Kiswahili', category: 'core', required: true },
  { id: 'mathematics', name: 'Mathematics', category: 'core', required: true },

  // Sciences
  { id: 'biology', name: 'Biology', category: 'science' },
  { id: 'chemistry', name: 'Chemistry', category: 'science' },
  { id: 'physics', name: 'Physics', category: 'science' },

  // Languages
  { id: 'french', name: 'French', category: 'language' },
  { id: 'german', name: 'German', category: 'language' },
  { id: 'arabic', name: 'Arabic', category: 'language' },

  // Humanities
  { id: 'history', name: 'History & Government', category: 'humanity' },
  { id: 'geography', name: 'Geography', category: 'humanity' },
  { id: 'cre', name: 'Christian Religious Education', category: 'humanity' },
  { id: 'business', name: 'Business Studies', category: 'humanity' },

  // Technical
  { id: 'computer', name: 'Computer Studies', category: 'technical' },
  { id: 'agriculture', name: 'Agriculture', category: 'technical' },
  { id: 'home_science', name: 'Home Science', category: 'technical' },
];

// Mock career data with Kenyan context
const careerDatabase: Career[] = [
  {
    id: 'medicine',
    title: 'Medical Doctor',
    description: 'Diagnose and treat illnesses, injuries, and other health conditions.',
    matchPercentage: 95,
    requirements: {
      subjects: ['biology', 'chemistry', 'physics', 'mathematics'],
      minGrades: { biology: 'A-', chemistry: 'A-', physics: 'B+', mathematics: 'B+' }
    },
    prospects: {
      salaryRange: [150000, 800000],
      jobGrowth: 15,
      demand: 'High'
    },
    universities: ['University of Nairobi', 'Moi University', 'JKUAT', 'KU'],
    kuccpsCluster: 'Cluster 1',
    pathways: ['Medical School → Internship → Specialization → Practice']
  },
  {
    id: 'engineering',
    title: 'Engineering',
    description: 'Design, build, and maintain structures, machines, and systems.',
    matchPercentage: 88,
    requirements: {
      subjects: ['mathematics', 'physics', 'chemistry'],
      minGrades: { mathematics: 'A-', physics: 'B+', chemistry: 'B+' }
    },
    prospects: {
      salaryRange: [80000, 300000],
      jobGrowth: 12,
      demand: 'High'
    },
    universities: ['University of Nairobi', 'JKUAT', 'Moi University', 'TU-K'],
    kuccpsCluster: 'Cluster 2',
    pathways: ['Engineering Degree → Professional Training → Licensure → Practice']
  },
  {
    id: 'computer_science',
    title: 'Computer Science & IT',
    description: 'Develop software, manage systems, and solve computational problems.',
    matchPercentage: 92,
    requirements: {
      subjects: ['mathematics', 'physics', 'computer'],
      minGrades: { mathematics: 'B+', physics: 'B', computer: 'A-' }
    },
    prospects: {
      salaryRange: [60000, 400000],
      jobGrowth: 25,
      demand: 'High'
    },
    universities: ['University of Nairobi', 'JKUAT', 'Strathmore', 'KCA University'],
    kuccpsCluster: 'Cluster 2',
    pathways: ['CS Degree → Internship → Junior Developer → Senior → Lead']
  },
  {
    id: 'business',
    title: 'Business & Management',
    description: 'Lead organizations, manage resources, and drive business growth.',
    matchPercentage: 75,
    requirements: {
      subjects: ['mathematics', 'business', 'english'],
      minGrades: { mathematics: 'B', business: 'B+', english: 'B+' }
    },
    prospects: {
      salaryRange: [50000, 500000],
      jobGrowth: 8,
      demand: 'Medium'
    },
    universities: ['University of Nairobi', 'Strathmore', 'USIU', 'KU'],
    kuccpsCluster: 'Cluster 3',
    pathways: ['Business Degree → Entry Level → Management → Executive']
  },
  {
    id: 'education',
    title: 'Education & Teaching',
    description: 'Educate and inspire the next generation of learners.',
    matchPercentage: 82,
    requirements: {
      subjects: ['english', 'kiswahili', 'mathematics'],
      minGrades: { english: 'B+', kiswahili: 'B', mathematics: 'B' }
    },
    prospects: {
      salaryRange: [35000, 150000],
      jobGrowth: 5,
      demand: 'Medium'
    },
    universities: ['Kenyatta University', 'Moi University', 'Egerton University'],
    kuccpsCluster: 'Cluster 4',
    pathways: ['Education Degree → Teaching Practice → Teacher Registration → Career Growth']
  }
];

export const SubjectCareerMapper: React.FC = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['english', 'kiswahili', 'mathematics']); // Core subjects pre-selected
  const [activeTab, setActiveTab] = useState<string | null>('subjects');

  const toggleSubject = (subjectId: string) => {
    const subject = availableSubjects.find(s => s.id === subjectId);
    if (subject?.required) {
      notifications.show({
        title: 'Cannot remove core subject',
        message: `${subject.name} is a mandatory KCSE subject`,
        color: 'orange',
      });
      return;
    }

    setSelectedSubjects(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const getMatchingCareers = () => {
    return careerDatabase.map(career => {
      const requiredSubjects = career.requirements.subjects;
      const matchingSubjects = requiredSubjects.filter(req => selectedSubjects.includes(req));
      const matchPercentage = (matchingSubjects.length / requiredSubjects.length) * 100;
      
      return {
        ...career,
        matchPercentage: Math.round(matchPercentage),
        matchingSubjects,
        missingSubjects: requiredSubjects.filter(req => !selectedSubjects.includes(req))
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const getSubjectsByCategory = () => {
    const categories = {
      core: availableSubjects.filter(s => s.category === 'core'),
      science: availableSubjects.filter(s => s.category === 'science'),
      language: availableSubjects.filter(s => s.category === 'language'),
      humanity: availableSubjects.filter(s => s.category === 'humanity'),
      technical: availableSubjects.filter(s => s.category === 'technical'),
    };
    return categories;
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'green';
      case 'Medium': return 'yellow';
      case 'Low': return 'red';
      default: return 'gray';
    }
  };

  const formatSalary = (range: [number, number]) => {
    return `KSh ${(range[0] / 1000).toFixed(0)}K - ${(range[1] / 1000).toFixed(0)}K`;
  };

  const matchingCareers = getMatchingCareers();
  const subjectCategories = getSubjectsByCategory();

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Stack gap="sm">
          <Title order={1} size="2rem">Subject-to-Career Mapper</Title>
          <Text size="lg" c="dimmed">
            Discover career paths based on your KCSE subject combination
          </Text>
        </Stack>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="subjects" leftSection={<BookOpenIcon size={16} />}>
              Select Subjects
            </Tabs.Tab>
            <Tabs.Tab value="careers" leftSection={<TargetIcon size={16} />}>
              Career Matches ({matchingCareers.filter(c => c.matchPercentage > 0).length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="subjects" pt="lg">
            <Stack gap="lg">
              {/* Current Selection Summary */}
              <Alert color="blue" variant="light">
                <Group gap="xs">
                  <Text fw={500}>Selected Subjects ({selectedSubjects.length}):</Text>
                  {selectedSubjects.map(subjectId => {
                    const subject = availableSubjects.find(s => s.id === subjectId);
                    return (
                      <Badge 
                        key={subjectId} 
                        color={subject?.required ? 'orange' : 'blue'}
                        variant="light"
                      >
                        {subject?.name}
                      </Badge>
                    );
                  })}
                </Group>
              </Alert>

              {/* Subject Categories */}
              <Stack gap="md">
                {Object.entries(subjectCategories).map(([categoryName, subjects]) => (
                  <Card key={categoryName} shadow="sm" padding="lg" radius="md">
                    <Stack gap="md">
                      <Title order={4} style={{ color: 'var(--primary)' }}>
                        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Subjects
                        {categoryName === 'core' && <Badge size="sm" color="orange" ml="xs">Mandatory</Badge>}
                      </Title>
                      
                      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                        {subjects.map(subject => (
                          <Button
                            key={subject.id}
                            variant={selectedSubjects.includes(subject.id) ? "filled" : "light"}
                            color={subject.required ? "orange" : "blue"}
                            size="sm"
                            onClick={() => toggleSubject(subject.id)}
                            style={{
                              backgroundColor: selectedSubjects.includes(subject.id) 
                                ? (subject.required ? 'var(--primary)' : 'var(--primary)')
                                : 'var(--secondary)',
                              color: selectedSubjects.includes(subject.id) 
                                ? 'var(--primary-foreground)' 
                                : 'var(--secondary-foreground)',
                              cursor: subject.required ? 'not-allowed' : 'pointer',
                              opacity: subject.required ? 0.8 : 1,
                            }}
                            disabled={subject.required}
                          >
                            {subject.name}
                          </Button>
                        ))}
                      </SimpleGrid>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="careers" pt="lg">
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <Text size="lg" fw={500}>
                  Career Matches for Your Subject Combination
                </Text>
                <Badge size="lg" color="blue" variant="light">
                  {matchingCareers.filter(c => c.matchPercentage > 50).length} Strong Matches
                </Badge>
              </Group>

              <ScrollArea style={{ height: 600 }}>
                <Stack gap="md">
                  {matchingCareers.map(career => (
                    <Card 
                      key={career.id} 
                      shadow="sm" 
                      padding="lg" 
                      radius="md"
                      style={{
                        opacity: career.matchPercentage < 25 ? 0.6 : 1,
                      }}
                    >
                      <Stack gap="md">
                        {/* Career Header */}
                        <Group justify="space-between" align="flex-start">
                          <Stack gap="xs">
                            <Group gap="sm">
                              <Title order={3} style={{ color: 'var(--primary)' }}>
                                {career.title}
                              </Title>
                              <Badge 
                                size="lg" 
                                color={career.matchPercentage >= 80 ? 'green' : career.matchPercentage >= 60 ? 'yellow' : 'red'}
                                variant="light"
                              >
                                {career.matchPercentage}% Match
                              </Badge>
                            </Group>
                            <Text c="dimmed">{career.description}</Text>
                          </Stack>
                        </Group>

                        <Progress 
                          value={career.matchPercentage} 
                          color={career.matchPercentage >= 80 ? 'green' : career.matchPercentage >= 60 ? 'yellow' : 'red'}
                          size="md"
                        />

                        {/* Requirements */}
                        <Stack gap="sm">
                          <Text fw={500} size="sm">Subject Requirements:</Text>
                          <Group gap="xs">
                            {career.requirements.subjects.map(subjectId => {
                              const subject = availableSubjects.find(s => s.id === subjectId);
                              const isSelected = selectedSubjects.includes(subjectId);
                              const grade = career.requirements.minGrades[subjectId];
                              
                              return (
                                <Badge 
                                  key={subjectId} 
                                  color={isSelected ? 'green' : 'red'}
                                  variant="light"
                                  size="sm"
                                  leftSection={isSelected ? <CheckIcon size={12} /> : <CrossCircledIcon size={12} />}
                                >
                                  {subject?.name} ({grade})
                                </Badge>
                              );
                            })}
                          </Group>
                        </Stack>

                        <Divider />

                        {/* Career Details */}
                        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                          <Stack gap="xs">
                            <Text fw={500} size="sm">Salary Range</Text>
                            <Text size="sm" style={{ color: 'var(--primary)' }}>
                              {formatSalary(career.prospects.salaryRange)}
                            </Text>
                          </Stack>
                          
                          <Stack gap="xs">
                            <Text fw={500} size="sm">Job Market</Text>
                            <Group gap="xs">
                              <Badge color={getDemandColor(career.prospects.demand)} size="sm" leftSection={<StarIcon size={12} />}>
                                {career.prospects.demand} Demand
                              </Badge>
                              <Badge color="blue" variant="light" size="sm" leftSection={<TrendingUpIcon size={12} />}>
                                +{career.prospects.jobGrowth}% growth
                              </Badge>
                            </Group>
                          </Stack>

                          <Stack gap="xs">
                            <Text fw={500} size="sm">KUCCPS Cluster</Text>
                            <Badge color="blue" variant="light" size="sm">
                              {career.kuccpsCluster}
                            </Badge>
                          </Stack>
                        </SimpleGrid>

                        {/* Universities */}
                        <Stack gap="xs">
                          <Text fw={500} size="sm">Universities Offering This Program:</Text>
                          <Group gap="xs">
                            {career.universities.slice(0, 4).map(university => (
                              <Badge key={university} color="gray" variant="light" size="sm">
                                {university}
                              </Badge>
                            ))}
                            {career.universities.length > 4 && (
                              <Badge color="gray" variant="light" size="sm">
                                +{career.universities.length - 4} more
                              </Badge>
                            )}
                          </Group>
                        </Stack>

                        {career.matchPercentage < 50 && (
                          <Alert color="orange" variant="light" icon={<InfoCircledIcon />}>
                            <Text size="sm">
                              <strong>Missing subjects:</strong> Consider adding{' '}
                              {career.missingSubjects?.map(subjectId => {
                                const subject = availableSubjects.find(s => s.id === subjectId);
                                return subject?.name;
                              }).join(', ')}{' '}
                              to improve your match for this career.
                            </Text>
                          </Alert>
                        )}
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </ScrollArea>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};