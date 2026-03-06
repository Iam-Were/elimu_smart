import React, { useState, useEffect } from 'react';
import { getParse } from '@/config/parse';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { AddProjectDialog } from './AddProjectDialog';
import { AddExperienceDialog } from './AddExperienceDialog';
import { AddSkillsDialog } from './AddSkillsDialog';
import {
  Github,
  ExternalLink,
  Plus,
  Briefcase,
  FolderOpen,
  Zap,
  ChevronRight,
  Calendar,
  Building2,
  Loader2,
  Code2,
} from 'lucide-react';

interface ProfileProject {
  id: string;
  title: string;
  type: string;
  status: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
}

interface ProfileExperience {
  id: string;
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate?: string | null;
  current?: boolean;
  description: string;
}

interface ProfileSkill {
  id?: string;
  name: string;
  category: string;
  level: number;
}

interface ProfilePortfolioTabProps {
  userRiasecType?: string;
}

const STATUS_COLORS: Record<string, string> = {
  'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-orange-100 text-orange-700 border-orange-200',
  'On Hold': 'bg-slate-100 text-slate-600 border-slate-200',
};

const LEVEL_LABEL: Record<number, string> = {
  25: 'Beginner',
  50: 'Intermediate',
  75: 'Advanced',
  100: 'Expert',
};

function getLevelLabel(level: number): string {
  const closest = [25, 50, 75, 100].reduce((a, b) =>
    Math.abs(b - level) < Math.abs(a - level) ? b : a
  );
  return LEVEL_LABEL[closest] ?? 'Intermediate';
}

