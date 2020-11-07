"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const macos_1 = __importDefault(require("./macos"));
const server = fastify_1.default({
    logger: true,
});
macos_1.default(server);
const start = async () => {
    try {
        await server.listen(3000);
    }
    catch (err) {
        server.log.error(err);
        console.error(err);
    }
};
start();
