'use strict';
module.exports = (sequelize, DataTypes) => {
    const PayoutIBAN = sequelize.define('PayoutIBAN', {
        // primaryKey id will be auto generated
        paymentMethodId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            foreignKey: true
        }
    }, {
        timestamps: false
    });
    PayoutIBAN.associate = function (models) {
        // associations can be defined here
        PayoutIBAN.belongsTo(models.PayoutMethod, {
            foreignKey: 'payoutMethodId'
        })
    };
    return PayoutIBAN;
};