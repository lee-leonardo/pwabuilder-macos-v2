import { FastifyInstance } from "fastify";

function imageResourceSchema() {
  return {
    $id: "imageResource",
    properties: {
      src: { type: "string" },
      sizes: { type: "string" },
      type: { type: "string" },
      purpose: { type: "string" },
    },
  };
}

function webAppSchema() {
  return {
    $id: "webApp",
    type: "object",
    required: [],
    properties: {
      dir: { type: "string" },
      lang: { type: "string" },
      name: { type: "string" },
      short_name: { type: "string" },
      description: { type: "string" },
      icons: {
        type: "array",
        items: {
          $ref: "imageResource#",
        },
      },
      screenshots: {
        type: "array",
        items: {
          $ref: "imageResource#",
        },
      },
      categories: {
        type: "array",
        items: {
          type: "string",
        },
      },
      iarc_rating_id: {
        type: "string",
      },
      start_url: {
        type: "string",
      },
      display: {
        type: "string",
      },
      orientation: {
        type: "string",
      },
      theme_color: {
        type: "string",
      },
      background_color: {
        type: "string",
      },
      scope: {
        type: "string",
      },
      prefer_related_applications: {
        type: "string",
      },
    },
  };
}

export function webAppManifestSchema(server: FastifyInstance, options: any) {
  server.addSchema(imageResourceSchema());
  server.addSchema(webAppSchema());

  return {
    $ref: "webApp#",
  };
}
