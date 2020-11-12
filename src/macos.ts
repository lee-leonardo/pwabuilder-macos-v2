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
        const zip = new JSZip();
        const siteUrl = (request.params as any).siteUrl as string;
        const manifest = request.body as WebAppManifest;

        const result = await Promise.all([
          handleImages(zip, manifest, siteUrl),
          copyFiles(zip, manifest),
        ]);

        if (result) {
        }

        // reply.send() // zip
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

// Edits manifest entries to use new images and
function handleImages(zip: JSZip, manifest: WebAppManifest, siteUrl: string) {
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
}

// Copies files and new manifest into the zip.
function copyFiles(zip: JSZip, manifest: WebAppManifest) {
  const operations = [];

  for (const key of Object.keys(fileAndEdits)) {
    operations.push(fileAndEdits[key](zip, manifest, key));
  }

  return Promise.all(operations);
}

type EditFunction = (
  zip: JSZip,
  manifest: WebAppManifest,
  filePath: string
) => Promise<void>;

type FileAndEdit = {
  [filePath: string]: EditFunction;
};

const fileAndEdits: FileAndEdit = {
  "MacOSpwa/Base.lproj/Main.storyboard": async (zip, manifest, filePath) => {
    // TODO edit of the file here
  },

  // Example
  "MacOSpwa/manifest.json": async (zip, manifest, filePath) => {
    zip.file(filePath, JSON.stringify(manifest, undefined, 2));
  },
};
