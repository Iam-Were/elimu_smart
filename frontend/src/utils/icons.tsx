// Sprint 15: Enhanced Icon utilities with Intelligence System Integration
import type { LucideIcon } from 'lucide-react';
import { iconSizes as intelligentIconSizes, type IconSize, getRoleIconClass } from './iconIntelligence';

// Re-export enhanced icon sizes from intelligence system
export const iconSizes = intelligentIconSizes;
export type { IconSize };

// Enhanced Icon wrapper component with Universal Component DNA
interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
  ariaLabel?: string;
  ariaHidden?: boolean;
  onClick?: () => void;
  role?: 'student' | 'admin' | 'counselor';
}

export const Icon: React.FC<IconProps> = ({ 
  icon: IconComponent, 
  size = 'base', 
  className = '', 
  style,
  animate = true,
  ariaLabel,
  ariaHidden = false,
  onClick,
  role
}) => {
  const roleClass = getRoleIconClass(role);
  const animationClass = animate ? 'transition-all duration-150 hover:scale-105' : '';
  const interactiveClass = onClick ? 'cursor-pointer focus-enhanced' : '';
  
  const IconElement = (
    <IconComponent 
      className={`${iconSizes[size]} ${roleClass} ${animationClass} ${interactiveClass} ${className}`}
      style={style}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaHidden ? 'presentation' : 'img'}
    />
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="focus-enhanced p-1 rounded"
        aria-label={ariaLabel}
        type="button"
      >
        {IconElement}
      </button>
    );
  }

  return IconElement;
};

