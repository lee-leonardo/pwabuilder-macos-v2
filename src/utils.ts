import * as Url from "url";
import JSZip from "jszip";
import fetch from "node-fetch";
import FormData from "form-data";

export async function downloadIcons(
  baseUrl: string,
  manifest: WebAppManifest
): Promise<JSZip> {
  const scopedUrl = Url.resolve(baseUrl, manifest.start_url);

  // manifest.icons
}

export async function getIconsFromManifest(
  baseUrl: string,
  manifest: WebAppManifest
): Promise<JSZip> {
  try {
    const zip = new JSZip();

    return zip;
  } catch (err) {}
}

export function getLargestImg(zip: JSZip): FileEntry {
  const dirQueue: Array<string> = [""];
  const zipContents: Array<JSZip.JSZipObject> = []
  let largest = {}

  for (let i = 0; i < dirQueue.length; i++) {
    const path = dirQueue[i];

    if (path === "") {
      zip.forEach((relativePath, file) => {

      });
    } else {
      zip.folder(path)?.forEach((relativePath, file) => {

      });
    }
  }
}

export async function getGeneratedIconZip(platform: string): Promise<JSZip> {
  try {
    // TODO Icon file for file upload

    const form = new FormData();
    form.append("fileName", /* BLOB */ "blob", "icon");
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

export async function createImageStreamFromJimp(jimpImage: Jimp): Promise<JimpStreamInterface> {
  const buffer = await jimpImage.getBufferAsync(jimpImage.getMIME());
  const imageStream = new stream.Readable();
  imageStream.push(buffer);
  imageStream.push(null);

  return { stream: imageStream, buffer };
}