import { FastifyInstance } from "fastify";

function schema(options: any) {
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

export default function macos(fastify: FastifyInstance, options?: any) {
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
