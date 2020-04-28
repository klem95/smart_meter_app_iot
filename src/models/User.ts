import {AllowNull,ForeignKey,BelongsTo,Model,Table, Column} from "sequelize-typescript"
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
    address!: string

    @Column
    country!: string

    @Column
    password!: string

    @Column
    meterId!: number

    @AllowNull(false)
    @ForeignKey(() => Admin)
<<<<<<< HEAD:src/models/User.ts
    @Column({
        unique: true,
    })
=======
    @Column
>>>>>>> e13bf01e8864eb172c55fec8e4078a9da3385f57:src/model/User.ts
    adminId!: number;

    @BelongsTo(() => Admin)
    admin!: Admin;
<<<<<<< HEAD:src/models/User.ts
=======

>>>>>>> e13bf01e8864eb172c55fec8e4078a9da3385f57:src/model/User.ts

}