import React from 'react';
import { AdminContentManagementCards } from '@/components/cards/AdminContentManagementCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Info } from 'lucide-react';

export const AdminContentManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <Database className="h-8 w-8" />
            </div>
            Content Management Portal
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all educational content, assessments, and platform data
          </p>
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Info className="h-5 w-5" />
              Content Management System
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800">
            <p>
              This portal provides centralized management for all platform content. All data is stored in
              the Parse Server database with PostgreSQL, making it dynamically updatable through Parse Dashboard
              or these admin interfaces.
            </p>
            <div className="mt-3 space-y-1">
              <p><strong>Recent Migrations:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Phase 1: 42 Universities + 156 Courses</li>
                <li>Phase 2: 42 Career profiles with full Kenya context</li>
                <li>Phase 3: 37 Subject-to-Career mappings</li>
                <li>Phase 4: 132 Assessment questions (RIASEC + Skills)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Content Management Cards */}
        <AdminContentManagementCards />
      </div>
    </div>
  );
};

export default AdminContentManagementPage;
