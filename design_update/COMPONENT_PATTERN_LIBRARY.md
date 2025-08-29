# Component Pattern Library - Devin AI Training Guide

## 🎯 Master Component Patterns

### Button Component Patterns

#### Primary Button Pattern
```tsx
// Used for: Main actions, CTAs, form submissions
<button className="
  inline-flex items-center justify-center
  px-6 py-3 rounded-lg
  bg-gradient-primary text-white font-medium
  hover:shadow-lg hover:-translate-y-0.5
  focus:outline-none focus:ring-2 focus:ring-primary/50
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
">
  <Icon className="mr-2 h-4 w-4" />
  Button Text
</button>

/* Key Patterns:
- Gradient background for premium feel
- White text for maximum contrast
- Subtle lift on hover (-translate-y-0.5)
- Focus ring for accessibility
- Icon spacing with mr-2
- Disabled state handling
*/
```

#### Secondary Button Pattern
```tsx
// Used for: Supporting actions, cancel buttons, alternative choices
<button className="
  inline-flex items-center justify-center
  px-6 py-3 rounded-lg
  bg-white border-2 border-primary text-primary font-medium
  hover:bg-primary hover:text-white hover:shadow-md
  focus:outline-none focus:ring-2 focus:ring-primary/50
  transition-all duration-200
">
  <Icon className="mr-2 h-4 w-4" />
  Button Text
</button>

/* Key Patterns:
- White background with colored border
- Colors flip on hover (background becomes colored)
- Border width of 2px for visibility
- Same sizing and spacing as primary
*/
```

#### Ghost Button Pattern
```tsx
// Used for: Subtle actions, menu items, less important actions
<button className="
  inline-flex items-center justify-center
  px-4 py-2 rounded-lg
  bg-transparent text-primary font-medium
  hover:bg-primary/10 hover:shadow-sm
  focus:outline-none focus:ring-2 focus:ring-primary/50
  transition-all duration-200
">
  <Icon className="mr-2 h-4 w-4" />
  Button Text
</button>

/* Key Patterns:
- Transparent background
- Subtle colored background on hover (/10 = 10% opacity)
- Maintains color consistency
- Minimal visual weight
*/
```

### Card Component Patterns

#### Standard Information Card
```tsx
// Used for: Dashboard widgets, content display, information panels
<div className="
  bg-white rounded-lg shadow-sm border border-gray-200
  p-6 hover:shadow-md transition-shadow duration-200
">
  {/* Header with icon and title */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">Card Title</h3>
        <p className="text-sm text-gray-600">Subtitle or description</p>
      </div>
    </div>
    <Button variant="ghost" size="sm">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </div>
  
  {/* Content area */}
  <div className="space-y-3">
    <p className="text-gray-700">Main content goes here...</p>
    <div className="flex items-center space-x-4 text-sm text-gray-500">
      <span className="flex items-center space-x-1">
        <Icon className="h-4 w-4" />
        <span>Metadata</span>
      </span>
    </div>
  </div>
  
  {/* Footer with actions */}
  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
    <span className="text-sm text-gray-500">Additional info</span>
    <Button variant="primary" size="sm">Action</Button>
  </div>
</div>

/* Key Card Patterns:
- White background for maximum contrast
- Subtle shadow that enhances on hover
- Icon in colored circle background (primary/10)
- Consistent internal spacing (space-x-3, space-y-3)
- Border separation for sections
- Action buttons in footer
*/
```

#### Feature Card Pattern
```tsx
// Used for: Service showcases, feature highlights, product cards
<div className="
  bg-white rounded-lg shadow-sm border border-gray-200
  overflow-hidden hover:shadow-lg hover:-translate-y-1
  transition-all duration-200 group
">
  {/* Visual header */}
  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 
                  flex items-center justify-center p-8">
    <Icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-200" />
  </div>
  
  {/* Content */}
  <div className="p-6">
    <h3 className="font-semibold text-gray-900 mb-2">Feature Title</h3>
    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
      Feature description that provides clear value proposition...
    </p>
    
    {/* Metadata */}
    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
      <span className="flex items-center space-x-1">
        <Clock className="h-4 w-4" />
        <span>5 min read</span>
      </span>
      <span className="flex items-center space-x-1">
        <Users className="h-4 w-4" />
        <span>1.2k users</span>
      </span>
    </div>
    
    {/* CTA */}
    <Button className="w-full" variant="primary">
      Explore Feature
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
</div>

/* Key Feature Card Patterns:
- Aspect ratio container for consistent sizing
- Gradient background for visual appeal
- Group hover effects for icon animation
- Line clamping for consistent text length
- Full-width CTA button
- Metadata with icons for context
*/
```

