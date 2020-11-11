import { FastifyInstance } from "fastify";
import JSZip from "jszip";
import * as utils from "./utils";

function schema(options: any) {
  return {
    response: {
      200: {
        type: "object",
        properties: {
          hello: { type: "string" },
        },
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" },
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
        const siteUrl = (request.params as any).siteUrl as string;
        const manifest = request.body as WebAppManifest;

        // TODO meat and potatoes

        const zip = new JSZip();
        zip.file("");

        const manifestIcons = await utils.getIconsFromManifest(
          siteUrl,
          manifest
        );
        const largestImg = await utils.getLargestImg(manifestIcons);

        const icons = Promise.all([...manifestIcons]);
        const genIconZip = await utils.getGeneratedIconZip(largestImg, "ios");

        // TODO process icons here

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
