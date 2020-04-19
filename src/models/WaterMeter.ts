import {Column, Model, Table} from 'sequelize-typescript';

@Table
export default class WaterMeter extends Model<WaterMeter> {

    @Column
    name?: string;

    @Column
    birthday?: string;
}
