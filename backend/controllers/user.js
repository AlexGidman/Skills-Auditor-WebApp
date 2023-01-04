const router = require("../routes/user");
const utilities = require("../utilities/utility");
const db = require("../models");
const jwt = require("jsonwebtoken");
const constants = require("../utilities/constants");
const User = db.user;

getAll = async (req, res) => {
    try {
        if (
            !(await utilities.actionIsPermittedBySystemRole(res.locals.userId, [constants.ADMIN]))
        ) {
            throw new Error("Not Permitted!");
        }
        const users = await User.findAll();
        const sanitisedUsers = users.map((user) => ({
            id: user.id,
            forename: user.forename,
            surname: user.surname,
            email: user.email,
            system_role: user.system_role,
            job_role: user.job_role,
        }));
        res.status(200).json(sanitisedUsers);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

getById = async (req, res) => {
    const id = req.params.id;
    try {
        if (!(await utilities.isUserOrDirectReportOfUser(res.locals.userId, id))) {
            throw new Error("Not Permitted!");
        }
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error("Unable to find User with id " + id);
        }

        res.status(200).json({
            id: user.id,
            forename: user.forename,
            surname: user.surname,
            email: user.email,
            system_role: user.system_role,
            job_role: user.job_role,
        });
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

getByToken = async (req, res) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    try {
        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new Error("Unable to find User with id " + id);
        }

        res.status(200).json({
            id: user.id,
            forename: user.forename,
            surname: user.surname,
            email: user.email,
            system_role: user.system_role,
            job_role: user.job_role,
        });
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

create = async (req, res) => {
    let user = {
        forename: req.body.forename,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        system_role: req.body.system_role,
        job_role: req.body.job_role,
    };
    try {
        if (
            !(await utilities.actionIsPermittedBySystemRole(res.locals.userId, [
                constants.ADMIN,
                constants.MANAGER_SR,
            ]))
        ) {
            throw new Error("Not Permitted!");
        }
        if (utilities.notValidUser(user)) {
            throw new Error("Essential fields missing");
        }

        await utilities.checkForDuplicateEntry(User, { where: { email: user.email } });

        if (!utilities.isValidItem(constants.SYSTEM_ROLE, user.system_role)) {
            throw new Error(
                "Not a valid entry for System Role: Options are Admin, Manager, StaffUser",
            );
        }

        if (!utilities.isValidItem(constants.JOB_ROLE, user.job_role)) {
            throw new Error(
                "Not a valid entry for Job Role: Options are Manager, Senior Developer, Mid-Level Developer",
            );
        }

        if (!utilities.stringIsValidLength(user.password, 10, 16)) {
            throw new Error(
                "Password must contain a minimum of 10 characters and a maximum of 16 characters",
            );
        }

        // Hash Password
        user.password = await utilities.getPasswordHash(req.body.password);

        user = await User.create(user);

        res.status(201).json({ id: user.id, message: "User created" });
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

deleting = async (req, res) => {
    const id = req.body.id;
    try {
        if (
            !(await utilities.actionIsPermittedBySystemRole(res.locals.userId, [
                constants.ADMIN,
                constants.MANAGER_SR,
            ])) ||
            !(await utilities.isUserOrDirectReportOfUser(res.locals.userId, id))
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
        utilities.formatErrorResponse(res, 404, error);
    }
};

update = async (req, res) => {
    const id = req.body.id;
    const user = {
        forename: req.body.forename,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        system_role: req.body.system_role,
        job_role: req.body.job_role,
    };
    const passwordNotSupplied = !!!req.body.password;

    try {
        if (!(await utilities.isUserOrDirectReportOfUser(res.locals.userId, id))) {
            throw new Error("Not Permitted!");
        }
        const dbUser = await User.findByPk(id);
        if (!dbUser) throw new Error(`Unable to find User with id ${id}`);

        if (passwordNotSupplied) {
            user.password = dbUser.password;
        } else {
            if (!utilities.stringIsValidLength(user.password, 10, 16)) {
                throw new Error(
                    "Password must contain a minimum of 10 characters and a maximum of 16 characters",
                );
            }
            user.password = await utilities.getPasswordHash(req.body.password);
        }

        if (utilities.notValidUser(user)) {
            throw new Error("Essential fields missing");
        }

        if (dbUser.email !== user.email) {
            await utilities.checkForDuplicateEntry(User, { where: { email: user.email } });
        }

        if (!utilities.isValidItem(constants.SYSTEM_ROLE, user.system_role)) {
            throw new Error(
                "Not a valid entry for System Role: Options are Admin, Manager, StaffUser",
            );
        }

        if (!utilities.isValidItem(constants.JOB_ROLE, user.job_role)) {
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
        utilities.formatErrorResponse(res, 400, error);
    }
};

module.exports = { getAll, getById, getByToken, create, deleting, update };
