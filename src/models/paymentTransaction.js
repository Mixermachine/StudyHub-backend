'use strict';
module.exports = (sequelize, DataTypes) => {
    const PaymentTransaction = sequelize.define('PaymentTransaction', {
        // primaryKey id will be auto generated
        amount: DataTypes.DOUBLE,
        date: DataTypes.DATE
    }, {
        timestamps: false
    });
    PaymentTransaction.associate = function (models) {
        // associations can be defined here
        PaymentTransaction.belongsTo(models.PaymentMethod, {
            foreignKey: 'paymentId'
        });

        PaymentTransaction.belongsTo(models.Payee, {
            foreignKey: 'payeeId'
        });

        PaymentTransaction.belongsTo(models.Study, {
            foreignKey: 'studyId'
        });
    };
    return PaymentTransaction;
};