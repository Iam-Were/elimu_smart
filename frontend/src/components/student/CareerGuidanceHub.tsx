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
  TextInput,
  Select,
  Tabs,
  ScrollArea,
  Alert,
  ActionIcon,
  Modal,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface CareerSpotlight {
  id: string;
  title: string;
  category: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  dayInLife: string[];
  requirements: {
    education: string[];
    skills: string[];
    subjects: string[];
  };
  careerPath: {
    step: string;
    timeframe: string;
    description: string;
  }[];
  salary: {
    entry: number;
    mid: number;
    senior: number;
  };
  jobOutlook: {
    growth: number;
    demand: 'High' | 'Medium' | 'Low';
    opportunities: string[];
  };
  successStory: {
    name: string;
    position: string;
    company: string;
    story: string;
  };
  resources: {
    title: string;
    type: 'article' | 'video' | 'course' | 'website';
    url: string;
  }[];
}

// Mock career data for Career Guidance Hub
const careerSpotlights: CareerSpotlight[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology',
    image: '/api/placeholder/400/300',
    shortDescription: 'Design, develop, and maintain software applications and systems.',
    fullDescription: 'Software engineers are the architects of the digital world. They create applications, websites, mobile apps, and complex systems that power modern businesses and daily life. This field combines creativity with technical skills to solve real-world problems through code.',
    dayInLife: [
      'Review and plan daily development tasks',
      'Write and test code for new features',
      'Collaborate with team members in meetings',
      'Debug and fix software issues',
      'Code review for quality assurance',
      'Learn new technologies and frameworks'
    ],
    requirements: {
      education: ['Bachelor\'s in Computer Science', 'Software Engineering degree', 'Self-taught with strong portfolio'],
      skills: ['Programming languages (Python, Java, JavaScript)', 'Problem-solving', 'Critical thinking', 'Communication'],
      subjects: ['Mathematics', 'Physics', 'Computer Studies']
    },
    careerPath: [
      { step: 'Junior Developer', timeframe: '0-2 years', description: 'Learn fundamentals, work on small features, gain experience' },
      { step: 'Mid-level Developer', timeframe: '2-5 years', description: 'Lead projects, mentor juniors, specialize in technologies' },
      { step: 'Senior Developer', timeframe: '5-8 years', description: 'Architecture decisions, technical leadership, complex projects' },
      { step: 'Tech Lead/Architect', timeframe: '8+ years', description: 'Team leadership, system design, strategic technical decisions' }
    ],
    salary: {
      entry: 80000,
      mid: 180000,
      senior: 350000
    },
    jobOutlook: {
      growth: 25,
      demand: 'High',
      opportunities: ['Fintech companies', 'Tech startups', 'Banks', 'Government agencies', 'International remote work']
    },
    successStory: {
      name: 'Sarah Mwangi',
      position: 'Senior Software Engineer',
      company: 'M-Pesa (Safaricom)',
      story: 'Started as a self-taught programmer while studying at University of Nairobi. Built mobile apps as side projects, landed internship at a startup, and worked her way up to leading the mobile payments team at M-Pesa. Now earning KSh 400K monthly and mentoring other women in tech.'
    },
    resources: [
      { title: 'Learn Python Programming', type: 'course', url: '#' },
      { title: 'Kenyan Tech Industry Overview', type: 'article', url: '#' },
      { title: 'Day in Life of a Developer', type: 'video', url: '#' },
      { title: 'FreeCodeCamp', type: 'website', url: '#' }
    ]
  },
  {
    id: 'doctor',
    title: 'Medical Doctor',
    category: 'Healthcare',
    image: '/api/placeholder/400/300',
    shortDescription: 'Diagnose, treat, and prevent illnesses to improve human health.',
    fullDescription: 'Doctors are healthcare professionals who diagnose and treat illnesses, injuries, and health conditions. They work directly with patients to understand symptoms, run tests, prescribe medications, and develop treatment plans. This profession requires extensive medical knowledge, strong communication skills, and genuine care for human welfare.',
    dayInLife: [
      'Morning rounds with hospital patients',
      'Consultation appointments with outpatients',
      'Review test results and medical records',
      'Perform medical procedures or minor surgeries',
      'Collaborate with nurses and specialists',
      'Update patient records and treatment plans'
    ],
    requirements: {
      education: ['Bachelor of Medicine (6 years)', 'Medical internship (1 year)', 'Specialization training (3-5 years)'],
      skills: ['Diagnostic skills', 'Communication', 'Empathy', 'Decision-making under pressure', 'Attention to detail'],
      subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics']
    },
    careerPath: [
      { step: 'Medical Student', timeframe: '6 years', description: 'Study medicine, clinical rotations, medical knowledge foundation' },
      { step: 'Medical Intern', timeframe: '1 year', description: 'Supervised practice in hospital, gain practical experience' },
      { step: 'Medical Officer', timeframe: '2-3 years', description: 'Independent practice, general medicine, patient care' },
      { step: 'Specialist', timeframe: '3-5 years training', description: 'Specialized training in chosen field (cardiology, surgery, etc.)' }
    ],
    salary: {
      entry: 120000,
      mid: 300000,
      senior: 800000
    },
    jobOutlook: {
      growth: 15,
      demand: 'High',
      opportunities: ['Public hospitals', 'Private practice', 'NGOs', 'Research institutions', 'International organizations']
    },
    successStory: {
      name: 'Dr. James Kiprotich',
      position: 'Cardiovascular Surgeon',
      company: 'Nairobi Hospital',
      story: 'Grew up in rural Kenya, excelled in sciences at Moi High School. Studied medicine at University of Nairobi, specialized in cardiovascular surgery in South Africa. Now performs life-saving heart surgeries and has trained over 50 young doctors. Earns KSh 1.2M monthly and runs a free clinic in his hometown.'
    },
    resources: [
      { title: 'Medical School Preparation', type: 'article', url: '#' },
      { title: 'Kenya Medical Training College', type: 'website', url: '#' },
      { title: 'Life of a Doctor in Kenya', type: 'video', url: '#' },
      { title: 'Medical Career Pathways', type: 'course', url: '#' }
    ]
  },
  {
    id: 'teacher',
    title: 'Teacher',
    category: 'Education',
    image: '/api/placeholder/400/300',
    shortDescription: 'Educate and inspire students to reach their full potential.',
    fullDescription: 'Teachers are the foundation of society, shaping young minds and preparing the next generation for success. They create lesson plans, deliver instruction, assess student progress, and provide guidance. Beyond academics, teachers mentor students, help develop character, and inspire lifelong learning.',
    dayInLife: [
      'Prepare lesson plans and materials',
      'Conduct classes and deliver instruction',
      'Grade assignments and assessments',
      'Meet with parents and school administration',
      'Provide extra help to struggling students',
      'Participate in professional development'
    ],
    requirements: {
      education: ['Bachelor of Education', 'Teaching diploma', 'Subject specialization degree'],
      skills: ['Communication', 'Patience', 'Leadership', 'Creativity', 'Classroom management'],
      subjects: ['English', 'Kiswahili', 'Mathematics', 'Plus 2+ teaching subjects']
    },
    careerPath: [
      { step: 'Student Teacher', timeframe: '1 year', description: 'Teaching practice, gain classroom experience' },
      { step: 'Graduate Teacher', timeframe: '0-3 years', description: 'Entry-level teaching, learn school systems' },
      { step: 'Senior Teacher', timeframe: '3-8 years', description: 'Department responsibilities, mentor new teachers' },
      { step: 'Head Teacher/Principal', timeframe: '8+ years', description: 'School leadership, administration, strategic planning' }
    ],
    salary: {
      entry: 35000,
      mid: 65000,
      senior: 120000
    },
    jobOutlook: {
      growth: 5,
      demand: 'Medium',
      opportunities: ['Primary schools', 'Secondary schools', 'Private schools', 'International schools', 'Adult education']
    },
    successStory: {
      name: 'Grace Wanjiku',
      position: 'Principal',
      company: 'Alliance Girls High School',
      story: 'Started as a mathematics teacher in rural school after Kenyatta University. Through dedication and continuous learning, became head of department, deputy principal, and now leads one of Kenya\'s top schools. Her students consistently excel in KCSE, and she\'s transformed the school into a model institution.'
    },
    resources: [
      { title: 'Teaching Methods in Kenya', type: 'course', url: '#' },
      { title: 'Educational Leadership', type: 'article', url: '#' },
      { title: 'Classroom Management Tips', type: 'video', url: '#' },
      { title: 'Kenya Institute of Curriculum Development', type: 'website', url: '#' }
    ]
  }
];

