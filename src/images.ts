import * as Url from "url";
import JSZip from "jszip";
import Jimp from "jimp";
import { getGeneratedIconZip } from "./imageGenerator";
import { FastifyInstance } from "fastify";

// Edits manifest entries to use new images and
export async function handleImages(
  server: FastifyInstance,
  zip: JSZip,
  manifest: WebAppManifest,
  siteUrl: string
): Promise<Array<OperationResult>> {
  try {
    const operations: Array<OperationResult> = [];

    //each image needs to be copied into two places, a manifest changes and also json write changes in the assets folder
    const largestImgEntry = getLargestImgManifestEntry(manifest);
    const genIconZip = getGeneratedIconZip(
      await getLargestImg(siteUrl, largestImgEntry),
      "ios"
    ).then();

    const manifestIcons = getIconsFromManifest(siteUrl, manifest);
    const icons = [...manifestIcons];

    // TODO now make a list of operations that add the files to the zip and monify entries in the manifest.

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

    return operations;
  } catch (error) {
    server.log.error(error);
    return [];
  }
}

export function getLargestImgManifestEntry(
  manifest: WebAppManifest
): ManifestImageResource {
  let largestIndex = 0;
  let largesSize = 0;
  manifest.icons.forEach((icon, index) => {
    icon.sizes.split(" ").forEach((size) => {
      const currentSize = sizeOf(size);
      if (currentSize > largesSize) {
        largestIndex = index;
        largesSize = currentSize;
      }
    });
  });

  return manifest.icons[largestIndex];
}

export function getLargestImg(
  baseUrl: string,
  manifestEntry: ManifestImageResource
): Promise<Jimp> {
  const url = new Url.URL(manifestEntry.src, baseUrl).toString();
  return Jimp.read(url);
}

export function getIconsFromManifest(
  baseUrl: string,
  manifest: WebAppManifest
): Map<string, Promise<Jimp>> {
  const manifestMap: Map<string, Promise<Jimp>> = new Map();

  manifest.icons.forEach((imageInfo) => {
    const url = new Url.URL(imageInfo.src, baseUrl).toString();
    const jimp = Jimp.read(url);
    const sizes = imageInfo.sizes.split(" ");

    sizes.forEach((size) => {
      manifestMap.set(size, jimp);
    });
  });

  return manifestMap;
}

function sizeOf(size: string): number {
  return Number(size.split("x")[0]);
}
