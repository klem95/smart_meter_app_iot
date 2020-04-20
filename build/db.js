"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let sequelize;
if (process.env.HEROKU_POSTGRESQL_COBALT_URL != null) {
    sequelize = new sequelize_typescript_1.Sequelize(process.env.HEROKU_POSTGRESQL_COBALT_URL, {
        logging: false,
        dialectOptions: {
            ssl: true /* for SSL config since Heroku gives you this out of the box */
        }
    });
}
else {
    sequelize = new sequelize_typescript_1.Sequelize({
        port: 54320,
        dialect: 'postgres',
        database: 'waterMeter',
        username: 'user',
        password: 'pass',
        //host: "192.168.99.100",
        storage: ':memory:',
        models: [__dirname + '/models']
    });
}
exports.sequelize = sequelize;
//# sourceMappingURL=db.js.map