import {DataType} from "sequelize-typescript";

export const roleArr = ['admin', 'user', 'electricity supplier']
export const roleType = DataType.ENUM(...roleArr)