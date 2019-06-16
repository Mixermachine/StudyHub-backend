'use strict';
module.exports = (sequelize, DataTypes) => {
    const PayoutTransactions = sequelize.define('PayoutTransactions', {
        // primaryKey id will be auto generated
        date: DataTypes.DATE
    }, {
        timestamps: false
    });
    PayoutTransactions.associate = function (models) {
        // associations can be defined here
        PayoutTransactions.belongsTo(models.PayoutReward, {
            foreignKey: 'payoutRewardId'
        })
    };
    return PayoutTransactions;
};