### Header Component Patterns

#### Main Navigation Header
```tsx
// Used for: Primary site navigation, authenticated user navigation
<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      
      {/* Logo section */}
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
        </div>
        <div className="font-bold text-xl text-gray-900">
          Elimu Smart
        </div>
      </div>
      
      {/* Navigation menu */}
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg
                           text-gray-600 hover:text-primary hover:bg-primary/5
                           transition-colors duration-200">
          <Home className="h-4 w-4" />
          <span className="text-sm font-medium">Dashboard</span>
        </a>
        <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg
                           text-gray-600 hover:text-primary hover:bg-primary/5
                           transition-colors duration-200">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-medium">Careers</span>
        </a>
        <a href="#" className="flex items-center space-x-2 px-3 py-2 rounded-lg
                           text-gray-600 hover:text-primary hover:bg-primary/5
                           transition-colors duration-200">
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Chat</span>
        </a>
      </nav>
      
      {/* User actions */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="primary" size="sm">
          Upgrade
        </Button>
        <div className="relative">
          <button className="flex items-center space-x-2 p-1 rounded-full 
                           hover:bg-gray-100 transition-colors duration-200">
            <img className="h-8 w-8 rounded-full" src="/avatar.jpg" alt="User" />
          </button>
        </div>
      </div>
      
    </div>
  </div>
</header>

/* Key Header Patterns:
- White background for maximum contrast
- Sticky positioning (sticky top-0 z-50)
- Standard height (h-16 = 64px)
- Logo always on left with consistent spacing
- Navigation hidden on mobile (hidden md:flex)
- Hover states with subtle background color
- User actions on right with avatar
*/
```

#### Page Header Pattern
```tsx
// Used for: Individual page headers, section introductions
<div className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex items-center justify-between">
      
      {/* Title section */}
      <div className="min-w-0 flex-1">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="#" className="hover:text-primary transition-colors duration-200">
                Dashboard
              </a>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">Career Hub</span>
            </li>
          </ol>
        </nav>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">
          Explore Career Paths
        </h1>
        <p className="mt-1 text-gray-600">
          Discover opportunities that match your interests and skills
        </p>
      </div>
      
      {/* Actions */}
      <div className="ml-4 flex items-center space-x-3">
        <Button variant="secondary">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Career
        </Button>
      </div>
      
    </div>
  </div>
</div>

/* Key Page Header Patterns:
- White background with bottom border
- Breadcrumb navigation for context
- Large title with responsive sizing
- Descriptive subtitle
- Actions grouped on right
- Proper spacing and hierarchy
*/
```

### Form Component Patterns

#### Standard Form Layout
```tsx
// Used for: User registration, settings, data entry
<form className="space-y-6 max-w-md mx-auto">
  
  {/* Form header */}
  <div className="text-center">
    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
    <p className="mt-2 text-gray-600">Join Elimu Smart today</p>
  </div>
  
  {/* Form fields */}
  <div className="space-y-4">
    
    {/* Input field pattern */}
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Full Name
      </label>
      <div className="relative">
        <input
          id="name"
          type="text"
          className="
            block w-full px-3 py-2 
            border border-gray-300 rounded-lg
            bg-white text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            disabled:bg-gray-50 disabled:text-gray-500
            transition-colors duration-200
          "
          placeholder="Enter your full name"
        />
        <User className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>
    </div>
    
    {/* Select field pattern */}
    <div>
      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
        I am a...
      </label>
      <select
        id="role"
        className="
          block w-full px-3 py-2 
          border border-gray-300 rounded-lg
          bg-white text-gray-900
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-colors duration-200
        "
      >
        <option value="">Select your role</option>
        <option value="student">Student</option>
        <option value="parent">Parent</option>
        <option value="counselor">Career Counselor</option>
      </select>
    </div>
    
    {/* Checkbox pattern */}
    <div className="flex items-center">
      <input
        id="terms"
        type="checkbox"
        className="
          h-4 w-4 rounded
          border-gray-300 text-primary
          focus:ring-2 focus:ring-primary/50
        "
      />
      <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
        I agree to the{' '}
        <a href="#" className="text-primary hover:text-primary/80 font-medium">
          Terms of Service
        </a>
      </label>
    </div>
    
  </div>
  
  {/* Form actions */}
  <div className="space-y-3">
    <Button type="submit" className="w-full" variant="primary">
      Create My Account
    </Button>
    <div className="text-center text-sm text-gray-600">
      Already have an account?{' '}
      <a href="#" className="text-primary hover:text-primary/80 font-medium">
        Sign in here
      </a>
    </div>
  </div>
  
</form>

/* Key Form Patterns:
- Centered layout with max-width constraint
- Clear visual hierarchy with headers
- Consistent spacing between elements (space-y-4)
- Focus states with ring and border color change
- Icons for visual context
- Full-width submit buttons
- Links for secondary actions
*/
```

