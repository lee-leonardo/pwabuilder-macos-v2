import * as path from "path";
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

export async function copyFolder(
  zip: JSZip,
  manifest: WebAppManifest,
  folderPath: string
) {
  let filePath = folderPath;
  try {
    for await (filePath of generateAssetFilePaths(folderPath)) {
      if ((filePath as any) instanceof Error) {
        throw filePath;
      }
      zip.file(filePath, fs.readFile(filePath));
    }
    return {
      filePath: folderPath,
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

/*
  dynamically extends the contents searched (FIFO)
 */
async function* generateAssetFilePaths(folderPath: string) {
  const paths = [folderPath];
  try {
    for (let i = 0; i < paths.length; i++) {
      const current = paths[i];
      const stats = await fs.stat(current);

      if (stats.isFile()) {
        yield current;
      } else if (stats.isDirectory()) {
        const folderContents = (await fs.readdir(current)).map((file) =>
          path.resolve(folderPath, current, file)
        );

        paths.push(...folderContents);
      }
    }
  } catch (error) {
    return error;
  }
}
