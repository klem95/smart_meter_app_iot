import {Sequelize, SequelizeOptions} from 'sequelize-typescript'
let sequelize
if (process.env.DATABASE_URL!= null) {
    const url = process.env.DATABASE_URL
    if (url !=null) {
        let split = url.split('/')
        let name = split[split.length-1]
        const configs: SequelizeOptions= {
            port: Number(url.match(/\/\w*:/) != null ? url.match(/\:[0-9]{4}/) : "0000"),
            dialect: 'postgres',
            database: name,
            username: String (url.match(/\/\w*:/) != null ? url.match(/\/\w*:/) : "user"),
            password:  String (url.match(/\:[\w]*@/) != null ? url.match(/\:[\w]*@/) : "pass"),
            host: String (url.match(/\@.*:/) != null ? url.match(/\@.*:/) : "pass"),
            storage: ':memory:',
            models: [__dirname + '/models']
        }
        sequelize = new Sequelize(configs)

        console.log("yo")
    }
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
