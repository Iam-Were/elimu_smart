/* ELIMU SMART DESIGN SYSTEM - MANTINE THEME CONFIGURATION */
/* Copy this file to your new project's /theme/mantineTheme.js */

import { createTheme } from "@mantine/core";

export const mantineTheme = createTheme({
  // Use system font stack for better performance
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace:
    'SFMono-Regular, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',

  // Base font size matches CSS custom property
  fontSizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px - Base size
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
  },

  // Line heights for readability
  lineHeights: {
    xs: 1.4,
    sm: 1.45,
    md: 1.55,
    lg: 1.6,
    xl: 1.65,
  },

  // Spacing system aligned with CSS variables (8px grid)
  spacing: {
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
  },

  // Border radius system
  radius: {
    xs: "calc(var(--radius) - 4px)",
    sm: "calc(var(--radius) - 2px)",
    md: "var(--radius)",
    lg: "calc(var(--radius) + 2px)",
    xl: "calc(var(--radius) + 4px)",
  },

  // Color palette with role-based theming
  colors: {
    // Student theme colors (Orange)
    primary: [
      "#fef9e7", // 50
      "#fed7aa", // 100
      "#fdba74", // 200
      "#fb923c", // 300
      "#f97316", // 400 - Primary
      "#ea580c", // 500
      "#dc2626", // 600
      "#b91c1c", // 700
      "#991b1b", // 800
      "#7f1d1d", // 900
    ],

    // Admin theme colors (Purple/Violet)
    admin: [
      "#faf5ff", // 50
      "#f3e8ff", // 100
      "#e9d5ff", // 200
      "#d8b4fe", // 300
      "#a855f7", // 400 - Primary
      "#9333ea", // 500
      "#7c3aed", // 600
      "#6d28d9", // 700
      "#5b21b6", // 800
      "#4c1d95", // 900
    ],

    // Counselor theme colors (Yellow)
    counselor: [
      "#fefce8", // 50
      "#fef3c7", // 100
      "#fde047", // 200
      "#facc15", // 300
      "#eab308", // 400 - Primary
      "#ca8a04", // 500
      "#a16207", // 600
      "#854d0e", // 700
      "#713f12", // 800
      "#52341b", // 900
    ],

    // System colors
    success: [
      "#f0fdf4",
      "#dcfce7",
      "#bbf7d0",
      "#86efac",
      "#4ade80",
      "#22c55e",
      "#16a34a",
      "#15803d",
      "#166534",
      "#14532d",
    ],

    warning: [
      "#fffbeb",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#fbbf24",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f",
    ],

    error: [
      "#fef2f2",
      "#fecaca",
      "#fca5a5",
      "#f87171",
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
      "#6b1e1e",
    ],

    info: [
      "#f0f9ff",
      "#e0f2fe",
      "#bae6fd",
      "#7dd3fc",
      "#38bdf8",
      "#0ea5e9",
      "#0284c7",
      "#0369a1",
      "#075985",
      "#0c4a6e",
    ],
  },

  // Default to primary color (will be overridden by role theming)
  primaryColor: "primary",
  primaryShade: 4,

  // Default radius
  defaultRadius: "md",

  // Shadow system
  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
  },

  // Component-specific overrides
  components: {
    Button: {
      defaultProps: {
        size: "md",
      },
      styles: (theme) => ({
        root: {
          fontWeight: 500,
          borderRadius: "var(--radius)",
          transition: "all 150ms ease-out",

          // Use CSS custom properties for theming
          '&[data-variant="filled"]': {
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "1px solid var(--primary)",

            "&:hover": {
              backgroundColor: "var(--primary)",
              opacity: 0.9,
              transform: "translateY(-1px)",
            },
          },

          '&[data-variant="outline"]': {
            backgroundColor: "transparent",
            color: "var(--primary)",
            border: "1px solid var(--primary)",

            "&:hover": {
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
            },
          },

          '&[data-variant="subtle"]': {
            backgroundColor: "var(--secondary)",
            color: "var(--secondary-foreground)",
            border: "1px solid transparent",

            "&:hover": {
              backgroundColor: "var(--muted)",
            },
          },
        },
      }),
    },

    Card: {
      styles: (theme) => ({
        root: {
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 300ms ease-out",
          },
        },
      }),
    },

    TextInput: {
      styles: (theme) => ({
        input: {
          backgroundColor: "var(--input-background)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
          borderRadius: "var(--radius)",

          "&:focus": {
            borderColor: "var(--primary)",
            boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)",
          },
        },

        label: {
          color: "var(--foreground)",
          fontWeight: 500,
          marginBottom: "0.5rem",
        },

        description: {
          color: "var(--muted-foreground)",
          fontSize: "0.875rem",
        },

        error: {
          color: "var(--destructive)",
          fontSize: "0.875rem",
        },
      }),
    },

    Paper: {
      styles: (theme) => ({
        root: {
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
        },
      }),
    },

    Modal: {
      styles: (theme) => ({
        content: {
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
        },

        header: {
          backgroundColor: "var(--card)",
          borderBottom: "1px solid var(--border)",
        },
      }),
    },

    Alert: {
      styles: (theme) => ({
        root: {
          borderRadius: "var(--radius)",

          '&[data-color="red"]': {
            backgroundColor: "var(--destructive)",
            color: "var(--destructive-foreground)",
          },

          '&[data-color="green"]': {
            backgroundColor: "var(--success)",
            color: "var(--success-foreground)",
          },

          '&[data-color="yellow"]': {
            backgroundColor: "var(--warning)",
            color: "var(--warning-foreground)",
          },

          '&[data-color="blue"]': {
            backgroundColor: "var(--info)",
            color: "var(--info-foreground)",
          },
        },
      }),
    },

    Progress: {
      styles: (theme) => ({
        root: {
          backgroundColor: "var(--muted)",
          borderRadius: "var(--radius)",
        },

        bar: {
          backgroundColor: "var(--primary)",
          borderRadius: "var(--radius)",
        },
      }),
    },

    Badge: {
      styles: (theme) => ({
        root: {
          borderRadius: "calc(var(--radius) - 2px)",
          fontWeight: 500,

          '&[data-variant="filled"]': {
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          },

          '&[data-variant="outline"]': {
            backgroundColor: "transparent",
            color: "var(--primary)",
            border: "1px solid var(--primary)",
          },
        },
      }),
    },

    Tabs: {
      styles: (theme) => ({
        tab: {
          color: "var(--muted-foreground)",
          borderBottomColor: "transparent",

          "&[data-active]": {
            color: "var(--primary)",
            borderBottomColor: "var(--primary)",
          },

          "&:hover": {
            color: "var(--foreground)",
          },
        },
      }),
    },

    Notification: {
      styles: (theme) => ({
        root: {
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
        },
      }),
    },
  },

  // Custom utilities for role-based theming
  other: {
    // Helper function to get role-specific colors
    getRoleColor: (role) => {
      switch (role?.toLowerCase()) {
        case "admin":
        case "super_admin":
          return "var(--admin-primary)";
        case "counselor":
        case "career_counselor":
          return "var(--counselor-primary)";
        default:
          return "var(--primary)";
      }
    },

    // Helper function to get role-specific secondary colors
    getRoleSecondary: (role) => {
      switch (role?.toLowerCase()) {
        case "admin":
        case "super_admin":
          return "var(--admin-secondary)";
        case "counselor":
        case "career_counselor":
          return "var(--counselor-secondary)";
        default:
          return "var(--secondary)";
      }
    },

    // Helper function to get role-specific muted colors
    getRoleMuted: (role) => {
      switch (role?.toLowerCase()) {
        case "admin":
        case "super_admin":
          return "var(--admin-muted)";
        case "counselor":
        case "career_counselor":
          return "var(--counselor-muted)";
        default:
          return "var(--muted)";
      }
    },

    // Get theme-aware styles
    getThemeStyles: (role) => ({
      primary: {
        backgroundColor: this.getRoleColor(role),
        color: "var(--primary-foreground)",
      },
      secondary: {
        backgroundColor: this.getRoleSecondary(role),
        color: "var(--secondary-foreground)",
      },
      muted: {
        backgroundColor: this.getRoleMuted(role),
        color: "var(--muted-foreground)",
      },
    }),

    // Breakpoints for responsive design
    breakpoints: {
      xs: "36em", // 576px
      sm: "40em", // 640px
      md: "48em", // 768px
      lg: "64em", // 1024px
      xl: "80em", // 1280px
    },
  },
});

// Export default theme
export default mantineTheme;

// Helper function to apply role-based theme to document
export const applyRoleTheme = (role) => {
  // Remove existing theme classes
  document.body.className = document.body.className.replace(/theme-\w+/g, "");

  // Add smooth transition
  document.body.style.transition = "all 0.3s ease-in-out";

  // Apply role-specific theme class
  if (role === "admin" || role === "super_admin") {
    document.body.classList.add("theme-admin");
  } else if (role === "counselor" || role === "career_counselor") {
    document.body.classList.add("theme-counselor");
  }
  // Student theme is default (no class needed)

  // Remove transition after animation completes
  setTimeout(() => {
    document.body.style.transition = "";
  }, 300);
};

// Helper function to get current theme class
export const getCurrentTheme = () => {
  if (document.body.classList.contains("theme-admin")) return "admin";
  if (document.body.classList.contains("theme-counselor")) return "counselor";
  return "student";
};

// Helper function to create role-specific Mantine provider props
export const getMantineProviderProps = (role) => ({
  theme: {
    ...mantineTheme,
    primaryColor:
      role === "admin"
        ? "admin"
        : role === "counselor"
          ? "counselor"
          : "primary",
  },
});
