'use strict';
module.exports = (sequelize, DataTypes) => {
    const Study = sequelize.define('Study', {
        // primaryKey id will be auto generated
        title: DataTypes.STRING,
        description: DataTypes.STRING(2500),
        prerequisites: DataTypes.STRING(1000),
        capacity: DataTypes.INTEGER,
        country: DataTypes.STRING(3),
        city: DataTypes.STRING(100),
        zip: DataTypes.STRING(20),
        street: DataTypes.STRING,
        number: DataTypes.STRING(20),
        additionalLocationInfo: DataTypes.STRING,
        rewardCurrency: DataTypes.STRING(3),
        rewardAmount: DataTypes.DOUBLE,
        published: DataTypes.BOOLEAN,
        createdOn: DataTypes.DATE
    }, {
        timestamps: false
    });
    Study.associate = function (models) {
        // associations can be defined here

        Study.hasMany(models.PayoutTransaction, {
            foreignKey: 'studyId'
        });

        Study.hasMany(models.Timeslot, {
            foreignKey: 'studyId'
        });

        Study.hasMany(models.PaymentTransaction, {
            foreignKey: 'studyId'
        });

        Study.hasMany(models.StudyKeyword, {
            foreignKey: 'studyId'
        });

        Study.belongsTo(models.Payee, {
            foreignKey: 'payeeId'
        });

        Study.belongsTo(models.Creator, {
            foreignKey: 'creatorId'
        })
    };
    return Study;
};