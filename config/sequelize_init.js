const path = require('path');
module.exports = {

    config: path.join(__dirname, '/config_sequelize.json'),
    'migrations-path': path.join(__dirname, '../src/migrations'),
    'seeders-path': path.join(__dirname, '../src/seeders'),
    'models-path': path.join(__dirname, '../src/models')
};