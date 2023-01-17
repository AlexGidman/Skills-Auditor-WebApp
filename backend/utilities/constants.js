const ADMIN = "Admin";
const MANAGER_SR = "Manager";
const STAFF_USER = "StaffUser";

module.exports = {
    ADMIN,
    MANAGER_SR,
    STAFF_USER,
    systemRole: [ADMIN, MANAGER_SR, STAFF_USER],
    jobRole: ["Manager", "Senior Developer", "Mid-Level Developer"],
    LOGIN_userId: null,
    JWT_EXPIRES_IN: "24h", // 24 Hours
};
