'use strict';
module.exports = (sequelize, DataTypes) => {
    const PayoutReward = sequelize.define('PayoutReward', {
        // primaryKey id will be auto generated
    }, {
        timestamps: false
    });
    PayoutReward.associate = function (models) {
        // associations can be defined here
        PayoutReward.hasOne(models.PayoutMoney, {
            foreignKey: 'payoutRewardId'
        });

        PayoutReward.belongsTo(models.PayoutMethod, {
            foreignKey: 'payoutMethodId'
        })

    };
    return PayoutReward;
};