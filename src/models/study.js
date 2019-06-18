'use strict';
module.exports = (sequelize, DataTypes) => {
    const Study = sequelize.define('Study', {
        // primaryKey id will be auto generated
        description: DataTypes.STRING,
        prerequisites: DataTypes.STRING,
        capacity: DataTypes.INTEGER,
        location: DataTypes.STRING
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

        // Many to Many connection to participant
        Study.belongsToMany(models.Participant, {
            foreignKey: 'studyId',
            through: 'StudyParticipants'
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