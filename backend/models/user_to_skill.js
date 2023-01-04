module.exports = (sequelize, Sequelize, user, skill) => {
    const UserSkill = sequelize.define(
        "userSkill",
        {
            skill_level: {
                type: Sequelize.STRING,
            },
            notes: {
                type: Sequelize.STRING,
            },
            expiry_date: {
                type: Sequelize.DATEONLY,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "user_to_skill",
        },
    );

    UserSkill.belongsTo(user, { as: "userID", foreignKey: "user_id", onDelete: "CASCADE" });
    UserSkill.belongsTo(skill, {
        as: "skillID",
        foreignKey: "skill_id",
    });

    return UserSkill;
};
