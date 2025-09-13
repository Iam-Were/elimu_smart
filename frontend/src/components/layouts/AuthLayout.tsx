import React, { type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useThemeContext } from '../../hooks/useThemeContext';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const { isDark, toggleDarkMode } = useThemeContext();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-5 theme-transition">
      <div className="w-full max-w-xs">
        <div className="flex flex-col items-center space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-semibold text-primary">
              Elimu Smart
            </h1>
            <p className="text-muted-foreground text-center text-sm">
              Career Guidance Platform
            </p>
          </div>

          {/* Auth Form */}
          <Card className="w-full max-w-md shadow-lg border border-border theme-transition">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <h2 className="text-xl text-center">
                    {title}
                  </h2>
                  {subtitle && (
                    <p className="text-muted-foreground text-center text-sm">
                      {subtitle}
                    </p>
                  )}
                </div>

                {children}
              </div>
            </CardContent>
          </Card>

          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-3">
            <Label htmlFor="dark-mode-toggle" className="text-sm text-muted-foreground">
              Dark Mode
            </Label>
            <Switch
              id="dark-mode-toggle"
              checked={isDark}
              onCheckedChange={toggleDarkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
