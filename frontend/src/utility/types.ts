export const systemRoleS = ["StaffUser", "Manager", "Admin"];
export const STAFF_USER = systemRoleS[0];
export const MANAGER_SR = systemRoleS[1];
export const ADMIN = systemRoleS[2];

export const jobRoleS = ["Mid-Level Developer", "Senior Developer", "Manager"];
export const MIDLEVEL_DEVELOPER = jobRoleS[0];
export const SENIOR_DEVELOPER = jobRoleS[1];
export const MANAGER_JR = jobRoleS[2];

export const TOKEN_COOKIE = "token";

// Week in seconds
export const TOKEN_LIFE = 60 * 60 * 24 * 7;

export const skillLevelS = ["None", "Basic", "Intermediate", "High", "Expert"];
export const NONE = skillLevelS[0];
export const BASIC = skillLevelS[1];
export const INTERMEDIATE = skillLevelS[2];
export const HIGH = skillLevelS[3];
export const EXPERT = skillLevelS[4];

export type Category = {
    id: string;
    name: string;
};

export type User = {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    jobRole: string; // TODO change this when type changes
    systemRole: string; // TODO change this when type changes
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
