'use strict';
module.exports = (sequelize, DataTypes) => {
    const PayoutMethod = sequelize.define('PayoutMethod', {
        // primaryKey id will be auto generated
        date: DataTypes.DATE,
        paymentInfo: DataTypes.STRING
    }, {
        timestamps: false
    });

    PayoutMethod.associate = function (models) {
        // associations can be defined here
        PayoutMethod.belongsTo(models.RewardType, {
            foreignKey: 'rewardTypeId'
        });

        PayoutMethod.belongsTo(models.Participant, {
            foreignKey: 'participantId'
        });
    };
    return PayoutMethod;
};