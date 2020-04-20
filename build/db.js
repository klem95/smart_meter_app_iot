"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const config = {
    port: 54320,
    dialect: 'postgres',
    database: 'waterMeter',
    username: 'user',
    password: 'pass',
    // host: "192.168.99.100",
    storage: ':memory:',
    models: [__dirname + '/models'],
};
exports.sequelize = new sequelize_typescript_1.Sequelize(config);
//# sourceMappingURL=db.js.map