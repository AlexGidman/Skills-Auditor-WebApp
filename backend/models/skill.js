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

    Skill.belongsTo(category, { foreignKey: "categoryId", onDelete: "CASCADE" });

    return Skill;
};
