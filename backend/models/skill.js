module.exports = (sequelize, Sequelize, category) => {
    const Skill = sequelize.define(
        "skill",
        {
            name: {
                type: Sequelize.STRING,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "skill",
        },
    );

    Skill.belongsTo(category, { foreignKey: "category_id", onDelete: "CASCADE" });

    return Skill;
};
