import * as stream from "stream";
import * as Url from "url";
import JSZip from "jszip";
import Jimp from "jimp";
import fetch from "node-fetch";
import FormData from "form-data";

export async function getIconsFromManifest(
  baseUrl: string,
  manifest: WebAppManifest
): Promise<Map<string, Promise<Jimp>>> {
  const manifestMap: Map<string, Promise<Jimp>> = new Map();
  try {
    [...manifest.icons].forEach((imageInfo) => {
      const url = new Url.URL(imageInfo.src, baseUrl).toString();
      const jimp = Jimp.read(url);
      const sizes = imageInfo.sizes.split(" ");

      sizes.forEach((size) => {
        manifestMap.set(size, jimp);
      });
    });
  } catch (err) {
    throw new Error("failed to parse the icons array in the manifest");
  }

  return manifestMap;
}

export async function getLargestImg(
  jimpMap: Map<string, Promise<Jimp>>
): Promise<FileEntry | undefined> {
  try {
    let largest: {
      size: number;
      imageName: string;
      jimp: Promise<Jimp>;
    } = {
      size: 0,
      imageName: "1024x1024",
      jimp: Jimp.read("../assets/images/1024x1024.png"),
    };

    for (const entry of jimpMap.entries()) {
      const [dimensions, promise] = entry;
      const size = sizeOf(dimensions);
      if (largest.size < size) {
        largest = {
          size,
          imageName: dimensions,
          jimp: promise,
        };
      }
    }

    const img = await largest.jimp;
    return {
      buffer: await img?.getBufferAsync(img.getMIME()),
      fileName: largest.imageName + "." + img.getExtension(),
      type: img?.getMIME(),
    };
  } catch (err) {
    throw err;
  }
}

export async function getGeneratedIconZip(
  fileEntry: FileEntry,
  platform: string
): Promise<JSZip | undefined> {
  try {
    // TODO Icon file for file upload

    const form = new FormData();
    form.append("fileName", fileEntry.buffer, "icon");
    form.append("padding", "0.3");
    form.append("colorOption", "transparent");
    form.append("platform", platform);

    const response = await fetch(
      "https://appimagegenerator-prod.azurewebsites.net/api/image",
      {
        method: "POST",
        body: form,
      }
    );

    return JSZip.loadAsync(await response.buffer());
  } catch (err) {}
}

export async function createImageStreamFromJimp(
  jimpImage: Jimp
): Promise<JimpStreamInterface> {
  const buffer = await jimpImage.getBufferAsync(jimpImage.getMIME());
  const imageStream = new stream.Readable();
  imageStream.push(buffer);
  imageStream.push(null);

  return { stream: imageStream, buffer };
}

function sizeOf(size: string): number {
  return Number(size.split("x")[0]);
}
