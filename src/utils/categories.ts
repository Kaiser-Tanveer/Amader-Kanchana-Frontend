import {
  Route,
  Droplets,
  Waves,
  Lightbulb,
  Trash2,
  GraduationCap,
  HeartPulse,
  Trees,
  Leaf,
  Users,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface IssueCategoryConfig {
  key: string;
  translationKey: string;
  icon: LucideIcon;
  color: string;
}

// Central, configurable list of issue categories.
// Add/remove here rather than hardcoding category strings across components.
export const ISSUE_CATEGORIES: IssueCategoryConfig[] = [
  { key: "roads", translationKey: "issues:categories.roads", icon: Route, color: "#6b7280" },
  { key: "waterlogging", translationKey: "issues:categories.waterlogging", icon: Waves, color: "#2563eb" },
  { key: "water", translationKey: "issues:categories.water", icon: Droplets, color: "#0ea5e9" },
  { key: "streetlight", translationKey: "issues:categories.streetlight", icon: Lightbulb, color: "#f59e0b" },
  { key: "waste", translationKey: "issues:categories.waste", icon: Trash2, color: "#78716c" },
  { key: "education", translationKey: "issues:categories.education", icon: GraduationCap, color: "#7c3aed" },
  { key: "health", translationKey: "issues:categories.health", icon: HeartPulse, color: "#dc2626" },
  { key: "playground", translationKey: "issues:categories.playground", icon: Trees, color: "#16a34a" },
  { key: "environment", translationKey: "issues:categories.environment", icon: Leaf, color: "#15803d" },
  { key: "social", translationKey: "issues:categories.social", icon: Users, color: "#db2777" },
  { key: "other", translationKey: "issues:categories.other", icon: MoreHorizontal, color: "#525252" },
];

export const getIssueCategory = (key: string): IssueCategoryConfig =>
  ISSUE_CATEGORIES.find((c) => c.key === key) ?? ISSUE_CATEGORIES[ISSUE_CATEGORIES.length - 1];

export const ISSUE_STATUSES = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "VERIFIED",
  "FORWARDED",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
] as const;

export const INSTITUTION_CATEGORIES = [
  "school",
  "college",
  "madrasa",
  "mosque",
  "temple",
  "health",
  "market",
  "playground",
  "community",
  "other",
] as const;
