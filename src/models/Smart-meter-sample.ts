import {Model, Column, Table, BelongsToMany, Scopes, CreatedAt, UpdatedAt} from "sequelize-typescript";
import {Op} from 'sequelize'

@Scopes(() => ({

}))

@Table
export default class SmartMeterSample extends Model<SmartMeterSample> {

    @Column
    meterId!: number

    @Column
    authenticSample!: boolean

    @Column
    date!: Date

    @Column
    wattsPerHour!: number
}