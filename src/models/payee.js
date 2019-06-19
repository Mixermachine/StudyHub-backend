'use strict';
module.exports = (sequelize, DataTypes) => {
    const Payee = sequelize.define('Payee', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            foreignKey: true
        }
    }, {
        timestamps: false
    });
    Payee.associate = function (models) {
        // associations can be defined here
        Payee.belongsTo(models.User, {
            foreignKey: 'userId'
        });

        Payee.hasMany(models.PaymentModel, {
            foreignKey: 'payeeId'
        });

        Payee.hasMany(models.PaymentMethod, {
            foreignKey: 'payeeId'
        });

        Payee.hasMany(models.PaymentTransaction, {
            foreignKey: 'payeeId'
        });

        Payee.hasMany(models.Study, {
            foreignKey: 'payeeId'
        });
    };


    return Payee;
};