const config = require("../config/config");
const Category = require("./category");
const User = require("./user");
const Skill = require("./skill");
const UserSkill = require("./user_to_skill");
const DirectReport = require("./direct_report");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    port: config.PORT,
});

sequelize
    .authenticate()
    .then(() => {
        console.log("Connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.category = Category(sequelize, Sequelize);
db.user = User(sequelize, Sequelize);
db.skill = Skill(sequelize, Sequelize, db.category);
db.userSkill = UserSkill(sequelize, Sequelize, db.user, db.skill);
db.directReport = DirectReport(sequelize, Sequelize, db.user);

module.exports = db;
