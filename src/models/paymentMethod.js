'use strict';
module.exports = (sequelize, DataTypes) => {
    const PaymentMethod = sequelize.define('PaymentMethod', {
        // primaryKey id will be auto generated
        name: DataTypes.STRING
    }, {
        timestamps: false
    });
    PaymentMethod.associate = function (models) {
        // associations can be defined here
        PaymentMethod.hasMany(models.PaymentTransaction, {
            foreignKey: 'paymentId'
        });

        PaymentMethod.hasOne(models.PaymentSEPA, {
            foreignKey: 'paymentMethodId'
        });

        PaymentMethod.hasOne(models.PaymentPayPal, {
            foreignKey: 'paymentMethodId'
        });

        PaymentMethod.belongsTo(models.Payee, {
            foreignKey: 'payeeId'
        });
    };
    return PaymentMethod;
};