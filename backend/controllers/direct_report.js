const router = require("../routes/user_to_skill");
const utilities = require("../utilities/utility");
const constants = require("../utilities/constants");
const db = require("../models");
const DirectReport = db.directReport;
const User = db.user;

getAllReports = async (req, res) => {
    const id = req.params.id;
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
        const directReports = await DirectReport.findAll({
            where: { user_id: id },
            include: [{ model: User, as: "reportID", required: true }],
        });
        if (!directReports || !directReports.length) {
            throw new Error("Unable to find reports for user with id " + id);
        }
        const sanitisedUsers = directReports.map((directReport) => ({
            id: directReport.id,
            report: directReport.reportID && {
                id: directReport.reportID.id,
                forename: directReport.reportID.forename,
                surname: directReport.reportID.surname,
                email: directReport.reportID.email,
                system_role: directReport.reportID.system_role,
                job_role: directReport.reportID.job_role,
            },
        }));
        res.status(200).json(sanitisedUsers);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

create = async (req, res) => {
    let directReport = {
        user_id: req.body.user_id,
        report_id: req.body.report_id,
    };
    try {
        if (
            !(await utilities.actionIsPermittedBySystemRole(res.locals.userId, [
                constants.ADMIN,
                constants.MANAGER_SR,
            ])) ||
            !(await utilities.isUserOrDirectReportOfUser(res.locals.userId, directReport.user_id))
        ) {
            throw new Error("Not Permitted!");
        }
        if (!directReport.user_id || !directReport.report_id) {
            throw new Error("Essential fields missing");
        }

        if (directReport.user_id === directReport.report_id) {
            throw new Error("a manager cannot manage themselves!");
        }

        await utilities.checkForDuplicateEntry(DirectReport, {
            where: { user_id: directReport.user_id, report_id: directReport.report_id },
        });
        await utilities.checkRegisteredRelationship(DirectReport, {
            where: { user_id: directReport.report_id, report_id: directReport.user_id },
        });
        directReport = await DirectReport.create(directReport);
        res.status(201).json("Direct Report added");
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
        } else {
            const deleted = await DirectReport.destroy({ where: { id: id } });
            if (!deleted) {
                throw new Error("Id not found");
            }
            res.status(200).send("Direct Report deleted");
        }
    } catch (error) {
        utilities.formatErrorResponse(res, 404, error);
    }
};

module.exports = { getAllReports, create, deleting };