// Common icon mappings from Radix to Lucide
export {
  Home,           // HomeIcon
  Users,          // PersonIcon
  Settings,       // GearIcon
  Bell,           // BellIcon
  Search,         // MagnifyingGlassIcon
  Menu,           // HamburgerMenuIcon
  X,              // Cross1Icon
  ChevronDown,    // ChevronDownIcon
  ChevronRight,   // ChevronRightIcon
  ChevronLeft,    // ChevronLeftIcon
  Plus,           // PlusIcon
  Edit,           // Pencil1Icon
  Trash2 as Trash, // TrashIcon
  Eye,            // EyeOpenIcon
  EyeOff,         // EyeClosedIcon
  Calendar,       // CalendarIcon
  Clock,          // ClockIcon
  User,           // PersonIcon
  Mail,           // EnvelopeIcon
  Phone,          // PhoneIcon
  MapPin,         // PinIcon
  Star,           // StarIcon
  Heart,          // HeartIcon
  Share,          // Share1Icon
  Download,       // DownloadIcon
  Upload,         // UploadIcon
  Copy,           // CopyIcon
  Check,          // CheckIcon
  AlertTriangle,  // ExclamationTriangleIcon
  Info,           // InfoCircledIcon
  AlertCircle,    // CrossCircledIcon
  CheckCircle,    // CheckCircledIcon
  ArrowLeft,      // ArrowLeftIcon
  ArrowRight,     // ArrowRightIcon
  ArrowUp,        // ArrowUpIcon
  ArrowDown,      // ArrowDownIcon
  ExternalLink,   // ExternalLinkIcon
  Link,           // LinkIcon
  Unlink,         // UnlinkIcon
  Bookmark,       // BookmarkIcon
  Tag,            // BadgeIcon
  Flag,           // FlagIcon
  Archive,        // ArchiveIcon
  Folder,         // FolderIcon
  File,           // FileIcon
  FileText,       // FileTextIcon
  Image,          // ImageIcon
  Video,          // VideoIcon
  Music,          // MusicIcon
  Mic,            // MicIcon
  Camera,         // CameraIcon
  Monitor,        // DesktopIcon
  Smartphone,     // MobileIcon
  Tablet,         // TabletIcon
  Wifi,           // WifiIcon
  Battery,        // BatteryIcon
  Zap,            // LightningIcon
  Sun,            // SunIcon
  Moon,           // MoonIcon
  Cloud,          // CloudIcon
  Umbrella,       // UmbrellaIcon
  Shield,         // ShieldIcon
  Key,            // KeyIcon
  Lock,           // LockIcon
  Unlock,         // UnlockIcon
  Globe,          // GlobeIcon
  Database,       // DatabaseIcon
  Server,         // ServerIcon
  Code,           // CodeIcon
  Terminal,       // TerminalIcon
  Layers,         // LayersIcon
  Package,        // PackageIcon
  Box,            // BoxIcon
  Grid,           // GridIcon
  List,           // ListIcon
  BarChart,       // BarChartIcon
  PieChart,       // PieChartIcon
  TrendingUp,     // TrendingUpIcon
  TrendingDown,   // TrendingDownIcon
  Activity,       // ActivityLogIcon
  Award,          // BadgeIcon
  Trophy,         // TrophyIcon
  Medal,          // MedalIcon
  Gift,           // GiftIcon
  Coffee,         // CoffeeIcon
  Briefcase,      // BriefcaseIcon
  Building,       // BuildingIcon
  GraduationCap,  // SchoolIcon
  BookOpen,       // BookIcon
  Calculator,     // CalculatorIcon
  PenTool,        // PenIcon
  Scissors,       // ScissorsIcon
  Palette,        // PaletteIcon
  Brush,          // BrushIcon
  Eraser,         // EraserIcon
  Ruler,          // RulerIcon
  Compass,        // CompassIcon
  Map,            // MapIcon
  Plane,          // PlaneIcon
  Car,            // CarIcon
  Train,          // TrainIcon
  Bus,            // BusIcon
  Bike,           // BikeIcon
  Footprints,     // FootIcon
  Mountain,       // MountainIcon
  TreePine,       // TreeIcon
  Flower,         // FlowerIcon
  Leaf,           // LeafIcon
  Snowflake,      // SnowflakeIcon
  Droplets,       // DropIcon
  Flame,          // FlameIcon
  ThermometerSun, // ThermometerIcon
  Wind,           // WindIcon
  Sparkles,       // SparklesIcon
  Waves,          // WaveIcon
  Anchor,         // AnchorIcon
  Ship,           // ShipIcon
  Rocket,         // RocketIcon
  Satellite,      // SatelliteIcon
  Gamepad2 as Gamepad, // GamepadIcon
  Dice1,          // DiceIcon
  Music2 as Music2, // MusicIcon
  Headphones,     // HeadphonesIcon
  Radio,          // RadioIcon
  Tv,             // TvIcon
  Film,           // FilmIcon
  PlayCircle,     // PlayIcon
  PauseCircle,    // PauseIcon
  StopCircle,     // StopIcon
  SkipForward,    // SkipForwardIcon
  SkipBack,       // SkipBackIcon
  FastForward,    // FastForwardIcon
  Rewind,         // RewindIcon
  Repeat,         // RepeatIcon
  Shuffle,        // ShuffleIcon
  Volume2 as Volume, // VolumeIcon
  VolumeX,        // MutedIcon
  MoreHorizontal, // DotsHorizontalIcon
  MoreVertical,   // DotsVerticalIcon
} from 'lucide-react';

// Educational & Career specific icons
export {
  GraduationCap as School,     // For educational content
  BookOpen as Book,            // For courses/subjects
  Target as GoalTarget,        // For goals/objectives
  TrendingUp as Growth,        // For progress/improvement
  Award as Achievement,        // For accomplishments
  Briefcase as Career,         // For career-related content
  Building as Institution,     // For schools/organizations
  Users as Community,          // For groups/collaboration
  MessageCircle as Message,    // For communication
  HelpCircle as Help,          // For help/support
  Lightbulb as Idea,          // For insights/tips
  Compass as NavigationGuide,  // For guidance
  Bookmark as Save,           // For saved items
  Filter,                     // For filtering
  SortAsc as Sort,           // For sorting
} from 'lucide-react';

// Utility function to get icon class based on role theme
export const getIconThemeClass = (role?: string) => {
  switch (role) {
    case 'admin':
    case 'super_admin':
      return 'text-admin-400';
    case 'counselor':
    case 'career_counselor':
      return 'text-counselor-400';
    default:
      return 'text-primary-400';
  }
};

// Utility function for role-aware icon styling
export const getRoleIconStyle = (role?: string): React.CSSProperties => ({
  color: role === 'admin' 
    ? 'var(--admin-primary)' 
    : role === 'counselor' 
      ? 'var(--counselor-primary)'
      : 'var(--primary)'
});