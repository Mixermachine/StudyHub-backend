'use strict';
module.exports = (sequelize, DataTypes) => {
    const PayoutPayPal = sequelize.define('PayoutPayPal', {
        // primaryKey id will be auto generated
        paymentMethodId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            foreignKey: true
        }
    }, {
        timestamps: false
    });
    PayoutPayPal.associate = function (models) {
        // associations can be defined here
        PayoutPayPal.belongsTo(models.PayoutMethod, {
            foreignKey: 'payoutMethodId'
        })
    };
    return PayoutPayPal;
};