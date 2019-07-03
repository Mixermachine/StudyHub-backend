'use strict';
module.exports = (sequelize, DataTypes) => {
    const Study = sequelize.define('Study', {
        // primaryKey id will be auto generated
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        prerequisites: DataTypes.STRING,
        capacity: DataTypes.INTEGER,
        country: DataTypes.STRING,
        city: DataTypes.STRING,
        zip: DataTypes.STRING,
        street: DataTypes.STRING,
        number: DataTypes.STRING,
        additionalLocationInfo: DataTypes.STRING,
        rewardCurrency: DataTypes.STRING,
        rewardAmount: DataTypes.DOUBLE,
        rewardType: DataTypes.STRING,
        published: DataTypes.BOOLEAN
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