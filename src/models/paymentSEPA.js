'use strict';
module.exports = (sequelize, DataTypes) => {
    const PaymentSEPA = sequelize.define('PaymentSEPA', {
        // primaryKey id will be auto generated
        paymentMethodId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            foreignKey: true
        }
    }, {
        timestamps: false
    });
    PaymentSEPA.associate = function (models) {
        // associations can be defined here
        PaymentSEPA.belongsTo(models.PaymentMethod, {
            foreignKey: 'paymentMethodId'
        })
    };
    return PaymentSEPA;
};