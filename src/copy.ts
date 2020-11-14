import { promises as fs } from "fs";
import JSZip from "jszip";

type EditCallback = (
  fileContent: string,
  manifest: WebAppManifest
) => Promise<string>;

export type CopyAndEditFunction = (
  zip: JSZip,
  manifest: WebAppManifest,
  filePath: string
) => Promise<OperationResult>;

export type FilesAndEdit = {
  [filePath: string]: CopyAndEditFunction;
};

// Copies files and new manifest into the zip.
export function copyFiles(
  zip: JSZip,
  manifest: WebAppManifest,
  filesAndEdits: FilesAndEdit
) {
  const operations = [];

  for (const key of Object.keys(filesAndEdits)) {
    operations.push(filesAndEdits[key](zip, manifest, key));
  }

  return operations;
}

export async function copyFile(
  zip: JSZip,
  manifest: WebAppManifest,
  filePath: string
): Promise<OperationResult> {
  try {
    zip.file(filePath, getFileBufferAndEdit(filePath));

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
}

export function copyAndEditFile(editCb: EditCallback): CopyAndEditFunction {
  return async (zip: JSZip, manifest: WebAppManifest, filePath: string) => {
    try {
      zip.file(filePath, getFileBufferAndEdit(filePath, editCb, manifest));

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
  };
}

// TODO
// export async function copyFolder(
//   zip: JSZip,
//   manifest: WebAppManifest,
//   filePath: string
// ): Promise<OperationResult> {
//   try {
//   } catch (error) {
//     return {
//       filePath,
//     };
//   }
// }

export async function getFileBufferAndEdit(
  path: string,
  editCb?: EditCallback,
  manifest?: WebAppManifest
): Promise<Buffer> {
  const buf = await fs.readFile(`./assets/${path}`);
  const str = buf.toString("utf-8");

  if (editCb) {
    return Buffer.from(await editCb(str, manifest!));
  }

  return Buffer.from(str);
}

async function* a() {}
