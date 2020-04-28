"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
exports.roleArr = ['admin', 'user', 'electricity supplier'];
exports.roleType = sequelize_typescript_1.DataType.ENUM(...exports.roleArr);
exports.userInterfaceTypes = { CUSTOMER: 'customer', ADMIN: 'admin', SUPPLIER: 'supplier' };
