import {Sequelize, SequelizeOptions} from 'sequelize-typescript'
let sequelize
if (process.env.DATABASE_URL!= null) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        logging: false,
        storage: ':memory:',
        models: [__dirname + '/models'],
        dialectOptions: {
            ssl: true /* for SSL config since Heroku gives you this out of the box */
        }
    })
console.log("yo")
} else {
    const configs: SequelizeOptions= {
        port: 54320,
        dialect: 'postgres',
        database: 'waterMeter',
        username: 'user',
        password: 'pass',
        host: "192.168.99.100",
        storage: ':memory:',
        models: [__dirname + '/models']
    }
    sequelize = new Sequelize(configs)
    console.log("fuck!")

}

export const seq : any = sequelize