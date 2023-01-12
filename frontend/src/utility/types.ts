export const SYSTEM_ROLES = ["StaffUser", "Manager", "Admin"];
export const STAFF_USER = SYSTEM_ROLES[0];
export const MANAGER_SR = SYSTEM_ROLES[1];
export const ADMIN = SYSTEM_ROLES[2];

export const JOB_ROLES = ["Mid-Level Developer", "Senior Developer", "Manager"];
export const MIDLEVEL_DEVELOPER = JOB_ROLES[0];
export const SENIOR_DEVELOPER = JOB_ROLES[1];
export const MANAGER_JR = JOB_ROLES[2];

export const TOKEN_COOKIE = "token";

// Week in seconds
export const TOKEN_LIFE = 60 * 60 * 24 * 7;

export const SKILL_LEVELS = ["None", "Basic", "Intermediate", "High", "Expert"];
export const NONE = SKILL_LEVELS[0];
export const BASIC = SKILL_LEVELS[1];
export const INTERMEDIATE = SKILL_LEVELS[2];
export const HIGH = SKILL_LEVELS[3];
export const EXPERT = SKILL_LEVELS[4];

export type User = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
