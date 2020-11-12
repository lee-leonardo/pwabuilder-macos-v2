import { FastifyInstance } from "fastify";
import JSZip from "jszip";
import * as utils from "./utils";
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

        const result = await Promise.all([
          handleImages(zip, manifest, siteUrl),
          copyFiles(zip, manifest, filesAndEdits),
        ]);

        if (!result) {
          // error
        }

        // send zip.
        reply.send({
          hello: "world",
        });
      } catch (err) {
        server.log.error(err);

        reply.status(400).send({
          message: "not found",
        });
      }
    },
  });
}

// Edits manifest entries to use new images and
async function handleImages(
  zip: JSZip,
  manifest: WebAppManifest,
  siteUrl: string
) {
  try {
    //each image needs to be copied into two places, a manifest changes and also json write changes in the assets folder
    const manifestIcons = await utils.getIconsFromManifest(siteUrl, manifest);
    const largestImg = await utils.getLargestImg(manifestIcons);
    const icons = Promise.all([...manifestIcons]);
    const genIconZip = await utils.getGeneratedIconZip(largestImg!, "ios");

    const iconName = "12x12" + "extension";
    // two paths:
    // ./images/
    zip.file(`images/${iconName}`);
    // ./MacOSpwa/Assets.xcassets/
    zip.file(`MacOSpwa/Assets.xcassets/${iconName}`);

    // edit manifest reference entry
    manifest.icons = [];

    // edit: ./MacOSpwa/Assets.xcassets/AppIcon.appiconset/Contents.json , entries.
    const json = {};
    zip.file(
      "MacOSpwa/Assets.xcassets/AppIcon.appiconset/Contents.json",
      JSON.stringify(json, undefined, 2)
    );
  } catch (error) {}
}

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

  // Example
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
