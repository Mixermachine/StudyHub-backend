'use strict';
module.exports = (sequelize, DataTypes) => {
    const PayoutMethod = sequelize.define('PayoutMethod', {
        // primaryKey id will be auto generated
        date: DataTypes.DATE
    }, {
        timestamps: false
    });
    PayoutMethod.associate = function (models) {
        // associations can be defined here
        PayoutMethod.hasMany(models.PayoutReward, {
            foreignKey: 'payoutMethodId'
        });

        PayoutMethod.hasOne(models.PayoutIBAN, {
            foreignKey: 'payoutMethodId'
        });

        PayoutMethod.hasOne(models.PayoutPayPal, {
            foreignKey: 'payoutMethodId'
        });

        PayoutMethod.belongsTo(models.Participant, {
            foreignKey: 'participantId'
        });
    };
    return PayoutMethod;
};