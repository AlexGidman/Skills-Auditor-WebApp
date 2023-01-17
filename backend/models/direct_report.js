module.exports = (sequelize, Sequelize, user) => {
    const DirectReport = sequelize.define(
        "directReport",
        {},
        {
            timestamps: false,
            freezeTableName: true,
            tableName: "direct_report",
        },
    );

    DirectReport.belongsTo(user, { as: "userID", foreignKey: "userId", onDelete: "CASCADE" });
    DirectReport.belongsTo(user, { as: "reportID", foreignKey: "reportId", onDelete: "CASCADE" });

    return DirectReport;
};
