import {Model,HasMany, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt} from "sequelize-typescript";
import {Op} from 'sequelize'
import User from "./User";

@Table
export default class Admin extends Model<Admin>{
    @Column
    firstName!: string

    @Column
    lastName!: string

    @Column
    email!: string

    @Column
    password!: string


    @HasMany(() => User)
    users!: User[];

}