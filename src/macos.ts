import { FastifyInstance } from "fastify";
import JSZip from "jszip";

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
    handler: async function (request, reply) {
      try {
        const manifest = request.body;

        // TODO meat and potatoes

        const zip = new JSZip();
        zip.file("");

        const iconZip = getIconZip();

        // for await (icon of iconZip.) {}

        reply.send({
          hello: "world",
        });
      } catch (err) {
        fastify.log.error(err);

        reply.status(400).send({
          message: "not found",
        });
      }
    },
  });
}

async function a() {}

async function getIconZip(): JSZip {
  // TODO some fetch
}
