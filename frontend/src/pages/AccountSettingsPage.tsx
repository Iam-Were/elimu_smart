import React, { useState } from 'react';
import { 
  User,
  Camera,
  Edit,
  Download,
  Save,
  Settings,
  GraduationCap,
  Shield,
  FileText,
  Upload,
  Eye,
  Trash2,
  Image,
  Check,
  X,
  Circle,
  ChevronRight
} from 'lucide-react';
// import { useAuth } from '../hooks/useAuth'; // Removed unused import
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/ui/DarkModeToggle';

// Mock user data - replace with real data from context/API
const mockUserData = {
  name: 'Alex Mwangi',
  email: 'alex.mwangi@example.com',
  role: 'student',
  avatar: null,
  phone: '+254 700 123 456',
  dateOfBirth: '2005-03-15',
  location: 'Nairobi, Kenya',
  bio: 'Aspiring computer science student passionate about technology and innovation.'
};

const mockDocuments = [
  {
    id: 1,
    name: 'KCSE Certificate',
    uploadDate: '2 days ago',
    size: '2.4 MB',
    type: 'pdf'
  },
  {
    id: 2,
    name: 'School ID Photo',
    uploadDate: '1 week ago', 
    size: '1.2 MB',
    type: 'image'
  }
];

const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'academic', name: 'Academic Info', icon: GraduationCap },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log('Files selected:', files);
    }
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Profile picture selected:', file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex mb-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <li>
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="hover:text-orange-600 transition-colors duration-200"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-gray-900 dark:text-gray-100 font-medium">Account Settings</span>
                  </li>
                </ol>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Account Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your profile and preferences
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Picture Upload Section */}
              <div className="relative">
                <div className="h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {mockUserData.avatar ? (
                    <img 
                      src={mockUserData.avatar} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center text-white hover:bg-orange-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
                
                {/* Hidden file input for image upload */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-picture"
                  onChange={handleProfilePictureUpload}
                />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {mockUserData.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {mockUserData.email}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                    <Circle className="mr-1 h-2 w-2 fill-current" />
                    {mockUserData.role.charAt(0).toUpperCase() + mockUserData.role.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Member since {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
          
          {/* Profile Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={mockUserData.name}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={mockUserData.email}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={mockUserData.phone}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      defaultValue={mockUserData.dateOfBirth}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors duration-200"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      defaultValue={mockUserData.location}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors duration-200"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      defaultValue={mockUserData.bio}
                      disabled={!isEditing}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors duration-200"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button className="inline-flex items-center px-6 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Preferences
                </h2>
                
                <div className="space-y-6">
                  {/* Theme Settings */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Appearance
                    </h3>
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <label className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
                      </div>
                      <DarkModeToggle />
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <label className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about your career progress</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <label className="font-medium text-gray-900 dark:text-gray-100">Assessment Reminders</label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded to complete assessments</p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Documents & Certificates
                  </h2>
                  <button className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </button>
                </div>
                
                {/* Document Upload Area */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6">
                  <div className="space-y-4">
                    <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Upload your documents
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Drag and drop files here, or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="hidden"
                        id="document-upload"
                        onChange={handleFileUpload}
                      />
                      <label
                        htmlFor="document-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
                      >
                        Choose Files
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 5MB each)
                    </p>
                  </div>
                </div>
                
                {/* Document List */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Uploaded Documents
                  </h3>
                  
                  {mockDocuments.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          document.type === 'pdf' 
                            ? 'bg-red-100 dark:bg-red-900/30' 
                            : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          {document.type === 'pdf' ? (
                            <FileText className="h-5 w-5 text-red-600" />
                          ) : (
                            <Image className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {document.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Uploaded {document.uploadDate} • {document.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile Completion */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Profile Completion
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-orange-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full w-3/4"></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Basic info completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Profile picture uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Academic info missing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Documents not uploaded</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Account Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Assessments Taken</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Careers Explored</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">25</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sessions with Counselors</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Days Active</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">45</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AccountSettingsPage;