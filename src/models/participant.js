'use strict';
module.exports = (sequelize, DataTypes) => {
    const Participant = sequelize.define('Participant', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            foreignKey: true
        },
        balance: DataTypes.DOUBLE
    }, {
        timestamps: false
    });
    Participant.associate = function (models) {
        // associations can be defined here
        Participant.hasMany(models.PayoutMethod, {
            foreignKey: 'participantId'
        });

        Participant.hasMany(models.PayoutTransaction, {
            foreignKey: 'participantId'
        });

        Participant.hasMany(models.Timeslot, {
            foreignKey: 'participantId',
            allowNull: true
        });

        Participant.belongsTo(models.User, {
            foreignKey: 'userId'
        });

    };

    return Participant;
};