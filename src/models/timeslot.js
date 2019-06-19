'use strict';
module.exports = (sequelize, DataTypes) => {
    const Timeslot = sequelize.define('Timeslot', {
        // primaryKey id will be auto generated
        start: DataTypes.DATE,
        stop: DataTypes.DATE,
        attended: DataTypes.BOOLEAN
    }, {
        timestamps: false
    });
    Timeslot.associate = function (models) {
        // associations can be defined here
        Timeslot.belongsTo(models.Study, {
            foreignKey: 'studyId'
        });

        Timeslot.belongsTo(models.Participant, {
            foreignKey: 'participantId',
            allowNull: true
        });
    };
    return Timeslot;
};