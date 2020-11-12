import JSZip from "jszip";

export interface OperationResult {
  filePath: string;
  success: boolean;
  error?: Error;
}

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

  return Promise.all(operations).then((results) =>
    results.filter((result) => !result.success)
  );
}
