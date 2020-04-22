"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let sequelize;
if (process.env.DATABASE_URL != null) {
    const url = process.env.DATABASE_URL;
    if (url != null) {
        let split = url.split('/');
        let name = split[split.length - 1];
        let port = url.match(/\:[0-9]{4}/);
        port = port[0].substring(1, port[0].length);
        let username = url.match(/\/\w*:/);
        username = username[0].substring(1, username[0].length - 1);
        let password = url.match(/\:[\w]*@/);
        password = password[0].substring(1, password[0].length - 1);
        let host = url.match(/\@.*:/);
        host = host[0].substring(1, host[0].length - 1);
        const configs = {
            port: port,
            dialect: 'postgres',
            database: name,
            username: username,
            password: password,
            host: host,
            storage: ':memory:',
            models: [__dirname + '/model']
        };
        sequelize = new sequelize_typescript_1.Sequelize(configs);
        console.log("yo");
    }
}
else {
    const configs = {
        port: 54320,
        dialect: 'postgres',
        database: 'waterMeter',
        username: 'user',
        password: 'pass',
        host: "192.168.99.100",
        storage: ':memory:',
        models: [__dirname + '/model']
    };
    sequelize = new sequelize_typescript_1.Sequelize(configs);
    console.log("fuck!");
}
exports.seq = sequelize;
//# sourceMappingURL=db.js.map