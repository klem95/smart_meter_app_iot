import {ForeignKey,BelongsTo,Model,Table, Column} from "sequelize-typescript"
import {roleType} from '../utils/enums'
import Admin from "./Admin";

@Table
export default class User extends Model<User>{

    @Column
    firstName!: string

    @Column
    lastName!: string

    @Column
    email!: string

    @Column
    password!: string

    @Column
    meterId!: number

    @ForeignKey(() => Admin)
    @Column
    adminId?: number

    @BelongsTo(() => Admin)
    admin?: Admin

}