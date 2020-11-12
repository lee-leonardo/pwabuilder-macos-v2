import { FastifyInstance } from "fastify";
import JSZip from "jszip";
import { handleImages } from "./images";
import { FilesAndEdit, copyFiles } from "./copy";

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

export default function macos(server: FastifyInstance, options?: any) {
  return server.route({
    method: "POST",
    url: "/",
    schema: schema(options),
    handler: async function (request, reply) {
      try {
        const zip = new JSZip();
        const siteUrl = (request.params as any).siteUrl as string;
        const manifest = request.body as WebAppManifest;

        await Promise.all([
          ...(await handleImages(server, zip, manifest, siteUrl)),
          ...copyFiles(zip, manifest, filesAndEdits),
        ]);

        // send zip.
        // reply.send(zip);
        reply.send({
          hello: "world",
        });
      } catch (err) {
        server.log.error(err);

        reply.status(400).send({
          message: "failed to create your macos project",
        });
      }
    },
  });
}

// Object that holds the files and edit functions to those files.
const filesAndEdits: FilesAndEdit = {
  "": async (zip, manifest, filePath) => {
    return {
      filePath,
      success: true,
    };
  },
  "MacOSpwa/Base.lproj/Main.storyboard": async (zip, manifest, filePath) => {
    try {
      // grab the file and then make edits...

      zip.file(filePath, "");
      return {
        filePath,
        success: true,
      };
    } catch (error) {
      return {
        filePath,
        success: false,
        error,
      };
    }
  },
  "MacOSpwa/manifest.json": async (zip, manifest, filePath) => {
    try {
      zip.file(filePath, JSON.stringify(manifest, undefined, 2));
      return {
        filePath,
        success: true,
      };
    } catch (error) {
      return {
        filePath,
        success: false,
        error,
      };
    }
  },
};
