export const SYSTEM_ROLES = ["StaffUser", "Manager", "Admin"] as const;
export const STAFF_USER = SYSTEM_ROLES[0];
export const MANAGER_SR = SYSTEM_ROLES[1];
export const ADMIN = SYSTEM_ROLES[2];

export const JOB_ROLES = ["Mid-Level Developer", "Senior Developer", "Manager"] as const;
export const MIDLEVEL_DEVELOPER = JOB_ROLES[0];
export const SENIOR_DEVELOPER = JOB_ROLES[1];
export const MANAGER_JR = JOB_ROLES[2];

export const TOKEN_COOKIE = "token";

// 1 Week in seconds
export const TOKEN_LIFE = 60 * 60 * 24 * 7;

export const SKILL_LEVELS = ["None", "Basic", "Intermediate", "High", "Expert"] as const;
export const NONE = SKILL_LEVELS[0];
export const BASIC = SKILL_LEVELS[1];
export const INTERMEDIATE = SKILL_LEVELS[2];
export const HIGH = SKILL_LEVELS[3];
export const EXPERT = SKILL_LEVELS[4];

export type Category = {
    id: string;
    name: string;
};

export type User = {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    jobRole: typeof JOB_ROLES[number];
    systemRole: typeof SYSTEM_ROLES[number];
};

export type DirectReport = {
    id: string;
    report: User;
};

export type Skill = {
    id: string;
    name: string;
    categoryId: string;
    category: Category;
};

export type StaffSkill = {
    id: string;
    userId: string;
    skillId: string;
    skill: Skill;
    skillLevel: string;
    notes: string;
    expiryDate: string;
};
