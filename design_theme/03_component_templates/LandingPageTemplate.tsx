/* ELIMU SMART DESIGN SYSTEM - LANDING PAGE TEMPLATE */
/* Copy this template and customize for your new project */

import React from 'react';
import { 
  Button, 
  Container, 
  Title, 
  Text, 
  Card, 
  Grid, 
  Group, 
  Stack,
  Badge,
  Anchor,
  Paper
} from '@mantine/core';
import { 
  IconRocket, 
  IconTarget, 
  IconUsers, 
  IconTrendingUp,
  IconCheck,
  IconArrowRight,
  IconStar,
  IconShield,
  IconSupport
} from '@tabler/icons-react';

// Hero Section Component
const HeroSection = ({ onGetStarted, onLearnMore }) => (
  <section className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 flex items-center">
    <Container size="lg" className="py-20">
      <div className="text-center space-y-8">
        {/* Hero Badge */}
        <Badge 
          size="lg" 
          variant="outline" 
          className="mx-auto mb-6"
          styles={{
            root: {
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              backgroundColor: 'var(--background)'
            }
          }}
        >
          ✨ New Platform Launch
        </Badge>

        {/* Main Headline */}
        <div className="space-y-4">
          <Title 
            order={1} 
            size="4rem"
            className="font-bold text-foreground leading-tight"
            styles={{
              root: {
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }
            }}
          >
            Your Platform Name
          </Title>
          
          <Text 
            size="xl" 
            className="text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            styles={{ root: { fontSize: '1.25rem', lineHeight: 1.6 } }}
          >
            Transform your experience with our comprehensive platform designed to 
            help you achieve your goals through intelligent guidance and personalized solutions.
          </Text>
        </div>

        {/* CTA Buttons */}
        <Group justify="center" gap="md" className="pt-8">
          <Button 
            size="xl"
            className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-4"
            onClick={onGetStarted}
            rightSection={<IconArrowRight size={20} />}
            styles={{
              root: {
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 'var(--radius)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(249, 115, 22, 0.3)'
                }
              }
            }}
          >
            Get Started Free
          </Button>
          
          <Button 
            size="xl"
            variant="outline"
            className="px-8 py-4"
            onClick={onLearnMore}
            styles={{
              root: {
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                fontSize: '1.1rem',
                borderRadius: 'var(--radius)',
                '&:hover': {
                  backgroundColor: 'var(--muted)',
                  borderColor: 'var(--primary)'
                }
              }
            }}
          >
            Learn More
          </Button>
        </Group>

        {/* Social Proof */}
        <div className="pt-12">
          <Text size="sm" className="text-muted-foreground mb-4">
            Trusted by thousands of users worldwide
          </Text>
          <Group justify="center" gap="xl">
            <div className="flex items-center gap-2">
              <IconStar size={16} className="text-warning" />
              <Text size="sm" className="font-medium">4.9/5 Rating</Text>
            </div>
            <div className="flex items-center gap-2">
              <IconUsers size={16} className="text-primary" />
              <Text size="sm" className="font-medium">10,000+ Users</Text>
            </div>
            <div className="flex items-center gap-2">
              <IconShield size={16} className="text-success" />
              <Text size="sm" className="font-medium">100% Secure</Text>
            </div>
          </Group>
        </div>
      </div>
    </Container>
  </section>
);

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: IconRocket,
      title: "Lightning Fast",
      description: "Built with modern technology for optimal performance and user experience.",
      color: "var(--primary)"
    },
    {
      icon: IconTarget,
      title: "Goal-Oriented",
      description: "Designed to help you achieve specific objectives with personalized guidance.",
      color: "var(--success)"
    },
    {
      icon: IconUsers,
      title: "Community Driven",
      description: "Connect with like-minded individuals and learn from expert mentors.",
      color: "var(--info)"
    },
    {
      icon: IconTrendingUp,
      title: "Data-Driven Insights",
      description: "Make informed decisions with comprehensive analytics and reporting.",
      color: "var(--warning)"
    },
    {
      icon: IconShield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures.",
      color: "var(--success)"
    },
    {
      icon: IconSupport,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team.",
      color: "var(--primary)"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <Container size="lg">
        <div className="text-center mb-16">
          <Title order={2} className="text-foreground mb-4 text-3xl font-semibold">
            Everything You Need to Succeed
          </Title>
          <Text size="lg" className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and features designed to support your journey 
            from start to finish.
          </Text>
        </div>

        <Grid gutter="lg">
          {features.map((feature, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card 
                className="h-full hover-lift theme-transition p-6"
                styles={{
                  root: {
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    cursor: 'pointer'
                  }
                }}
              >
                <Stack gap="md">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${feature.color}15`,
                      color: feature.color 
                    }}
                  >
                    <feature.icon size={24} />
                  </div>
                  
                  <div>
                    <Title order={4} className="text-foreground mb-2">
                      {feature.title}
                    </Title>
                    <Text size="sm" className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

// Benefits Section Component
const BenefitsSection = () => {
  const benefits = [
    "Personalized experience tailored to your needs",
    "Real-time progress tracking and analytics",
    "Expert guidance from industry professionals",
    "Secure and private data handling",
    "Mobile-responsive design for any device",
    "24/7 customer support and assistance"
  ];

  return (
    <section className="py-20 bg-background">
      <Container size="lg">
        <Grid align="center" gutter="xl">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="lg">
              <div>
                <Title order={2} className="text-foreground mb-4 text-3xl font-semibold">
                  Why Choose Our Platform?
                </Title>
                <Text size="lg" className="text-muted-foreground mb-6">
                  We've built a comprehensive solution that addresses real-world 
                  challenges with innovative features and user-centric design.
                </Text>
              </div>

              <Stack gap="md">
                {benefits.map((benefit, index) => (
                  <Group key={index} gap="sm" align="flex-start">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center mt-1"
                      style={{ backgroundColor: 'var(--success)' }}
                    >
                      <IconCheck size={14} color="white" />
                    </div>
                    <Text className="text-foreground flex-1">
                      {benefit}
                    </Text>
                  </Group>
                ))}
              </Stack>

              <Button 
                size="lg"
                className="bg-primary text-primary-foreground w-fit mt-4"
                rightSection={<IconArrowRight size={16} />}
                styles={{
                  root: {
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                  }
                }}
              >
                Start Your Journey
              </Button>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper 
              className="p-8 text-center"
              styles={{
                root: {
                  backgroundColor: 'var(--muted)',
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius)'
                }
              }}
            >
              <div className="space-y-4">
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <IconTrendingUp size={32} color="white" />
                </div>
                <Title order={3} className="text-foreground">
                  Ready to Get Started?
                </Title>
                <Text className="text-muted-foreground">
                  Join thousands of satisfied users who have transformed 
                  their experience with our platform.
                </Text>
              </div>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Owner",
      content: "This platform has completely transformed how I manage my business. The insights and tools provided are invaluable.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Student",
      content: "The user experience is fantastic, and the support team is incredibly responsive. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Professional",
      content: "I've tried many similar platforms, but this one stands out for its simplicity and effectiveness.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <Container size="lg">
        <div className="text-center mb-16">
          <Title order={2} className="text-foreground mb-4 text-3xl font-semibold">
            What Our Users Say
          </Title>
          <Text size="lg" className="text-muted-foreground">
            Don't just take our word for it - hear from our satisfied users.
          </Text>
        </div>

        <Grid gutter="lg">
          {testimonials.map((testimonial, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 4 }}>
              <Card 
                className="h-full p-6"
                styles={{
                  root: {
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)'
                  }
                }}
              >
                <Stack gap="md">
                  <Group gap="xs">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <IconStar key={i} size={16} className="text-warning" fill="currentColor" />
                    ))}
                  </Group>
                  
                  <Text className="text-foreground italic leading-relaxed">
                    "{testimonial.content}"
                  </Text>
                  
                  <div>
                    <Text className="text-foreground font-medium">
                      {testimonial.name}
                    </Text>
                    <Text size="sm" className="text-muted-foreground">
                      {testimonial.role}
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

// CTA Section Component
const CTASection = ({ onGetStarted }) => (
  <section className="py-20 bg-gradient-to-r from-primary to-accent">
    <Container size="lg">
      <div className="text-center space-y-6">
        <Title 
          order={2} 
          className="text-white mb-4 text-3xl font-semibold"
        >
          Ready to Transform Your Experience?
        </Title>
        <Text 
          size="lg" 
          className="text-white/90 mb-8 max-w-2xl mx-auto"
        >
          Join thousands of users who have already discovered the power of our platform. 
          Start your journey today and see the difference for yourself.
        </Text>
        
        <Button 
          size="xl"
          variant="white"
          className="text-primary font-semibold px-8 py-4"
          onClick={onGetStarted}
          rightSection={<IconArrowRight size={20} />}
          styles={{
            root: {
              backgroundColor: 'white',
              color: 'var(--primary)',
              border: 'none',
              fontSize: '1.1rem',
              borderRadius: 'var(--radius)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
              }
            }
          }}
        >
          Get Started Now
        </Button>
        
        <Text size="sm" className="text-white/80">
          No credit card required • Free 14-day trial • Cancel anytime
        </Text>
      </div>
    </Container>
  </section>
);

// Footer Component
const Footer = () => (
  <footer className="py-12 bg-card border-t border-border">
    <Container size="lg">
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <Title order={3} className="text-foreground">
              Your Platform Name
            </Title>
            <Text size="sm" className="text-muted-foreground max-w-md">
              Empowering users with innovative solutions and exceptional experiences. 
              Built with care for the modern world.
            </Text>
          </Stack>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Group justify="flex-end" gap="xl">
            <Anchor href="#" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Anchor>
            <Anchor href="#" className="text-muted-foreground hover:text-primary">
              Terms of Service
            </Anchor>
            <Anchor href="#" className="text-muted-foreground hover:text-primary">
              Contact Us
            </Anchor>
          </Group>
        </Grid.Col>
      </Grid>
      
      <div className="border-t border-border mt-8 pt-8">
        <Text size="sm" className="text-muted-foreground text-center">
          © 2024 Your Platform Name. All rights reserved.
        </Text>
      </div>
    </Container>
  </footer>
);

// Main Landing Page Component
const LandingPageTemplate = ({ onGetStarted, onLearnMore }) => {
  const handleGetStarted = () => {
    onGetStarted?.();
  };

  const handleLearnMore = () => {
    onLearnMore?.();
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection 
        onGetStarted={handleGetStarted}
        onLearnMore={handleLearnMore}
      />
      <FeaturesSection />
      <BenefitsSection />
      <TestimonialsSection />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
};

export default LandingPageTemplate;

// Export individual sections for customization
export {
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  TestimonialsSection,
  CTASection,
  Footer
};