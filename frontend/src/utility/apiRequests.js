import axios from "axios";

const categoryEndpoint = "/api/category";
const skillEndpoint = "/api/skill";
const userEndpoint = "/api/user";
const directReportEndpoint = "/api/directreport";
const loginEndpoint = "/api/login";
const userSkillEndpoint = "/api/userskill";

//CATEGORY
export const getAllCategories = async (authHeaders) => {
    return axios.get(categoryEndpoint, authHeaders);
};

export const getCategory = async (authHeaders, id) => {
    return axios.get(`${categoryEndpoint}/${id}`, authHeaders);
};

export const addCategory = async (authHeaders, name) => {
    const data = {
        name,
    };
    return axios.post(`${categoryEndpoint}`, data, authHeaders);
};

export const updateCategory = async (authHeaders, id, name) => {
    const data = {
        id,
        name,
    };
    return axios.put(categoryEndpoint, data, authHeaders);
};

export const deleteCategory = async (authHeaders, id) => {
    const data = { id };
    return axios.delete(categoryEndpoint, { ...authHeaders, data });
};

//SKILL
export const getAllSkills = async (authHeaders) => {
    return axios.get(skillEndpoint, authHeaders);
};

export const getSkill = async (authHeaders, id) => {
    return axios.get(`${skillEndpoint}/${id}`, authHeaders);
};

export const addSkill = async (authHeaders, name, category_id) => {
    const data = {
        name,
        category_id,
    };
    return axios.post(`${skillEndpoint}`, data, authHeaders);
};

export const updateSkill = async (authHeaders, id, name, categoryId) => {
    const data = {
        id,
        name,
        category_id: categoryId,
    };
    return axios.put(skillEndpoint, data, authHeaders);
};

export const deleteSkill = async (authHeaders, id) => {
    const data = { id };
    return axios.delete(skillEndpoint, { ...authHeaders, data });
};

//USER
export const getUserDetails = async (authHeaders, id) => {
    return axios.get(`${userEndpoint}/${id}`, authHeaders);
};

export const getUserFromToken = async (authHeaders) => {
    return axios.get(`${userEndpoint}/token`, authHeaders);
};

export const updateUserDetails = async (
    authHeaders,
    id,
    forename,
    surname,
    email,
    password,
    job_role,
    system_role,
) => {
    const data = {
        id,
        forename,
        surname,
        email,
        password,
        job_role,
        system_role,
    };

    return axios.put(`${userEndpoint}`, data, authHeaders);
};

export const addUser = async (
    authHeaders,
    forename,
    surname,
    email,
    password,
    job_role,
    system_role,
) => {
    const data = {
        forename,
        surname,
        email,
        password,
        job_role,
        system_role,
    };
    return axios.post(userEndpoint, data, authHeaders);
};

export const deleteUser = async (authHeaders, id) => {
    const data = { id };
    return axios.delete(userEndpoint, { ...authHeaders, data });
};

//DIRECT REPORTS
export const getAllDirectReports = async (authHeaders, id) => {
    return axios.get(`${directReportEndpoint}/${id}`, authHeaders);
};

export const addDirectReport = async (authHeaders, userId, reportId) => {
    const data = {
        user_id: userId,
        report_id: reportId,
    };
    return axios.post(directReportEndpoint, data, authHeaders);
};

//STAFF SKILLS
export const getAllStaffSkills = async (authHeaders, id) => {
    return axios.get(`${userSkillEndpoint}/byuser/${id}`, authHeaders);
};

export const getStaffSkill = async (authHeaders, id) => {
    return axios.get(`${userSkillEndpoint}/${id}`, authHeaders);
};

export const deleteStaffSkill = async (authHeaders, id) => {
    const data = { id };
    return axios.delete(userSkillEndpoint, { ...authHeaders, data });
};

export const addUserSkill = async (
    authHeaders,
    user_id,
    skill_id,
    skill_level,
    notes,
    expiry_date,
) => {
    const data = {
        user_id,
        skill_id,
        skill_level,
        notes,
        expiry_date,
    };
    return axios.post(`${userSkillEndpoint}`, data, authHeaders);
};

export const updateStaffSkill = async (authHeaders, id, skill_level, notes) => {
    const data = {
        id,
        skill_level,
        notes,
    };

    return axios.put(`${userSkillEndpoint}`, data, authHeaders);
};

//LOGIN

export const postLogin = async (email, password) => {
    const credentials = { email, password };
    return axios.post(`${loginEndpoint}`, credentials);
};

export const validateToken = async (authHeaders) => {
    return axios.get(`${loginEndpoint}/validate`, authHeaders);
};
