'use strict';
module.exports = (sequelize, DataTypes) => {
    const RewardType = sequelize.define('RewardType', {
        // primaryKey id will be auto generated
        name: DataTypes.STRING
    }, {
        timestamps: false
    });

    return RewardType;
};