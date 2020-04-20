"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const WaterMeter_1 = __importDefault(require("./models/WaterMeter"));
const port = process.env.PORT || 3000;
const configs = require('./db');
let app = express_1.default();
//sequelize.sync()
app.use('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield configs.sync();
        const test = new WaterMeter_1.default({
            name: "hans",
            birthday: "21"
        });
        test.save();
        const all = yield WaterMeter_1.default.findAll();
        res.send(all);
    }
    catch (e) {
        res.send(e.toString());
        throw e;
    }
}));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log("hello");
});
//# sourceMappingURL=index.js.map