"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function schema(options) {
    return {
        response: {
            200: {
                type: "object",
                properties: {
                    hello: { type: "string" },
                },
            },
        },
    };
}
function macos(fastify, options) {
    return fastify.route({
        method: "POST",
        url: "/",
        schema: schema(options),
        handler: function (request, reply) {
            reply.send({
                hello: "world",
            });
        },
    });
}
exports.default = macos;
