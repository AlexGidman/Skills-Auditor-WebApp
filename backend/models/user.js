module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        "user",
        {
            firstName: {
                type: Sequelize.STRING,
            },
            lastName: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            systemRole: {
                type: Sequelize.STRING,
            },
            jobRole: {
                type: Sequelize.STRING,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "user",
        },
    );

    return User;
};