const categories = ['All', 'Technology', 'Healthcare', 'Education', 'Business', 'Engineering', 'Arts'];

export const CareerGuidanceHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookmarkedCareers, setBookmarkedCareers] = useState<string[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<CareerSpotlight | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const toggleBookmark = (careerId: string) => {
    setBookmarkedCareers(prev => 
      prev.includes(careerId)
        ? prev.filter(id => id !== careerId)
        : [...prev, careerId]
    );
    
    const isBookmarking = !bookmarkedCareers.includes(careerId);
    notifications.show({
      title: isBookmarking ? 'Career Bookmarked!' : 'Bookmark Removed',
      message: isBookmarking ? 'Added to your favorites' : 'Removed from favorites',
      color: isBookmarking ? 'green' : 'blue',
    });
  };

  const filteredCareers = careerSpotlights.filter(career => {
    const matchesSearch = career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          career.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openCareerDetail = (career: CareerSpotlight) => {
    setSelectedCareer(career);
    open();
  };

  const formatSalary = (amount: number) => {
    return `KSh ${(amount / 1000).toFixed(0)}K`;
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'green';
      case 'Medium': return 'yellow';
      case 'Low': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Stack gap="sm">
          <Title order={1} size="2rem">Career Guidance Hub</Title>
          <Text size="lg" c="dimmed">
            Explore detailed career information, success stories, and pathway guidance
          </Text>
        </Stack>

        {/* Search and Filters */}
        <Card shadow="sm" padding="lg" radius="md">
          <Group gap="md" align="flex-end">
            <TextInput
              placeholder="Search careers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              style={{ flex: 1 }}
              leftSection="🔍"
            />
            <Select
              placeholder="Category"
              data={categories}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value || 'All')}
              style={{ minWidth: 150 }}
            />
            <Button variant="light" color="blue">
              Bookmarks ({bookmarkedCareers.length})
            </Button>
          </Group>
        </Card>

        {/* Career Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {filteredCareers.map(career => (
            <Card 
              key={career.id} 
              shadow="sm" 
              padding="lg" 
              radius="md"
              className="hover-lift theme-transition"
              style={{ cursor: 'pointer' }}
            >
              <Stack gap="md">
                {/* Career Image Placeholder */}
                <div style={{
                  height: 200,
                  backgroundColor: 'var(--muted)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                }}>
                  {career.category === 'Technology' ? '💻' : 
                   career.category === 'Healthcare' ? '⚕️' :
                   career.category === 'Education' ? '📚' : '👨‍💼'}
                </div>

                {/* Career Info */}
                <Stack gap="xs">
                  <Group justify="space-between" align="flex-start">
                    <Title order={3} size="1.2rem" style={{ color: 'var(--primary)' }}>
                      {career.title}
                    </Title>
                    <ActionIcon
                      variant="subtle"
                      color={bookmarkedCareers.includes(career.id) ? 'yellow' : 'gray'}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(career.id);
                      }}
                    >
                      {bookmarkedCareers.includes(career.id) ? '⭐' : '☆'}
                    </ActionIcon>
                  </Group>
                  
                  <Badge color="blue" variant="light" size="sm">
                    {career.category}
                  </Badge>
                  
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {career.shortDescription}
                  </Text>
                </Stack>

                {/* Quick Stats */}
                <Group gap="sm">
                  <Badge color="green" variant="light" size="xs">
                    {formatSalary(career.salary.entry)} - {formatSalary(career.salary.senior)}
                  </Badge>
                  <Badge color={getDemandColor(career.jobOutlook.demand)} variant="light" size="xs">
                    {career.jobOutlook.demand} Demand
                  </Badge>
                  <Badge color="blue" variant="light" size="xs">
                    +{career.jobOutlook.growth}% Growth
                  </Badge>
                </Group>

                {/* Action Button */}
                <Button 
                  variant="light"
                  size="sm"
                  onClick={() => openCareerDetail(career)}
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

        {filteredCareers.length === 0 && (
          <Alert color="blue" variant="light">
            <Text ta="center">
              No careers found matching your search. Try adjusting your filters or search terms.
            </Text>
          </Alert>
        )}
      </Stack>

      {/* Career Detail Modal */}
      <Modal 
        opened={opened} 
        onClose={close} 
        size="xl"
        title={selectedCareer?.title}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedCareer && (
          <Stack gap="lg">
            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview">Overview</Tabs.Tab>
                <Tabs.Tab value="path">Career Path</Tabs.Tab>
                <Tabs.Tab value="story">Success Story</Tabs.Tab>
                <Tabs.Tab value="resources">Resources</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="md">
                <Stack gap="md">
                  <Text>{selectedCareer.fullDescription}</Text>
                  
                  <Divider />
                  
                  <Stack gap="sm">
                    <Title order={4}>A Day in the Life</Title>
                    <Stack gap="xs">
                      {selectedCareer.dayInLife.map((activity, index) => (
                        <Group key={index} gap="sm">
                          <Text size="sm" style={{ color: 'var(--primary)' }}>•</Text>
                          <Text size="sm">{activity}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>

                  <Divider />

                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <Stack gap="sm">
                      <Title order={5}>Education Requirements</Title>
                      {selectedCareer.requirements.education.map((req, index) => (
                        <Badge key={index} variant="light" color="blue" size="sm">
                          {req}
                        </Badge>
                      ))}
                    </Stack>
                    
                    <Stack gap="sm">
                      <Title order={5}>Key Skills</Title>
                      {selectedCareer.requirements.skills.map((skill, index) => (
                        <Badge key={index} variant="light" color="green" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </Stack>
                  </SimpleGrid>

                  <Alert color="orange" variant="light">
                    <Text fw={500}>KCSE Subject Requirements:</Text>
                    <Text size="sm">
                      {selectedCareer.requirements.subjects.join(', ')}
                    </Text>
                  </Alert>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="path" pt="md">
                <Stack gap="md">
                  <Title order={4}>Career Progression</Title>
                  {selectedCareer.careerPath.map((step, index) => (
                    <Card key={index} shadow="xs" padding="md" radius="sm">
                      <Group gap="md" align="flex-start">
                        <Badge color="orange" variant="light">
                          Step {index + 1}
                        </Badge>
                        <Stack gap="xs" style={{ flex: 1 }}>
                          <Group justify="space-between">
                            <Text fw={500}>{step.step}</Text>
                            <Badge color="blue" variant="light" size="sm">
                              {step.timeframe}
                            </Badge>
                          </Group>
                          <Text size="sm" c="dimmed">{step.description}</Text>
                        </Stack>
                      </Group>
                    </Card>
                  ))}

                  <Divider />

                  <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                    <Stack gap="xs" ta="center">
                      <Text fw={500} size="sm">Entry Level</Text>
                      <Text style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 600 }}>
                        {formatSalary(selectedCareer.salary.entry)}
                      </Text>
                    </Stack>
                    <Stack gap="xs" ta="center">
                      <Text fw={500} size="sm">Mid-Career</Text>
                      <Text style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 600 }}>
                        {formatSalary(selectedCareer.salary.mid)}
                      </Text>
                    </Stack>
                    <Stack gap="xs" ta="center">
                      <Text fw={500} size="sm">Senior Level</Text>
                      <Text style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 600 }}>
                        {formatSalary(selectedCareer.salary.senior)}
                      </Text>
                    </Stack>
                  </SimpleGrid>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="story" pt="md">
                <Stack gap="md">
                  <Card shadow="xs" padding="lg" radius="md">
                    <Stack gap="md">
                      <Group gap="md">
                        <div style={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary-foreground)',
                          fontSize: '1.5rem',
                          fontWeight: 600,
                        }}>
                          {selectedCareer.successStory.name.charAt(0)}
                        </div>
                        <Stack gap={2}>
                          <Text fw={500}>{selectedCareer.successStory.name}</Text>
                          <Text size="sm" c="dimmed">
                            {selectedCareer.successStory.position} at {selectedCareer.successStory.company}
                          </Text>
                        </Stack>
                      </Group>
                      
                      <Text>{selectedCareer.successStory.story}</Text>
                    </Stack>
                  </Card>

                  <Alert color="green" variant="light">
                    <Text fw={500}>Key Takeaways:</Text>
                    <Text size="sm">
                      Success in this field comes from dedication, continuous learning, and practical experience.
                      Start building relevant skills early and look for mentorship opportunities.
                    </Text>
                  </Alert>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="resources" pt="md">
                <Stack gap="md">
                  <Title order={4}>Learning Resources</Title>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    {selectedCareer.resources.map((resource, index) => (
                      <Card key={index} shadow="xs" padding="md" radius="sm">
                        <Group gap="sm">
                          <Text>
                            {resource.type === 'course' ? '📚' :
                             resource.type === 'article' ? '📰' :
                             resource.type === 'video' ? '🎥' : '🌐'}
                          </Text>
                          <Stack gap={2} style={{ flex: 1 }}>
                            <Text fw={500} size="sm">{resource.title}</Text>
                            <Badge size="xs" variant="light">
                              {resource.type}
                            </Badge>
                          </Stack>
                          <Button variant="subtle" size="xs">
                            View
                          </Button>
                        </Group>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};