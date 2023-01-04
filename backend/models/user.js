module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        "user",
        {
            forename: {
                type: Sequelize.STRING,
            },
            surname: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            system_role: {
                type: Sequelize.STRING,
            },
            job_role: {
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
