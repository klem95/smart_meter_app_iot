import {Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt} from "sequelize-typescript";



@Table
export default class smartMeterSample extends Model<smartMeterSample> {

    @Column
    meterId!: number

    @Column
    authenticSample!: boolean

    @Column
    date!: Date

    @Column
    wattsPerHour!: number
}