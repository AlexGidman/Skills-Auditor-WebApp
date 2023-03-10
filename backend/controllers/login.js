const {
    passwordsMatch,
    generateAccessToken,
    formatErrorResponse,
} = require("../utilities/utility");
const constants = require("../utilities/constants");
const db = require("../models");
const User = db.user;

const login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        if (!email | !password) {
            throw new Error("Essential fields missing");
        }

        const user = await User.findOne({
            where: { email: email },
            attributes: { include: ["id", "password"] },
        });
        if (!user) {
            throw new Error("Unable to find User with email " + email);
        }

        if (!(await passwordsMatch(user.password, password))) {
            throw new Error("Incorrect password");
        }

        const token = generateAccessToken(user["id"]);
        constants.LOGIN_userId = user["id"];

        res.status(200).json({
            token: `Bearer ${token}`,
            id: constants.LOGIN_userId,
        });
    } catch (error) {
        formatErrorResponse(res, 400, { message: error.message });
    }
};

module.exports = { login };
