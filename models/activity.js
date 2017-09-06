'use strict';
module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define('Activity', {
    description: DataTypes.STRING,
    measure: DataTypes.STRING
  }, {});

  Activity.associate = function(models) {
    Activity.hasMany(models.Stat, {
      as: 'Stats',
      foreignKey: 'activId'
    })
  }

  return Activity;
};