### List Component Patterns

#### Data List Pattern
```tsx
// Used for: User lists, content management, data tables
<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  
  {/* List header */}
  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-gray-900">Recent Applications</h3>
      <Button variant="ghost" size="sm">
        View All
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
  
  {/* List items */}
  <div className="divide-y divide-gray-200">
    {items.map((item, index) => (
      <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex items-center justify-between">
          
          {/* Main content */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">
                {item.title}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {item.description}
              </p>
            </div>
          </div>
          
          {/* Metadata and actions */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {item.value}
              </p>
              <p className="text-xs text-gray-500">
                {item.timestamp}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'}
              `}>
                {item.status}
              </span>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    ))}
  </div>
  
  {/* Empty state */}
  {items.length === 0 && (
    <div className="px-6 py-12 text-center">
      <FileX className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-sm font-medium text-gray-900">No applications yet</h3>
      <p className="mt-2 text-sm text-gray-600">
        Start exploring careers to see your applications here.
      </p>
      <Button className="mt-4" variant="primary">
        Explore Careers
      </Button>
    </div>
  )}
  
</div>

/* Key List Patterns:
- Container with white background and border
- Header section with gray background
- Dividers between items (divide-y)
- Hover states for interactivity
- Icon placeholders for visual consistency
- Status badges with color coding
- Empty states with helpful guidance
- Truncation for long text content
*/
```

### Modal/Dialog Patterns

#### Standard Modal Pattern
```tsx
// Used for: Confirmations, forms, detailed views
<div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  
  {/* Overlay */}
  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    
    {/* Modal positioning */}
    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
    {/* Modal content */}
    <div className="
      inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all
      sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
    ">
      
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Confirm Action
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to perform this action? This cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <Button type="button" variant="primary" className="w-full sm:ml-3 sm:w-auto">
          Confirm
        </Button>
        <Button type="button" variant="secondary" className="mt-3 w-full sm:mt-0 sm:w-auto">
          Cancel
        </Button>
      </div>
      
    </div>
  </div>
</div>

/* Key Modal Patterns:
- Fixed positioning with z-index
- Semi-transparent overlay
- Centered alignment with responsive behavior
- White background with shadow
- Icon for visual context
- Gray footer for actions
- Button order (primary on right for desktop)
- Proper ARIA attributes for accessibility
*/
```

## 🎨 Color Usage Decision Tree

### When to Use Each Color:

#### Primary Colors (Role-based)
```
Student Orange (#f97316):
- Primary buttons and CTAs
- Active navigation states
- Icons and accents
- Progress indicators
- Links and interactive elements

Admin Purple (#a855f7):
- Admin-specific features
- Premium/advanced functionality
- Administrative actions
- Authority-related content

Counselor Yellow (#eab308):
- Guidance and support features
- Counselor tools and interfaces
- Warm, supportive interactions
- Help and assistance elements
```

#### Supporting Colors
```
White (#ffffff):
- Card backgrounds
- Modal backgrounds
- Button text on colored backgrounds
- Maximum contrast situations

Gray Scale:
- gray-50: Page backgrounds, subtle sections
- gray-100: Dividers, subtle borders
- gray-200: Borders, inactive states
- gray-600: Secondary text
- gray-900: Primary text, headings

Status Colors:
- Green (#10b981): Success states, completed actions
- Red (#dc2626): Error states, dangerous actions
- Yellow (#f59e0b): Warning states, pending actions
- Blue (#3b82f6): Information, neutral actions
```

This comprehensive component pattern library ensures every interface element follows consistent design principles while maintaining the professional, accessible, and visually appealing aesthetic that defines Elimu Smart.