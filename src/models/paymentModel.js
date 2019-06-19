'use strict';
module.exports = (sequelize, DataTypes) => {
    const PaymentModel = sequelize.define('PaymentModel', {
        // primaryKey id will be auto generated
    }, {
        timestamps: false
    });
    PaymentModel.associate = function (models) {
        // associations can be defined here
        PaymentModel.belongsTo(models.Payee, {
            foreignKey: 'payeeId'
        })
    };
    return PaymentModel;
};