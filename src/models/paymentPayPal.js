'use strict';
module.exports = (sequelize, DataTypes) => {
    const PaymentPayPal = sequelize.define('PaymentPayPal', {
        // primaryKey id will be auto generated
        paymentMethodId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            foreignKey: true
        },
        info: DataTypes.STRING
    }, {
        timestamps: false
    });
    PaymentPayPal.associate = function (models) {
        // associations can be defined here
        PaymentPayPal.belongsTo(models.PaymentMethod, {
            foreignKey: 'paymentMethodId'
        })
    };
    return PaymentPayPal;
};