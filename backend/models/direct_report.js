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

    DirectReport.belongsTo(user, { as: "userID", foreignKey: "user_id", onDelete: "CASCADE" });
    DirectReport.belongsTo(user, { as: "reportID", foreignKey: "report_id", onDelete: "CASCADE" });

    return DirectReport;
};
