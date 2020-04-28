"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let sequelize;
let configs = {
    dialect: 'postgres',
    storage: ':memory:',
    models: [__dirname + '/models']
};
if (process.env.DATABASE_URL != null) {
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl != null) {
        let split = dbUrl.split('/');
        let name = split[split.length - 1];
        let port = dbUrl.match(/\:[0-9]{4}/);
        port = port[0].substring(1, port[0].length);
        let username = dbUrl.match(/\/\w*:/);
        username = username[0].substring(1, username[0].length - 1);
        let password = dbUrl.match(/\:[\w]*@/);
        password = password[0].substring(1, password[0].length - 1);
        let host = dbUrl.match(/\@.*:/);
        host = host[0].substring(1, host[0].length - 1);
        configs.port = port;
        configs.database = name;
        configs.username = username;
        configs.password = password;
        configs.host = host;
    }
}
else {
    configs.port = 54320;
    configs.database = 'waterMeter';
    configs.username = 'user';
    configs.password = 'pass';
    configs.host = '192.168.99.100';
}
sequelize = new sequelize_typescript_1.Sequelize(configs);
exports.default = sequelize;
