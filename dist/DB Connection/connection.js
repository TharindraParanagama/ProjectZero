"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
//module imports
const pg_promise_1 = __importDefault(require("pg-promise"));
//creating an instance of the pgp object
const init = pg_promise_1.default();
//initialization of the connection parameter string 
const connection = 'postgres://postgres:admin123@obs.chyb3tibizbs.us-east-2.rds.amazonaws.com:5432/onlinebookstore';
//passing the connection parameter string to the pgp object
exports.db = init(connection);
