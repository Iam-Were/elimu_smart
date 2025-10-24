import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  ClipboardCheck,
  Heart,
  User,
  BookOpen,
  Users,
  MessageSquare,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Inbox,
} from 'lucide-react';

export const ModernFooter: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black border-t border-slate-800">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {/* Product Column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/assessment" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <ClipboardCheck className="w-4 h-4" />
                  Assessments
                </Link>
              </li>
              <li>
                <Link to="/guidance" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Heart className="w-4 h-4" />
                  Guidance
                </Link>
              </li>
              <li>
                <Link to="/inbox" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Inbox className="w-4 h-4" />
                  Inbox
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/guidance/resources" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <BookOpen className="w-4 h-4" />
                  Career Guides
                </Link>
              </li>
              <li>
                <Link to="/guidance/professional-networking" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Users className="w-4 h-4" />
                  Networking
                </Link>
              </li>
              <li>
                <Link to="/guidance/community-qa" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Community Q&A
                </Link>
              </li>
              <li>
                <Link to="/guidance/book-session" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Heart className="w-4 h-4" />
                  Book Session
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings/preferences" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" />
                  Settings
                </Link>
              </li>
              <li>
                <a href="mailto:support@elimu-smart.co.ke" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Mail className="w-4 h-4" />
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Elimu Smart</p>
              <p className="text-slate-500 text-xs">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://facebook.com/elimusmart"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 text-slate-400 hover:text-white" />
            </a>
            <a
              href="https://twitter.com/elimusmart"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-sky-500 flex items-center justify-center transition-all"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-slate-400 hover:text-white" />
            </a>
            <a
              href="https://linkedin.com/company/elimusmart"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-700 flex items-center justify-center transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-slate-400 hover:text-white" />
            </a>
            <a
              href="https://instagram.com/elimusmart"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-slate-400 hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
