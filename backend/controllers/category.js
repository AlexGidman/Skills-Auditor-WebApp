const {
    formatErrorResponse,
    checkForDuplicateEntry,
    actionIsPermittedBySystemRole,
} = require("../utilities/utility");
const { ADMIN, MANAGER_SR } = require("../utilities/constants");
const db = require("../models");
const Category = db.category;

const getAll = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

const getById = async (req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error(`Unable to find Category with id ${id}`);
        }
        res.status(200).json(category);
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

const create = async (req, res) => {
    let category = {
        name: req.body.name,
    };
    try {
        if (!(await actionIsPermittedBySystemRole(res.locals.userId, [ADMIN, MANAGER_SR]))) {
            throw new Error("Not Permitted!");
        }
        if (!category.name) {
            throw new Error("Essential fields missing");
        }

        await checkForDuplicateEntry(Category, { where: { name: category.name } });

        category = await Category.create(category);
        res.status(201).json("Category created");
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

const deleting = async (req, res) => {
    const id = req.body.id;
    try {
        if (!(await actionIsPermittedBySystemRole(res.locals.userId, [ADMIN, MANAGER_SR]))) {
            throw new Error("Not Permitted!");
        }
        if (!id) {
            throw new Error("Essential fields missing");
        } else {
            const deleted = await Category.destroy({ where: { id: id } });
            if (deleted === 0) {
                throw new Error("Id not found");
            }
            res.status(200).send("Category deleted");
        }
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            error = new Error("Cannot delete Category option - already assigned to Skill");
        }
        formatErrorResponse(res, 404, error);
    }
};

const update = async (req, res) => {
    let updatedRecordsCount = null;
    const id = req.body.id;
    const category = {
        name: req.body.name,
    };

    try {
        if (!(await actionIsPermittedBySystemRole(res.locals.userId, [ADMIN, MANAGER_SR]))) {
            throw new Error("Not Permitted!");
        }
        if (!id || !category.name) {
            throw new Error("Essential fields missing");
        }

        await checkForDuplicateEntry(Category, { where: { name: category.name } });

        const updatedArray = await Category.update(category, { where: { id: id } });
        updatedRecordsCount = updatedArray[0];

        if (updatedRecordsCount === 0) {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error(`Unable to find Category with id ${id}`);
            } else {
                throw new Error("Unable to update Category - parameter values may already exist");
            }
        }

        res.status(200).json("Category updated");
    } catch (error) {
        formatErrorResponse(res, 400, error);
    }
};

module.exports = { getAll, getById, create, deleting, update };
