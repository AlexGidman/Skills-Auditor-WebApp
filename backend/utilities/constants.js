const ADMIN = "Admin";
const MANAGER_SR = "Manager";
const STAFF_USER = "StaffUser";

module.exports = {
    ADMIN,
    MANAGER_SR,
    STAFF_USER,
    SYSTEM_ROLE: [ADMIN, MANAGER_SR, STAFF_USER],
    JOB_ROLE: ["Manager", "Senior Developer", "Mid-Level Developer"],
    LOGIN_USER_ID: null,
    JWT_EXPIRES_IN: "24h", // 24 Hours
};
