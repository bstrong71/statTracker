'use strict';
module.exports = function(sequelize, DataTypes) {
  var Stat = sequelize.define('Stat', {
    date: DataTypes.DATE,
    activId: DataTypes.INTEGER,
    units: DataTypes.INTEGER
  }, {});

  Stat.belongsTo(models.Activity, {
    as: 'Activities',
    foreignKey: 'activId'
  })

  return Stat;
};
