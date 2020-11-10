/// <reference types="node" />

interface FileEntry {
  buffer: Buffer;
  fileName: string;
  type: string; // MIME Type
}
