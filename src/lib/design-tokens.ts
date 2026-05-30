// ═══════════════════════════════════════════════════════════
// TRACEON — Design Tokens
// Centralized constants for programmatic use
// ═══════════════════════════════════════════════════════════

export const colors = {
  navy: {
    deep: "#0B2447",
    mid: "#19376D",
    light: "#1E3A5F",
  },
  royal: {
    blue: "#576CBC",
    light: "#6B7FD0",
    dark: "#4A5FB0",
  },
  sky: {
    blue: "#A5D7E8",
    light: "#BDE4F0",
    dark: "#8BC5D8",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B0BEC5",
    muted: "#64748B",
  },
  semantic: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#E53E3E",
    info: "#3B82F6",
  },
} as const;

export const stages = [
  { number: 1, name: "Rough Diamond Entry", icon: "gem", shortName: "Rough Entry" },
  { number: 2, name: "Rough Assort & Estimation", icon: "search", shortName: "Assort" },
  { number: 3, name: "Packet Creation / Barcode Labeling", icon: "package", shortName: "Packet / Barcode" },
  { number: 5, name: "Digital Imaging", icon: "camera", shortName: "Imaging" },
  { number: 6, name: "Galaxy Planning", icon: "scan", shortName: "Galaxy" },
  { number: 7, name: "DiaDNA", icon: "fingerprint", shortName: "DiaDNA" },
  { number: 10, name: "Laser & Sawing", icon: "zap", shortName: "Laser" },
  { number: 11, name: "Blocking, Bruting, Auto Polish", icon: "box", shortName: "Blocking" },
  { number: 12, name: "Polishing", icon: "sparkles", shortName: "Polishing" },
  { number: 13, name: "Final Grading", icon: "award", shortName: "Grading" },
  { number: 14, name: "Final Photo / Video", icon: "image", shortName: "Media" },
] as const;

export const roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
  USER: "USER",
} as const;

export type Role = (typeof roles)[keyof typeof roles];

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EMPLOYEE: "Employee",
  USER: "Public User",
};

export const roleColors: Record<Role, string> = {
  SUPER_ADMIN: "#E53E3E",
  ADMIN: "#576CBC",
  EMPLOYEE: "#10B981",
  USER: "#A5D7E8",
};

export const breakpoints = {
  mobileS: 375,
  mobileL: 767,
  tablet: 1023,
  desktop: 1439,
  desktopXL: 1440,
} as const;

export const diamondShapes = [
  "Round",
  "Princess",
  "Oval",
  "Emerald",
  "Cushion",
  "Pear",
  "Marquise",
  "Radiant",
  "Asscher",
  "Heart",
] as const;

export const colorGrades = [
  "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
] as const;

export const clarityGrades = [
  "FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3",
] as const;

export const cutGrades = [
  "Excellent", "Very Good", "Good", "Fair", "Poor",
] as const;

export const qcStatuses = ["PASS", "FAIL", "PENDING"] as const;
