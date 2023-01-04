const router = require("../routes/login");
const utilities = require("../utilities/utility");
const constants = require("../utilities/constants");
const db = require("../models");
const User = db.user;

login = async (req, res) => {
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

        if (!(await utilities.passwordsMatch(user.password, password))) {
            throw new Error("Incorrect password");
        }

        const token = utilities.generateAccessToken(user["id"]);
        constants.LOGIN_USER_ID = user["id"];

        res.status(200).json({
            token: `Bearer ${token}`,
            id: constants.LOGIN_USER_ID,
        });
    } catch (error) {
        utilities.formatErrorResponse(res, 400, { message: error.message });
    }
};

module.exports = { login };
