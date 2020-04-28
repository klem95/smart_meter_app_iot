"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
<<<<<<< HEAD:build/models/ElectricitySupplier.js
let ElectricitySupplier = class ElectricitySupplier extends sequelize_typescript_1.Model {
=======
const Admin_1 = __importDefault(require("./Admin"));
let User = class User extends sequelize_typescript_1.Model {
>>>>>>> e13bf01e8864eb172c55fec8e4078a9da3385f57:build/model/User.js
};
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ElectricitySupplier.prototype, "firstName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ElectricitySupplier.prototype, "lastName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ElectricitySupplier.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
<<<<<<< HEAD:build/models/ElectricitySupplier.js
], ElectricitySupplier.prototype, "password", void 0);
ElectricitySupplier = __decorate([
=======
], User.prototype, "address", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "meterId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Admin_1.default),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "adminId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Admin_1.default),
    __metadata("design:type", Admin_1.default)
], User.prototype, "admin", void 0);
User = __decorate([
>>>>>>> e13bf01e8864eb172c55fec8e4078a9da3385f57:build/model/User.js
    sequelize_typescript_1.Table
], ElectricitySupplier);
exports.default = ElectricitySupplier;
//# sourceMappingURL=ElectricitySupplier.js.map