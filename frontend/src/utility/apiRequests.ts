import axios, { AxiosRequestHeaders } from "axios";

const categoryEndpoint = "/api/category";
const skillEndpoint = "/api/skill";
const userEndpoint = "/api/user";
const directReportEndpoint = "/api/directreport";
const loginEndpoint = "/api/login";
const userSkillEndpoint = "/api/userskill";

//CATEGORY
export const getAllCategories = async (authHeaders: AxiosRequestHeaders) => {
    return axios.get(categoryEndpoint, authHeaders);
};

export const getCategory = async (authHeaders: AxiosRequestHeaders, id: string) => {
    return axios.get(`${categoryEndpoint}/${id}`, authHeaders);
};

export const addCategory = async (authHeaders: AxiosRequestHeaders, name: string) => {
    const data = {
        name,
    };
    return axios.post(`${categoryEndpoint}`, data, authHeaders);
};

export const updateCategory = async (
    authHeaders: AxiosRequestHeaders,
    id: string,
    name: string,
) => {
    const data = {
        id,
        name,
    };
    return axios.put(categoryEndpoint, data, authHeaders);
};

export const deleteCategory = async (authHeaders: AxiosRequestHeaders, id: string) => {
    const data = { id };
    return axios.delete(categoryEndpoint, { ...authHeaders, data });
};

//SKILL
export const getAllSkills = async (authHeaders: AxiosRequestHeaders) => {
    return axios.get(skillEndpoint, authHeaders);
};

export const getSkill = async (authHeaders: AxiosRequestHeaders, id: string) => {
    return axios.get(`${skillEndpoint}/${id}`, authHeaders);
};

export const addSkill = async (
    authHeaders: AxiosRequestHeaders,
    name: string,
    categoryId: string,
) => {
    const data = {
        name,
        categoryId,
    };
    return axios.post(`${skillEndpoint}`, data, authHeaders);
};

export const updateSkill = async (
    authHeaders: AxiosRequestHeaders,
    id: string,
    name: string,
    categoryId: string,
) => {
    const data = {
        id,
        name,
        categoryId: categoryId,
    };
    return axios.put(skillEndpoint, data, authHeaders);
};

export const deleteSkill = async (authHeaders: AxiosRequestHeaders, id: string) => {
    const data = { id };
    return axios.delete(skillEndpoint, { ...authHeaders, data });
};

//USER
export const getUserDetails = async (authHeaders: AxiosRequestHeaders, id: string) => {
    return axios.get(`${userEndpoint}/${id}`, authHeaders);
};

export const getUserFromToken = async (authHeaders: AxiosRequestHeaders) => {
    return axios.get(`${userEndpoint}/token`, authHeaders);
};

export const updateUserDetails = async (
    authHeaders: AxiosRequestHeaders,
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    jobRole: string, // TODO: change when job role type changes
    systemRole: string, // TODO: change when job system type changes
) => {
    const data = {
        id,
        firstName,
        lastName,
        email,
        password,
        jobRole,
        systemRole,
    };

    return axios.put(`${userEndpoint}`, data, authHeaders);
};

export const addUser = async (
    authHeaders: AxiosRequestHeaders,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    jobRole: string, // TODO: change when job role type changes
    systemRole: string, // TODO: change when job system type changes
) => {
    const data = {
        firstName,
        lastName,
        email,
        password,
        jobRole,
        systemRole,
    };
    return axios.post(userEndpoint, data, authHeaders);
};

export const deleteUser = async (authHeaders: AxiosRequestHeaders, id: string) => {
    const data = { id };
    return axios.delete(userEndpoint, { ...authHeaders, data });
};

//DIRECT REPORTS
export const getAllDirectReports = async (authHeaders: AxiosRequestHeaders, id: string) => {
    return axios.get(`${directReportEndpoint}/${id}`, authHeaders);
};

export const addDirectReport = async (
    authHeaders: AxiosRequestHeaders,
    userId: string,
    reportId: string,
) => {
    const data = {
        userId: userId,
        reportId: reportId,
    };
    return axios.post(directReportEndpoint, data, authHeaders);
};

//STAFF SKILLS
export const getAllStaffSkills = async (authHeaders: AxiosRequestHeaders, id: string) => {
    return axios.get(`${userSkillEndpoint}/byuser/${id}`, authHeaders);
};

export const getStaffSkill = async (authHeaders: AxiosRequestHeaders, id: string) => {
    return axios.get(`${userSkillEndpoint}/${id}`, authHeaders);
};

export const deleteStaffSkill = async (authHeaders: AxiosRequestHeaders, id: string) => {
    const data = { id };
    return axios.delete(userSkillEndpoint, { ...authHeaders, data });
};

export const addUserSkill = async (
    authHeaders: AxiosRequestHeaders,
    userId: string,
    skillId: string,
    skillLevel: number, // TODO: chnage this when skill level type changes
    notes: string,
    expiryDate: Date,
) => {
    const data = {
        userId,
        skillId,
        skillLevel,
        notes,
        expiryDate,
    };
    return axios.post(`${userSkillEndpoint}`, data, authHeaders);
};

export const updateStaffSkill = async (
    authHeaders: AxiosRequestHeaders,
    id: string,
    skillLevel: number, // TODO: chnage this when skill level type changes
    notes: string,
) => {
    const data = {
        id,
        skillLevel,
        notes,
    };

    return axios.put(`${userSkillEndpoint}`, data, authHeaders);
};

//LOGIN

export const postLogin = async (email: string, password: string) => {
    const credentials = { email, password };
    return axios.post(`${loginEndpoint}`, credentials);
};

export const validateToken = async (authHeaders: AxiosRequestHeaders) => {
    return axios.get(`${loginEndpoint}/validate`, authHeaders);
};
