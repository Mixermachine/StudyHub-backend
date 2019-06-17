'use strict';
module.exports = (sequelize, DataTypes) => {
    const StudyKeyword = sequelize.define('StudyKeyword', {
        studyId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            foreignKey: true
        },
        keyword: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        timestamps: false
    });
    StudyKeyword.associate = function (models) {
        // associations can be defined here
        StudyKeyword.belongsTo(models.Study, {
            foreignKey: 'studyId'
        });
    };

    return StudyKeyword;
};