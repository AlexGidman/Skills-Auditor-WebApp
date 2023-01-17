const {
    formatErrorResponse,
    actionIsPermittedBySystemRole,
    isUserOrDirectReportOfUser,
    stringIsValidLength,
    checkForDuplicateEntry,
    notValidUser,
    getPasswordHash,
} = require("../utilities/utility");
const db = require("../models");
const jwt = require("jsonwebtoken");
const constants = require("../utilities/constants");
const User = db.user;

function sanitiseUser(user) {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        systemRole: user.systemRole,
        jobRole: user.jobRole,
    };
}

const PASSWORD_MIN = 10;
const PASSWORD_MAX = 16;

function checkPasswordLength(password) {
    if (!stringIsValidLength(password, PASSWORD_MIN, PASSWORD_MAX)) {
        throw new Error(
            `Password must contain a minimum of ${PASSWORD_MIN} characters and a maximum of ${PASSWORD_MAX} characters`,
        );
    }
}

const getAll = async (req, res) => {
    try {
        if (!(await actionIsPermittedBySystemRole(res.locals.userId, [constants.ADMIN]))) {
            throw new Error("Not Permitted!");
        }
        const users = await User.findAll();
        const sanitisedUsers = users.map((user) => sanitiseUser(user));
        res.status(200).json(sanitisedUsers);
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        if (!(await isUserOrDirectReportOfUser(res.locals.userId, id))) {
            throw new Error("Not Permitted!");
        }
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error("Unable to find User with id " + id);
        }

        res.status(200).json(sanitiseUser(user));
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

const getByToken = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    try {
        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new Error("Unable to find User with id " + id);
        }

        res.status(200).json(sanitiseUser(user));
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

const create = async (req, res) => {
    let user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        systemRole: req.body.systemRole,
        jobRole: req.body.jobRole,
    };
    try {
        if (
            !(await actionIsPermittedBySystemRole(res.locals.userId, [
                constants.ADMIN,
                constants.MANAGER_SR,
            ]))
        ) {
            throw new Error("Not Permitted!");
        }
        if (notValidUser(user)) {
            throw new Error("Essential fields missing");
        }

        await checkForDuplicateEntry(User, { where: { email: user.email } });

        if (!constants.systemRole.includes(user.systemRole)) {
            throw new Error(
                "Not a valid entry for System Role: Options are Admin, Manager, StaffUser",
            );
        }

        if (!constants.jobRole.includes(user.jobRole)) {
            throw new Error(
                "Not a valid entry for Job Role: Options are Manager, Senior Developer, Mid-Level Developer",
            );
        }

        checkPasswordLength(user.password);

        // Hash Password
        user.password = await getPasswordHash(req.body.password);

        user = await User.create(user);

        res.status(201).json({ id: user.id, message: "User created" });
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

const deleting = async (req, res) => {
    const id = req.body.id;
    try {
        if (
            !(await actionIsPermittedBySystemRole(res.locals.userId, [
                constants.ADMIN,
                constants.MANAGER_SR,
            ])) ||
            !(await isUserOrDirectReportOfUser(res.locals.userId, id))
        ) {
            throw new Error("Not Permitted!");
        }
        if (!id) {
            throw new Error("Essential fields missing");
        }

        const deleted = await User.destroy({ where: { id: id } });
        if (deleted === 0) {
            throw new Error("Id not found");
        }
        res.status(200).send("User deleted");
    } catch (error) {
        formatErrorResponse(res, 404, error);
    }
};

const update = async (req, res) => {
    const id = req.body.id;
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        systemRole: req.body.systemRole,
        jobRole: req.body.jobRole,
    };
    const passwordNotSupplied = !!!req.body.password;

    try {
        if (!(await isUserOrDirectReportOfUser(res.locals.userId, id))) {
            throw new Error("Not Permitted!");
        }
        const dbUser = await User.findByPk(id);
        if (!dbUser) throw new Error(`Unable to find User with id ${id}`);

        if (passwordNotSupplied) {
            user.password = dbUser.password;
        } else {
            checkPasswordLength(user.password);
            user.password = await getPasswordHash(req.body.password);
        }

        if (notValidUser(user)) {
            throw new Error("Essential fields missing");
        }

        if (dbUser.email !== user.email) {
            await checkForDuplicateEntry(User, { where: { email: user.email } });
        }

        if (!constants.systemRole.includes(user.systemRole)) {
            throw new Error(
                "Not a valid entry for System Role: Options are Admin, Manager, StaffUser",
            );
        }

        if (!constants.jobRole.includes(user.jobRole)) {
            throw new Error(
                "Not a valid entry for Job Role: Options are Manager, Senior Developer, Mid-Level Developer",
            );
        }

        const updatedArray = await User.update(user, { where: { id: id } });
        const updatedRecordsCount = updatedArray[0];

        if (updatedRecordsCount === 0) {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error(`Unable to find User with id ${id}`);
            } else {
                throw new Error("Unable to update User - parameter values may already exist");
            }
        }

        res.status(200).json("User updated");
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

module.exports = { getAll, getById, getByToken, create, deleting, update };
