import * as stream from "stream";
import * as Url from "url";
import Jimp from "jimp";

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

export function getLargestImg(jimpMap: Map<string, Promise<Jimp>>): string {
  let largest: {
    size: number;
    dimensions: string;
  } = {
    size: 0,
    dimensions: "",
  };

  for (const entry of jimpMap.entries()) {
    const [dimensions, promise] = entry;
    const size = sizeOf(dimensions);
    if (largest.size < size) {
      largest = {
        size,
        dimensions,
      };
    }
  }

  return largest.dimensions;
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
