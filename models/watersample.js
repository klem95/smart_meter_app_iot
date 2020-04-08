'use strict';
module.exports = (sequelize, DataTypes) => {
  const WaterSample = sequelize.define('WaterSample', {
    data: DataTypes.FLOAT
  }, {});
  WaterSample.associate = function(models) {
    // associations can be defined here
  };
  return WaterSample;
};