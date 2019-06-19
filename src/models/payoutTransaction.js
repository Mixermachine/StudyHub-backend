'use strict';
module.exports = (sequelize, DataTypes) => {
    const PayoutTransaction = sequelize.define('PayoutTransaction', {
        // primaryKey id will be auto generated
        date: DataTypes.DATE
    }, {
        timestamps: false
    });
    PayoutTransaction.associate = function (models) {
        // associations can be defined here
        PayoutTransaction.belongsTo(models.PayoutReward, {
            foreignKey: 'payoutRewardId'
        });

        PayoutTransaction.belongsTo(models.Study, {
            foreignKey: 'studyId'
        });

        PayoutTransaction.belongsTo(models.Participant, {
            foreignKey: 'participantId'
        });
    };
    return PayoutTransaction;
};