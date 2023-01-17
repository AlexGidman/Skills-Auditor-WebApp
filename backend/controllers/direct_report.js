const {
    actionIsPermittedBySystemRole,
    isUserOrDirectReportOfUser,
    formatErrorResponse,
    checkForDuplicateEntry,
    checkRegisteredRelationship,
} = require("../utilities/utility");
const constants = require("../utilities/constants");
const db = require("../models");
const DirectReport = db.directReport;
const User = db.user;

function sanitiseUsers(directReports) {
    return directReports.map((directReport) => ({
        id: directReport.id,
        report: directReport.reportID && {
            id: directReport.reportID.id,
            firstName: directReport.reportID.firstName,
            lastName: directReport.reportID.lastName,
            email: directReport.reportID.email,
            systemRole: directReport.reportID.systemRole,
            jobRole: directReport.reportID.systemRole,
        },
    }));
}

const getAllReports = async (req, res) => {
    const id = req.params.id;
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
        const directReports = await DirectReport.findAll({
            where: { userId: id },
            include: [{ model: User, as: "reportID", required: true }],
        });
        if (!directReports || !directReports.length) {
            throw new Error("Unable to find reports for user with id " + id);
        }

        res.status(200).json(sanitiseUsers(directReports));
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

const create = async (req, res) => {
    let directReport = {
        userId: req.body.userId,
        reportId: req.body.reportId,
    };
    try {
        if (
            !(await actionIsPermittedBySystemRole(res.locals.userId, [
                constants.ADMIN,
                constants.MANAGER_SR,
            ])) ||
            !(await isUserOrDirectReportOfUser(res.locals.userId, directReport.userId))
        ) {
            throw new Error("Not Permitted!");
        }
        if (!directReport.userId || !directReport.reportId) {
            throw new Error("Essential fields missing");
        }

        if (directReport.userId === directReport.reportId) {
            throw new Error("a manager cannot manage themselves!");
        }

        await checkForDuplicateEntry(DirectReport, {
            where: { userId: directReport.userId, reportId: directReport.reportId },
        });
        await checkRegisteredRelationship(DirectReport, {
            where: { userId: directReport.reportId, reportId: directReport.userId },
        });
        directReport = await DirectReport.create(directReport);
        res.status(201).json("Direct Report added");
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
        } else {
            const deleted = await DirectReport.destroy({ where: { id: id } });
            if (!deleted) {
                throw new Error("Id not found");
            }
            res.status(200).send("Direct Report deleted");
        }
    } catch (error) {
        formatErrorResponse(res, 404, error);
    }
};

module.exports = { getAllReports, create, deleting };
