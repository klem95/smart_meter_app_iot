'use strict';
module.exports = (sequelize, DataTypes) => {
  const waterMeter = sequelize.define('waterMeter', {
    sample: DataTypes.STRING
  }, {});
  waterMeter.associate = function(models) {
    // associations can be defined here
  };
  return waterMeter;
};