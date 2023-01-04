module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define(
        "category",
        {
            name: {
                type: Sequelize.STRING,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "category",
        },
    );

    return Category;
};