function formatDateRange(start?: string, end?: string | null, current?: boolean): string {
  if (!start) return '';
  const fmt = (d: string) => {
    const [year, month] = d.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
  };
  return `${fmt(start)} – ${current || !end ? 'Present' : fmt(end)}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Technical Skills': 'from-blue-500 to-cyan-500',
  'Communication': 'from-violet-500 to-purple-500',
  'Leadership': 'from-amber-500 to-orange-500',
  'Critical Thinking': 'from-teal-500 to-emerald-500',
  'Creativity': 'from-pink-500 to-rose-500',
  'Teamwork': 'from-indigo-500 to-blue-500',
  'Problem Solving': 'from-orange-500 to-red-500',
  'Time Management': 'from-green-500 to-teal-500',
  'Research': 'from-sky-500 to-blue-500',
  'Other': 'from-slate-400 to-slate-500',
};

function getCategoryGradient(category: string): string {
  return CATEGORY_COLORS[category] ?? 'from-orange-500 to-amber-500';
}

export const ProfilePortfolioTab: React.FC<ProfilePortfolioTabProps> = ({ userRiasecType }) => {
  const [projects, setProjects] = useState<ProfileProject[]>([]);
  const [experience, setExperience] = useState<ProfileExperience[]>([]);
  const [skills, setSkills] = useState<ProfileSkill[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingExperience, setLoadingExperience] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);

  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddSkills, setShowAddSkills] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const Parse = await getParse();
        const [projRes, expRes, skillRes] = await Promise.allSettled([
          Parse.Cloud.run('getUserProjects') as Promise<{ success: boolean; projects: ProfileProject[] }>,
          Parse.Cloud.run('getUserExperience') as Promise<{ success: boolean; experiences: ProfileExperience[] }>,
          Parse.Cloud.run('getUserProfileSkills') as Promise<{ success: boolean; skills: ProfileSkill[] }>,
        ]);
        if (projRes.status === 'fulfilled' && projRes.value.success) setProjects(projRes.value.projects);
        if (expRes.status === 'fulfilled' && expRes.value.success) setExperience(expRes.value.experiences);
        if (skillRes.status === 'fulfilled' && skillRes.value.success) setSkills(skillRes.value.skills);
      } catch {
        // silently degrade
      } finally {
        setLoadingProjects(false);
        setLoadingExperience(false);
        setLoadingSkills(false);
      }
    };
    load();
  }, []);

  const groupedSkills = skills.reduce<Record<string, ProfileSkill[]>>((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-10">

      {/* ── PROJECTS ──────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground leading-none">Projects</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Work you've built</p>
            </div>
            {projects.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{projects.length}</Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddProject(true)}
            className="gap-1.5 text-xs h-8 border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </Button>
        </div>

        {loadingProjects ? (
          <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading projects…</span>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<Code2 className="w-8 h-8 text-orange-300" />}
            title="No projects yet"
            message="Add a project to show counselors and universities what you can build."
            action={{ label: 'Add your first project', onClick: () => setShowAddProject(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* ── EXPERIENCE ────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground leading-none">Experience</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Internships & roles</p>
            </div>
            {experience.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{experience.length}</Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddExperience(true)}
            className="gap-1.5 text-xs h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Experience
          </Button>
        </div>

        {loadingExperience ? (
          <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading experience…</span>
          </div>
        ) : experience.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-8 h-8 text-blue-300" />}
            title="No experience added"
            message="Internships, volunteer work, and part-time jobs all count — add yours."
            action={{ label: 'Add experience', onClick: () => setShowAddExperience(true) }}
          />
        ) : (
          <div className="relative">
            {/* timeline line */}
            <div className="absolute left-4 top-3 bottom-3 w-px bg-gradient-to-b from-blue-300 via-indigo-200 to-transparent" />
            <div className="space-y-4">
              {experience.map(exp => (
                <ExperienceRow key={exp.id} exp={exp} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── SKILLS ────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-foreground leading-none">Skills</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Your capabilities</p>
            </div>
            {skills.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">{skills.length}</Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddSkills(true)}
            className="gap-1.5 text-xs h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Skills
          </Button>
        </div>

        {loadingSkills ? (
          <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading skills…</span>
          </div>
        ) : skills.length === 0 ? (
          <EmptyState
            icon={<Zap className="w-8 h-8 text-emerald-300" />}
            title="No skills added"
            message="Add your technical and soft skills — we'll suggest some based on your RIASEC profile."
            action={{ label: 'Add skills', onClick: () => setShowAddSkills(true) }}
          />
        ) : (
          <div className="space-y-5">
            {Object.entries(groupedSkills).map(([category, catSkills]) => (
              <SkillCategory
                key={category}
                category={category}
                skills={catSkills}
                gradient={getCategoryGradient(category)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── DIALOGS ──────────────────────────────── */}
      <AddProjectDialog
        isOpen={showAddProject}
        onClose={() => setShowAddProject(false)}
        onSuccess={p => setProjects(prev => [p, ...prev])}
      />
      <AddExperienceDialog
        isOpen={showAddExperience}
        onClose={() => setShowAddExperience(false)}
        onSuccess={e => setExperience(prev => [e, ...prev])}
      />
      <AddSkillsDialog
        isOpen={showAddSkills}
        onClose={() => setShowAddSkills(false)}
        onSuccess={newSkills => setSkills(prev => [...prev, ...newSkills])}
        existingSkills={skills}
        userRiasecType={userRiasecType}
        userProjects={projects}
      />
    </div>
  );
};

/* ── Sub-components ───────────────────────────────────── */

function ProjectCard({ project }: { project: ProfileProject }) {
  return (
    <div className="group border border-border rounded-xl p-4 hover:border-orange-200 hover:shadow-sm transition-all bg-card">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground truncate">{project.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{project.type}</p>
        </div>
        <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[project.status] ?? STATUS_COLORS['In Progress']}`}>
          {project.status}
        </span>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
        {project.description}
      </p>

      {project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, 5).map(tech => (
            <span key={tech} className="text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-100 px-1.5 py-0.5 rounded">
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="text-[10px] text-muted-foreground px-1">+{project.technologies.length - 5}</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Code</span>
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-orange-600 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live</span>
          </a>
        )}
        {project.startDate && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground ml-auto">
            <Calendar className="w-3 h-3" />
            {formatDateRange(project.startDate, project.endDate)}
          </span>
        )}
      </div>
    </div>
  );
}

function ExperienceRow({ exp }: { exp: ProfileExperience }) {
  return (
    <div className="relative pl-10">
      {/* dot */}
      <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-blue-400 bg-background" />
      <div className="border border-border rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all bg-card">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h4 className="font-semibold text-sm text-foreground">{exp.title}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{exp.company}</span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs text-muted-foreground">{exp.type}</span>
            </div>
          </div>
          {exp.current && (
            <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Current
            </span>
          )}
        </div>

        {(exp.startDate) && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-2">
            <Calendar className="w-3 h-3" />
            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {exp.description}
        </p>
      </div>
    </div>
  );
}

function SkillCategory({ category, skills, gradient }: { category: string; skills: ProfileSkill[]; gradient: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`} />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{category}</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="space-y-2">
        {skills.map(skill => (
          <div key={skill.name} className="flex items-center gap-3">
            <span className="text-sm text-foreground w-36 shrink-0 truncate">{skill.name}</span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground w-20 text-right shrink-0">
              {getLevelLabel(skill.level)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action: { label: string; onClick: () => void };
}) {
  return (
    <div className="border border-dashed border-border rounded-xl p-8 flex flex-col items-center text-center gap-3">
      <div className="opacity-60">{icon}</div>
      <div>
        <p className="font-medium text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">{message}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={action.onClick}
        className="gap-1.5 text-xs mt-1"
      >
        <ChevronRight className="w-3.5 h-3.5" />
        {action.label}
      </Button>
    </div>
  );
}
