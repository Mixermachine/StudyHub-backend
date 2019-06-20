'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // primaryKey id will be auto generated
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        DoB: DataTypes.DATE,
        gender: DataTypes.CHAR,
        pwHash: DataTypes.STRING,
        email: DataTypes.STRING
    }, {
        timestamps: false
    });
    User.associate = function (models) {
        // associations can be defined here
        User.hasOne(models.Creator, {
            foreignKey: 'userId'
        });
        User.hasOne(models.Payee, {
            foreignKey: 'userId'
        });
        User.hasOne(models.Participant, {
            foreignKey: 'userId'
        })
    };
    return User;
};