const router = require("../routes/user_to_skill");
const utilities = require("../utilities/utility");
const constants = require("../utilities/constants");

const db = require("../models");
const UserSkill = db.userSkill;
const Category = db.category;
const Skill = db.skill;

getAll = async (req, res) => {
    try {
        if (
            !(await utilities.actionIsPermittedBySystemRole(res.locals.userId, [constants.ADMIN]))
        ) {
            throw new Error("Not Permitted!");
        }
        const userSkills = await UserSkill.findAll({
            order: ["id"],
            include: [
                {
                    model: Skill,
                    as: "skillID",
                    required: true,
                    include: [{ model: Category, required: true }],
                },
            ],
        });
        res.status(200).json(userSkills);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

getByUserId = async (req, res) => {
    const id = req.params.id;
    try {
        if (!(await utilities.isUserOrDirectReportOfUser(res.locals.userId, id))) {
            throw new Error("Not Permitted!");
        }
        const userSkills = await UserSkill.findAll({
            where: { user_id: id },
            include: [
                {
                    model: Skill,
                    as: "skillID",
                    required: true,
                    include: [{ model: Category, required: true }],
                },
            ],
        });
        if (!userSkills || !userSkills.length) {
            throw new Error("Unable to find User Skills for user id " + id);
        }
        res.status(200).json(userSkills);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

getByStaffSkillId = async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            throw new Error("Essential fields missing");
        }
        const userSkill = await UserSkill.findByPk(id, {
            include: [
                {
                    model: Skill,
                    as: "skillID",
                    required: true,
                    include: [{ model: Category, required: true }],
                },
            ],
        });
        if (!userSkill) {
            throw new Error("Unable to find User Skill with id " + id);
        }
        if (!(await utilities.isUserOrDirectReportOfUser(res.locals.userId, userSkill.user_id))) {
            throw new Error("Not Permitted!");
        }
        res.status(200).json(userSkill);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

create = async (req, res) => {
    let userSkill = {
        user_id: req.body.user_id,
        skill_id: req.body.skill_id,
        skill_level: req.body.skill_level,
        notes: req.body.notes,
        expiry_date: req.body.expiry_date || null,
    };
    try {
        if (!(await utilities.isUserOrDirectReportOfUser(res.locals.userId, userSkill.user_id))) {
            throw new Error("Not Permitted!");
        }
        if (
            !userSkill.user_id ||
            !userSkill.skill_id ||
            !userSkill.skill_level ||
            !userSkill.notes
        ) {
            throw new Error("Essential fields missing");
        }
        if (userSkill.skill_level > 5 || userSkill.skill_level < 1) {
            throw new Error("Skill level must be 1, 2, 3, 4, or 5");
        }

        if (!utilities.stringIsValidLength(userSkill.notes, 5, 255)) {
            throw new Error(
                "Notes must contain a minimum of 5 characters and a maximum of 255 characters",
            );
        }

        await utilities.checkForDuplicateEntry(UserSkill, {
            where: { user_id: userSkill.user_id, skill_id: userSkill.skill_id },
        });

        userSkill = await UserSkill.create(userSkill);

        res.status(201).json("User Skill added");
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

deleting = async (req, res) => {
    const id = req.body.id;
    try {
        if (!id) {
            throw new Error("Essential fields missing");
        }
        const userSkill = await UserSkill.findByPk(id, {
            include: [
                {
                    model: Skill,
                    as: "skillID",
                    required: true,
                    include: [{ model: Category, required: true }],
                },
            ],
        });
        if (!userSkill) {
            throw new Error("Id not found");
        }
        if (!(await utilities.isUserOrDirectReportOfUser(res.locals.userId, userSkill.user_id))) {
            throw new Error("Not Permitted!");
        }
        const deleted = await UserSkill.destroy({ where: { id: id } });
        if (deleted === 0) {
            throw new Error("Id not found");
        }
        res.status(200).send("User Skill deleted");
    } catch (error) {
        utilities.formatErrorResponse(res, 404, error);
    }
};

update = async (req, res) => {
    const id = req.body.id;

    const userSkill = {
        skill_level: req.body.skill_level,
        notes: req.body.notes,
    };

    try {
        if (!id || !userSkill.skill_level || !userSkill.notes) {
            throw new Error("Essential fields missing");
        }

        if (!utilities.stringIsValidLength(userSkill.notes, 5, 255)) {
            throw new Error(
                "Notes must contain a minimum of 5 characters and a maximum of 255 characters",
            );
        }

        if (userSkill.skill_level > 5 || userSkill.skill_level < 1) {
            throw new Error("Skill level must be 1, 2, 3, 4, or 5");
        }
        const existingUserSkill = await UserSkill.findByPk(id, {
            include: [
                {
                    model: Skill,
                    as: "skillID",
                    required: true,
                    include: [{ model: Category, required: true }],
                },
            ],
        });
        if (!existingUserSkill) {
            throw new Error("Id not found");
        }
        if (
            !(await utilities.isUserOrDirectReportOfUser(
                res.locals.userId,
                existingUserSkill.user_id,
            ))
        ) {
            throw new Error("Not Permitted!");
        }
        const updatedArray = await UserSkill.update(userSkill, { where: { id: id } });
        const updatedRecordsCount = updatedArray[0];

        if (updatedRecordsCount === 0) {
            const userSkill = await UserSkill.findByPk(id);
            if (!userSkill) {
                throw new Error("Unable to find User Skill with id " + id);
            } else {
                throw new Error("Unable to update User Skill - parameter values may already exist");
            }
        }
        res.status(200).json("User Skill updated");
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

module.exports = { getAll, getByUserId, getByStaffSkillId, create, deleting, update };
