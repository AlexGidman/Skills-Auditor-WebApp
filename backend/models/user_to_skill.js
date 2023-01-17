module.exports = (sequelize, Sequelize, user, skill) => {
    const UserSkill = sequelize.define(
        "userSkill",
        {
            skillLevel: {
                type: Sequelize.STRING,
            },
            notes: {
                type: Sequelize.STRING,
            },
            expiryDate: {
                type: Sequelize.DATEONLY,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "user_to_skill",
        },
    );

    UserSkill.belongsTo(user, { foreignKey: "userId", onDelete: "CASCADE" });
    UserSkill.belongsTo(skill, {
        foreignKey: "skillId",
    });

    return UserSkill;
};
