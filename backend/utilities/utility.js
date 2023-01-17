const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { user, directReport } = require("../models");
const constants = require("../utilities/constants");

function formatErrorResponse(res, code, error) {
    console.warn(error);
    const message =
        error.name && error.name.includes("Sequelize") ? "Database error" : error.message;

    const err = {
        error: {
            status: code,
            message: message,
        },
    };
    return res.status(code).send(err);
}

function notValidUser(user) {
    if (
        !user.firstName ||
        !user.lastName ||
        !user.email ||
        !user.password ||
        !user.systemRole ||
        !user.jobRole
    ) {
        return true;
    }
    return false;
}

async function checkRegisteredRelationship(model, predicate) {
    const duplicate = await model.findOne(predicate);
    if (duplicate) {
        throw new Error("Manager assignment error: A relationship has already been made");
    }
}

async function checkForDuplicateEntry(model, predicate) {
    const duplicate = await model.findOne(predicate);
    if (duplicate) {
        throw new Error("Duplicate Entry");
    }
}

function stringIsValidLength(item, min, max) {
    const lengthOfItem = item.length;
    return lengthOfItem >= min && lengthOfItem <= max;
}

const hashingOptions = { type: argon2.argon2id, memoryCost: 15360 }; // defaults - parallelism: 1, timeCost: 3 (iterations)

async function getPasswordHash(passwordText) {
    return await argon2.hash(passwordText, hashingOptions);
}

async function passwordsMatch(hash, passwordText) {
    return await argon2.verify(hash, passwordText, hashingOptions);
}

function generateAccessToken(id) {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: constants.JWT_EXPIRES_IN });
}

function checkToken(req, res, next) {
    const token = extractToken(req);
    if (!token || !constants.LOGIN_userId) {
        return formatErrorResponse(res, 401, "Authorisation required");
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return formatErrorResponse(res, 403, "Invalid Credentials");
        }
        req.tokenData = decoded;

        // Additional check token userId matched LOGIN_userId so that our current checks are validated
        if (decoded.id != constants.LOGIN_userId) {
            return formatErrorResponse(res, 403, "No Access");
        }
        res.locals.userId = decoded.id;

        next();
    });
}

function extractToken(req) {
    const authHeader = req.headers["authorization"];
    return authHeader && authHeader.split(" ")[1];
}

async function actionIsPermittedBySystemRole(userId, systemRoleArray) {
    try {
        const requestingUser = await user.findByPk(userId);
        if (!requestingUser) return false;
        for (const permittedSystemRole of systemRoleArray) {
            if (requestingUser.systemRole === permittedSystemRole) {
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}

async function isUserOrDirectReportOfUser(requestingUserId, actionableUserId) {
    if (requestingUserId.toString() === actionableUserId.toString()) return true;
    try {
        const requestingUserDirectReports = await directReport.findAll({
            where: { userId: requestingUserId },
        });
        if (!requestingUserDirectReports || !requestingUserDirectReports.length) return false;
        for (const report of requestingUserDirectReports) {
            if (report.reportId.toString() === actionableUserId.toString()) {
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = {
    formatErrorResponse,
    notValidUser,
    checkRegisteredRelationship,
    checkForDuplicateEntry,
    getPasswordHash,
    passwordsMatch,
    stringIsValidLength,
    generateAccessToken,
    checkToken,
    extractToken,
    actionIsPermittedBySystemRole,
    isUserOrDirectReportOfUser,
};
