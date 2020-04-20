import {Sequelize, SequelizeOptions} from 'sequelize-typescript'

const config: SequelizeOptions = {
    port: 54320,
    dialect: 'postgres',
    database: 'waterMeter',
    username: 'user',
    password: 'pass',
    //host: "192.168.99.100",
    storage: ':memory:',
    models: [__dirname + '/models'],
}

if (process.env.HEROKU_POSTGRESQL_COBALT_URL != null) {
    console.log("HEEEEEELLO")
    console.log(process.env.HEROKU_POSTGRESQL_COBALT_URL)

}

export const sequelize = new Sequelize(config)