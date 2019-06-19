'use strict';
module.exports = (sequelize, DataTypes) => {
    const Creator = sequelize.define('Creator', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            foreignKey: true
        }
    }, {
        timestamps: false
    });
    Creator.associate = function (models) {
        // associations can be defined here
        Creator.belongsTo(models.User, {
            foreignKey: 'userId'
        });

        Creator.hasMany(models.Study, {
            foreignKey: 'creatorId'
        })
    };

    return Creator;
};