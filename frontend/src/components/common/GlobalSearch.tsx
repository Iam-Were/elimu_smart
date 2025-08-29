import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TextInput,
  Card,
  Stack,
  Group,
  Text,
  Badge,
  ActionIcon,
  Kbd,
  Divider,
  Avatar,
} from '@mantine/core';
import {
  MagnifyingGlassIcon,
  PersonIcon,
  FileTextIcon,
  ChatBubbleIcon,
  TargetIcon,
  ClockIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'content' | 'user' | 'action' | 'resource';
  title: string;
  description: string;
  url: string;
  metadata: {
    relevance: number;
    category: string;
    lastModified?: Date;
    author?: string;
    avatar?: string;
  };
  highlights?: string[];
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'suggestion';
  category?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'content',
    title: 'Engineering Career Pathways',
    description: 'Comprehensive guide to engineering careers in Kenya including software, civil, and mechanical engineering opportunities.',
    url: '/resources/engineering-careers',
    metadata: {
      relevance: 95,
      category: 'Career Guides',
      lastModified: new Date('2024-01-15'),
      author: 'Sarah Mwangi',
    },
    highlights: ['engineering', 'career', 'software'],
  },
  {
    id: '2',
    type: 'user',
    title: 'Dr. James Kimani',
    description: 'Career Counselor specializing in STEM fields with 10+ years experience.',
    url: '/counselors/james-kimani',
    metadata: {
      relevance: 88,
      category: 'Counselors',
      avatar: '/avatars/james-kimani.jpg',
    },
  },
  {
    id: '3',
    type: 'action',
    title: 'Career Assessment',
    description: 'Take a comprehensive assessment to discover careers that match your interests and skills.',
    url: '/assessment',
    metadata: {
      relevance: 82,
      category: 'Tools',
    },
  },
  {
    id: '4',
    type: 'resource',
    title: 'University Application Guide 2024',
    description: 'Step-by-step guide for applying to Kenyan universities including deadlines and requirements.',
    url: '/resources/university-guide-2024',
    metadata: {
      relevance: 79,
      category: 'Education',
      lastModified: new Date('2024-01-10'),
    },
  },
];

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'engineering careers', type: 'recent', category: 'Recent searches' },
  { id: '2', text: 'university applications', type: 'recent', category: 'Recent searches' },
  { id: '3', text: 'computer science', type: 'popular', category: 'Popular searches' },
  { id: '4', text: 'medical careers', type: 'popular', category: 'Popular searches' },
  { id: '5', text: 'business administration', type: 'suggestion', category: 'Suggestions' },
];

