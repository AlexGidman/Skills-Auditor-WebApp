const router = require("../routes/skill");
const utilities = require("../utilities/utility");
const db = require("../models");
const { ADMIN, MANAGER_SR } = require("../utilities/constants");
const Skill = db.skill;
const Category = db.category;

getAll = async (req, res) => {
    try {
        const skills = await Skill.findAll({
            order: ["id"],
            include: [
                {
                    model: Category,
                    required: true,
                },
            ],
        });
        res.status(200).json(skills);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

getById = async (req, res) => {
    const id = req.params.id;
    try {
        const skill = await Skill.findByPk(id, { include: [{ model: Category, required: true }] });
        if (!skill) {
            throw new Error("Unable to find Skill with id " + id);
        }
        res.status(200).json(skill);
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

create = async (req, res) => {
    let skill = {
        name: req.body.name,
        category_id: req.body.category_id,
    };
    try {
        if (
            !(await utilities.actionIsPermittedBySystemRole(res.locals.userId, [ADMIN, MANAGER_SR]))
        ) {
            throw new Error("Not Permitted!");
        }

        if (!skill.name || !skill.category_id) {
            throw new Error("Essential fields missing");
        }

        await utilities.checkForDuplicateEntry(Skill, {
            where: { name: skill.name, category_id: skill.category_id },
        });

        skill = await Skill.create(skill);

        res.status(201).json("Skill created");
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

deleting = async (req, res) => {
    const id = req.body.id;
    try {
        if (
            !(await utilities.actionIsPermittedBySystemRole(res.locals.userId, [ADMIN, MANAGER_SR]))
        ) {
            throw new Error("Not Permitted!");
        }
        if (!id) {
            throw new Error("Essential fields missing");
        } else {
            const deleted = await Skill.destroy({ where: { id: id } });
            if (deleted === 0) {
                throw new Error("Id not found");
            }
            res.status(200).send("Skill deleted");
        }
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            error = new Error("Cannot delete Skill option - already assigned to User Skills");
        }
        utilities.formatErrorResponse(res, 404, error);
    }
};

update = async (req, res) => {
    const id = req.body.id;

    const skill = {
        name: req.body.name,
        category_id: req.body.category_id,
    };

    try {
        if (
            !(await utilities.actionIsPermittedBySystemRole(res.locals.userId, [ADMIN, MANAGER_SR]))
        ) {
            throw new Error("Not Permitted!");
        }
        if (!id || !skill.name || !skill.category_id) {
            throw new Error("Essential fields missing");
        }
        await utilities.checkForDuplicateEntry(Skill, {
            where: { name: skill.name, category_id: skill.category_id },
        });

        const updatedArray = await Skill.update(skill, { where: { id: id } });
        const updatedRecordsCount = updatedArray[0];

        if (updatedRecordsCount === 0) {
            const skill = await Skill.findByPk(id);
            if (!skill) {
                throw new Error("Unable to find Skill with id " + id);
            } else {
                throw new Error("Unable to update Skill - parameter values may already exist");
            }
        }
        res.status(200).json("Skill updated");
    } catch (error) {
        utilities.formatErrorResponse(res, 400, error);
    }
};

module.exports = { getAll, getById, create, deleting, update };
