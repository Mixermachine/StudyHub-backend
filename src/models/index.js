'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Colors = require('sequelize-log-syntax-colors');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config_sequelize = require(__dirname + '/../../config/config_sequelize.json')[env];
const db = {};

let sequelize;

// Add coloring to sequelize log
config_sequelize.logging = (text) => console.log(Colors(text));

// Load config
if (config_sequelize.use_env_variable) {
    sequelize = new Sequelize(process.env[config_sequelize.use_env_variable],
        config_sequelize);
} else {
    sequelize = new Sequelize(config_sequelize.database,
        config_sequelize.username,
        config_sequelize.password,
        config_sequelize);
}

// Check connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        throw "Database connection could not be established. Profile: " + env;
    });

// Load index model
let modelsDir = __dirname;
fs
    .readdirSync(modelsDir)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(modelsDir, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

//PaymentTransaction.belongsTo(models.PayoutMethod, {
//  foreignKey: 'paymentId'
//});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
