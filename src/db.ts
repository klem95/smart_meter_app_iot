import {Sequelize, SequelizeOptions} from 'sequelize-typescript'

const config: SequelizeOptions = {
    port: 54320,
    dialect: 'postgres',
    database: 'waterMeter',
    username: 'user',
    password: 'pass',
    host: "192.168.99.100",
    storage: ':memory:',
    models: [__dirname + '/models'],
}

export const sequelize = new Sequelize(config)