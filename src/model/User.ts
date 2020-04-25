import {Model,Table, Column} from "sequelize-typescript"
import {roleType} from '../utils/enums'

@Table
export default class User extends Model<User>{

    @Column
    email!: string

    @Column
    password!: string

    @Column(roleType)
    role!: string

}