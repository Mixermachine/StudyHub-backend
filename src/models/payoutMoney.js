'use strict';
module.exports = (sequelize, DataTypes) => {
    const PayoutMoney = sequelize.define('PayoutMoney', {
        // primaryKey id will be auto generated
        amount: DataTypes.DOUBLE
    }, {
        timestamps: false
    });
    PayoutMoney.associate = function (models) {
        // associations can be defined here
        PayoutMoney.belongsTo(models.PayoutReward, {
            foreignKey: 'payoutRewardId'
        })
    };
    return PayoutMoney;
};