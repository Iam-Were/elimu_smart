import React from 'react';
import { 
  Shield, 
  Users, 
  BarChart3,
  Settings,
  FileText,
  AlertTriangle,
  Database,
  Activity,
  Lock,
  Search,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPortal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Admin Purple Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl font-bold mb-4">
                System Administration Center
              </h1>
              <p className="text-purple-100 mb-6 text-lg leading-relaxed">
                Comprehensive administrative tools for managing the Elimu Smart platform, 
                monitoring system health, and ensuring optimal user experience across 
                all educational services.
              </p>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold">25K+</div>
                  <div className="text-purple-200 text-sm">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">99.9%</div>
                  <div className="text-purple-200 text-sm">System Uptime</div>
                </div>
              </div>
            </div>
            
            {/* Right Dashboard Preview */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-48 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">System Health</div>
                    <div className="text-purple-200 text-sm">All systems operational</div>
                  </div>
                </div>
                
                {/* System Status */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200 text-sm">Server Load</span>
                    <span className="text-white font-medium">32%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full transition-all duration-300" style={{ width: '32%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200 text-sm">Database Health</span>
                    <span className="text-green-400 font-medium text-sm">Excellent</span>
                  </div>
                </div>
                
                {/* Quick Action Button */}
                <button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full mt-4 bg-white text-purple-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  View Dashboard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
<span>Administration Portal</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            System Administration & Analytics
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Advanced administrative capabilities for monitoring, managing, and optimizing 
            the Elimu Smart educational platform.
          </p>
        </div>
        
        {/* Primary Admin Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* User Management */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">User Management</h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Manage user accounts, roles, permissions, and access controls across 
                the entire platform ecosystem.
              </p>
              
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">Capabilities:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Account Management</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Role Assignment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Access Control</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-6 bg-purple-50 py-2 px-3 rounded-lg">
                👥 25,000+ Active Users
              </div>
              
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Manage Users →
              </button>
            </div>
          </div>
          
          {/* System Analytics */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">System Analytics</h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Comprehensive analytics dashboard with real-time insights into platform 
                performance, user engagement, and system health.
              </p>
              
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">Analytics:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Performance Metrics</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">User Engagement</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">System Health</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-6 bg-blue-50 py-2 px-3 rounded-lg">
                📊 Real-time Dashboard
              </div>
              
              <button 
                onClick={() => navigate('/admin/analytics')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                View Analytics →
              </button>
            </div>
          </div>
          
          {/* Security Monitoring */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Security Monitoring</h3>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Advanced security monitoring with threat detection, audit logs, 
                and compliance reporting for platform safety.
              </p>
              
              <div className="space-y-2 mb-6 text-left w-full">
                <div className="text-xs text-gray-500 text-center mb-3">Security Features:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Threat Detection</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Audit Logging</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Compliance Reports</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 mb-6 bg-red-50 py-2 px-3 rounded-lg">
                🔒 24/7 Monitoring
              </div>
              
              <button 
                onClick={() => navigate('/admin/security-monitoring')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                View Security →
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Admin Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* System Configuration */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">System Config</h4>
              <p className="text-sm text-gray-600 mb-4">Platform settings and configuration management</p>
              <button 
                onClick={() => navigate('/admin/system-configuration')}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Configure →
              </button>
            </div>
          </div>

          {/* Content Moderation */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Content Moderation</h4>
              <p className="text-sm text-gray-600 mb-4">Review and moderate platform content</p>
              <button 
                onClick={() => navigate('/admin/content-moderation')}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Moderate →
              </button>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Audit Logs</h4>
              <p className="text-sm text-gray-600 mb-4">System activity and compliance logs</p>
              <button 
                onClick={() => navigate('/admin/audit-log')}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                View Logs →
              </button>
            </div>
          </div>

          {/* Maintenance Tools */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Maintenance</h4>
              <p className="text-sm text-gray-600 mb-4">System maintenance and optimization tools</p>
              <button 
                onClick={() => navigate('/admin/maintenance-tools')}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                Maintain →
              </button>
            </div>
          </div>

        </div>

        {/* Platform Overview Section */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Platform Overview & Insights
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key metrics and insights about the Elimu Smart platform performance, 
              user engagement, and system health status.
            </p>
          </div>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Growth Rate</h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">+23%</div>
              <p className="text-sm text-gray-600">Monthly active users</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Data Processing</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">1.2M</div>
              <p className="text-sm text-gray-600">Records processed daily</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">System Health</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
              <p className="text-sm text-gray-600">Uptime this month</p>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Support Tickets</h4>
              <div className="text-2xl font-bold text-orange-600 mb-1">47</div>
              <p className="text-sm text-gray-600">Open tickets</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Need Advanced Administrative Support?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Access comprehensive system management tools and get expert support for complex administrative tasks.
            </p>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="bg-white text-purple-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Access Admin Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;