interface GlobalSearchProps {
  className?: string;
  onClose?: () => void;
  placeholder?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  className, 
  onClose, 
  placeholder = "Search everything..." 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions] = useState<SearchSuggestion[]>(mockSuggestions);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounced search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter mock results based on query
    const filteredResults = mockSearchResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setResults(filteredResults);
    setIsLoading(false);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const totalItems = results.length + suggestions.length;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleItemSelect(selectedIndex);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        onClose?.();
        break;
    }
  };

  const handleItemSelect = (index: number) => {
    if (index < suggestions.length) {
      const suggestion = suggestions[index];
      setQuery(suggestion.text);
      performSearch(suggestion.text);
    } else {
      const resultIndex = index - suggestions.length;
      const result = results[resultIndex];
      if (result) {
        navigate(result.url);
        setIsOpen(false);
        setQuery('');
        onClose?.();
      }
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <PersonIcon width={16} height={16} />;
      case 'content':
        return <FileTextIcon width={16} height={16} />;
      case 'action':
        return <TargetIcon width={16} height={16} />;
      case 'resource':
        return <ChatBubbleIcon width={16} height={16} />;
      default:
        return <FileTextIcon width={16} height={16} />;
    }
  };

  const highlightText = (text: string, highlights?: string[]) => {
    if (!highlights || highlights.length === 0) return text;
    
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    setIsOpen(false);
    onClose?.();
  };

  // Group suggestions by category
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    const category = suggestion.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(suggestion);
    return acc;
  }, {} as Record<string, SearchSuggestion[]>);

  return (
    <div className={`global-search ${className || ''}`} style={{ position: 'relative' }}>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        leftSection={<MagnifyingGlassIcon width={16} height={16} />}
        rightSection={
          query ? (
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={clearSearch}
              style={{ cursor: 'pointer' }}
            >
              <Cross2Icon width={14} height={14} />
            </ActionIcon>
          ) : (
            <Group gap={4}>
              <Kbd size="xs">⌘</Kbd>
              <Kbd size="xs">K</Kbd>
            </Group>
          )
        }
        className="focus-ring-enhanced"
        style={{
          backgroundColor: 'var(--input-background)',
          border: '2px solid var(--border)',
          borderRadius: '8px',
        }}
      />

      {/* Search Results Dropdown */}
      {isOpen && (query || (!query && suggestions.length > 0)) && (
        <Card
          className="search-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            maxHeight: '400px',
            overflow: 'auto',
          }}
        >
          <Stack gap="xs">
            {/* Show suggestions when no query */}
            {!query && Object.entries(groupedSuggestions).map(([category, categoryItems]) => (
              <div key={category}>
                <Text
                  size="xs"
                  fw={600}
                  style={{
                    color: 'var(--muted-foreground)',
                    padding: '8px 12px 4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {category}
                </Text>
                {categoryItems.map((suggestion) => {
                  const globalIndex = suggestions.findIndex(s => s.id === suggestion.id);
                  return (
                    <div
                      key={suggestion.id}
                      className={`search-item ${selectedIndex === globalIndex ? 'highlighted' : ''}`}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: selectedIndex === globalIndex ? 'var(--sidebar-accent)' : 'transparent',
                        borderRadius: '4px',
                        margin: '0 4px',
                      }}
                      onClick={() => handleItemSelect(globalIndex)}
                    >
                      <Group gap="sm" align="center">
                        <ClockIcon width={14} height={14} style={{ color: 'var(--muted-foreground)' }} />
                        <Text size="sm">{suggestion.text}</Text>
                        {suggestion.type === 'popular' && (
                          <Badge size="xs" variant="light" color="orange">
                            Popular
                          </Badge>
                        )}
                      </Group>
                    </div>
                  );
                })}
                <Divider style={{ margin: '8px 0' }} />
              </div>
            ))}

            {/* Show search results */}
            {query && (
              <>
                {isLoading ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <Text
                      size="xs"
                      fw={600}
                      style={{
                        color: 'var(--muted-foreground)',
                        padding: '8px 12px 4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Search Results ({results.length})
                    </Text>
                    {results.map((result, index) => {
                      const globalIndex = suggestions.length + index;
                      return (
                        <div
                          key={result.id}
                          className={`search-item ${selectedIndex === globalIndex ? 'highlighted' : ''}`}
                          style={{
                            padding: '12px',
                            cursor: 'pointer',
                            backgroundColor: selectedIndex === globalIndex ? 'var(--sidebar-accent)' : 'transparent',
                            borderRadius: '4px',
                            margin: '0 4px',
                          }}
                          onClick={() => handleItemSelect(globalIndex)}
                        >
                          <Group gap="sm" align="flex-start">
                            {result.metadata.avatar ? (
                              <Avatar src={result.metadata.avatar} size="sm" />
                            ) : (
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '6px',
                                  backgroundColor: 'var(--primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                }}
                              >
                                {getResultIcon(result.type)}
                              </div>
                            )}
                            
                            <Stack gap={2} style={{ flex: 1 }}>
                              <Group justify="space-between" align="flex-start">
                                <Text size="sm" fw={500}>
                                  {highlightText(result.title, result.highlights)}
                                </Text>
                                <Badge size="xs" variant="light">
                                  {result.metadata.category}
                                </Badge>
                              </Group>
                              
                              <Text size="xs" c="dimmed" lineClamp={2}>
                                {result.description}
                              </Text>
                              
                              {result.metadata.author && (
                                <Text size="xs" c="dimmed">
                                  by {result.metadata.author}
                                  {result.metadata.lastModified && (
                                    <> • {result.metadata.lastModified.toLocaleDateString()}</>
                                  )}
                                </Text>
                              )}
                            </Stack>
                          </Group>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <Text size="sm" c="dimmed">
                      No results found for "{query}"
                    </Text>
                    <Text size="xs" c="dimmed" mt="xs">
                      Try different keywords or check spelling
                    </Text>
                  </div>
                )}
              </>
            )}
          </Stack>
        </Card>
      )}
    </div>
  );
};

